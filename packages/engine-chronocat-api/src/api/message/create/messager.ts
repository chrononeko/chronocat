import type { Peer, Element as RedElement, RedMessage } from '@chronocat/red'
import { AtType, ChatType, FaceType } from '@chronocat/red'
import type {
  ChronocatContext,
  ChronocatSatoriServerConfig,
  Event,
} from '@chronocat/shell'
import type h from '@satorijs/element'
import { basename } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { O } from 'ts-toolbelt'
import type { Common } from '../../../common'
import { r } from './r'
import { unlink } from 'node:fs/promises'

class State {
  constructor(public type: 'message') {}
}

export class Messager {
  constructor(
    public ctx: ChronocatContext,
    public config: ChronocatSatoriServerConfig,
    public common: Common,
    public channelId: string,
  ) {
    this.peer = this.channelId.startsWith('private:')
      ? {
          chatType: ChatType.Private,
          peerUid: this.channelId.slice(8), // private:
        }
      : {
          chatType: ChatType.Group,
          peerUid: this.channelId,
          guildId: '',
        }
  }

  peer: Partial<Peer>

  public errors: Error[] = []
  public results: Event[] = []

  stack: State[] = [new State('message')]
  children: O.Partial<RedElement, 'deep'>[] = []

  prepare = async () => {}

  render = async (elements: h[], flush?: boolean) => {
    for (const element of elements) await this.visit(element)
    if (flush) await this.flush()
  }

  async send(content: h[]) {
    await this.prepare()
    await this.render(content)
    await this.flush()

    if (this.errors.length) throw this.errors
    else return this.results.filter(Boolean)
  }

  flush = async () => {
    if (this.text) {
      this.children.push(r.text(this.text))
      this.text = ''
    }

    if (!this.children.length) return

    this.normalize()

    await this.pushResult(
      await this.common.send(this.ctx, this.peer, this.children),
    )

    this.children = []
  }

  pushResult = async (result: RedMessage) => {
    const parsedEvents = await this.ctx.chronocat.api[
      'chronocat.internal.red.message.parse'
    ](result, this.config)

    if (parsedEvents) this.results.push(...parsedEvents)
  }

  private normalize = () => {
    this.children = this.children.reduce<O.Partial<RedElement, 'deep'>[]>(
      (acc, cur, idx) => {
        const last = acc[acc.length - 1]
        const isLastElement = idx === this.children.length - 1
        if (
          cur.textElement &&
          cur.textElement?.content &&
          cur.textElement?.atType === AtType.None &&
          last?.textElement &&
          last?.textElement?.content &&
          last?.textElement?.atType === AtType.None
        ) {
          last.textElement.content += cur.textElement.content

          if (isLastElement) {
            last.textElement.content = last.textElement.content.trimEnd()
          }
        } else {
          acc.push(cur)

          if (isLastElement && cur.textElement?.content) {
            cur.textElement.content = cur.textElement.content.trimEnd()
          }
        }
        return acc
      },
      [],
    )

    return this.children
  }

  private text = ''
  private isHardBreak = false

  visit = async (element: h) => {
    const { type, attrs, children } = element

    if (!['text', 'br', 'p'].includes(type)) {
      this.isHardBreak = false
      if (this.text) {
        this.children.push(r.text(this.text))
        this.text = ''
      }
    }

    switch (type) {
      case 'text': {
        // 文本消息
        this.text += attrs['content'] as string
        return
      }

      case 'br': {
        // 换行
        this.text += '\n'
        this.isHardBreak = true
        return
      }

      case 'p': {
        // 文本段落
        if (this.isHardBreak) {
          this.isHardBreak = false
          this.text += '\n'
        } else if (!this.text.endsWith('\n')) {
          this.text += '\n'
        }
        await this.render(children)
        this.text += '\n'
        return
      }

      case 'a': {
        // 超文本链接
        const url = attrs['href'] as string
        await this.render(children)
        if (url) {
          this.text += ` ( ${url} )`
        }
        return
      }

      case 'img': {
        // 图片消息
        const urlString = attrs['src'] as string
        if (!urlString && attrs['url']) {
          this.ctx.chronocat.l.error(
            'Satori 协议内没有 url 属性。想要指定的是否是 src？',
            {
              code: 2143,
            },
          )
          return
        }
        const result = await this.common.save(this.ctx, urlString, {
          fileName: attrs['chronocat:filename'] as string | undefined,
          fileMime: attrs['chronocat:mime'] as string | undefined,
        })

        let picType: number
        switch (result.imageInfo?.type) {
          case 'png': {
            picType = 1001
            break
          }

          case 'gif': {
            picType = 2000
            break
          }

          default: {
            picType = 1000
            break
          }
        }

        this.children.push(r.remoteImage(result, picType))
        return
      }

      case 'audio': {
        // 语音消息
        const urlString = attrs['src'] as string
        if (!urlString && attrs['url']) {
          this.ctx.chronocat.l.error(
            'Satori 协议内没有 url 属性。想要指定的是否是 src？',
            {
              code: 2143,
            },
          )
          return
        }

        const file = await this.common.file(this.ctx, urlString, {
          fileName: attrs['chronocat:filename'] as string | undefined,
          fileMime: attrs['chronocat:mime'] as string | undefined,
        })

        if (file.fileMime === 'audio/silk') {
          // SILK 直接发送
          // 即使用户传的 SILK 并非 NTSilk 也直接发送，不做特殊处理了
          await file.commit()

          if (
            this.ctx.chronocat.api.has('chronocat.internal.media.ntsilk.encode')
          ) {
            // TODO: 获取媒体信息

            this.children.push(
              r.remoteAudio(
                {
                  ...file,
                  filePath: file.dstPath,
                },
                1,
              ),
            )

            return
          } else {
            this.ctx.chronocat.l.warn(
              '未加载 media 引擎，无法获取音频信息。此问题不影响音频发送。',
              {
                code: 2161,
              },
            )

            this.children.push(
              r.remoteAudio(
                {
                  ...file,
                  filePath: file.dstPath,
                },
                1,
              ),
            )

            return
          }
        } else {
          if (
            this.ctx.chronocat.api.has('chronocat.internal.media.ntsilk.encode')
          ) {
            const dstPath = await this.common.generateUploadPath(
              this.ctx,
              '.ntsilk',
            )

            try {
              const encodeResult = await this.ctx.chronocat.api[
                'chronocat.internal.media.ntsilk.encode'
              ]({
                srcPath: file.srcPath,
                dstPath,
              })

              // 删除源文件
              file.cancel()

              const amrFile = await this.common.save(
                this.ctx,
                pathToFileURL(dstPath).toString(),
                {
                  fileName: `${basename(dstPath)}.amr`,
                  fileMime: 'audio/amr',
                },
              )

              void unlink(dstPath)

              this.children.push(
                r.remoteAudio(
                  amrFile,
                  encodeResult.duration
                    ? Math.ceil(encodeResult.duration / 100)
                    : 1,
                  encodeResult.waveAmplitudes,
                ),
              )

              return
            } catch (cause) {
              this.ctx.chronocat.l.warn(
                new Error('音频转码失败。将跳过音频发送。', {
                  cause,
                }),
                {
                  code: 2163,
                },
              )

              // 清理未转码文件
              file.cancel()

              return
            }
          } else {
            this.ctx.chronocat.l.warn(
              '未加载 media 引擎，无法进行音频转码。将仍然尝试直接发送。',
              {
                code: 2161,
              },
            )

            await file.commit()

            this.children.push(
              r.remoteAudio(
                {
                  ...file,
                  filePath: file.dstPath,
                },
                1,
              ),
            )

            return
          }
        }
      }

      case 'file': {
        // 文件消息
        const urlString = attrs['src'] as string
        if (!urlString && attrs['url']) {
          this.ctx.chronocat.l.error(
            'Satori 协议内没有 url 属性。想要指定的是否是 src？',
            {
              code: 2143,
            },
          )
          return
        }
        const result = await this.common.save(this.ctx, urlString, {
          fileName: attrs['chronocat:filename'] as string | undefined,
          fileMime: attrs['chronocat:mime'] as string | undefined,
        })
        this.children.push(r.remoteFile(result))
        return
      }

      case 'at': {
        // at 消息
        if (attrs['type'] === 'all') {
          this.children.push(r.at(this.ctx, '全体成员', 'all'))
        } else {
          this.children.push(
            r.at(this.ctx, attrs['name'] as string, attrs['id'] as string),
          )
        }
        return
      }

      case `${this.ctx.chronocat.platform}:pcpoke`: {
        if (!this.channelId.startsWith('private:'))
          this.ctx.chronocat.l.warn('在群聊中发送 pcpoke 不安全，请注意。', {
            code: 2153,
          })
        await this.flush()
        this.children.push(r.pcPoke(Number(attrs['id'] || 1)))
        await this.flush()
        return
      }

      case `${this.ctx.chronocat.platform}:face`: {
        if (attrs['unsafeMarketEmoticon']) {
          this.children.push(r.marketEmoticon(Number(attrs['id'])))
        } else {
          const face = (await this.ctx.chronocat.api[
            'chronocat.internal.qface.get'
          ](`${attrs['id']}`))!

          this.children.push(
            r.face(
              face,
              attrs['unsafeSuper']
                ? FaceType.Super
                : face.QSid === face.IQLid && face.QSid === face.AQLid
                  ? FaceType.Normal2
                  : FaceType.Normal1,
            ),
          )
        }
        return
      }

      case `${this.ctx.chronocat.platform}:marketface`: {
        this.children.push(
          r.marketFace(
            Number(attrs['tabId']),
            attrs['faceId'] as string,
            attrs['key'] as string,
          ),
        )
        return
      }

      case `${this.ctx.chronocat.platform}:facebubble`: {
        this.children.push(
          r.faceBubble(
            Number(attrs['id']),
            Number(attrs['count']),
            attrs['name'] as string,
            attrs['content'] as string,
          ),
        )
        return
      }

      case 'quote': {
        const [author] = this.ctx.chronocat.h.select(children, 'author')

        this.children.push(
          r.reply(
            attrs['id'] as string | undefined,
            attrs['chronocat:seq'] as string | undefined,
            (author?.attrs['id'] as string | undefined) || undefined,
          ),
        )
        return
      }

      case 'message': {
        // 前面的消息直接发送，开始一条新消息
        await this.flush()

        if ('forward' in attrs) {
          // 转发消息
          if ('id' in attrs) {
            // 获取并转发单条消息。不支持，使用兜底行为
            await this.render(children)
          } else if (children.every((x) => 'id' in x)) {
            // 普通合并转发消息
            await this.pushResult(
              await this.common.sendForward(
                this.ctx,
                this.peer,
                children.map((x) => ({
                  msgId: x.attrs['id'] as string,
                  senderShowName: 'QQ用户',
                })),
              ),
            )
          } else {
            //伪造合并转发消息。本引擎不支持，使用兜底行为
            await this.render(children)
          }
        } else {
          // 普通切割消息
          await this.render(children, true)
        }
        return
      }

      case 'image': {
        this.ctx.chronocat.l.error(
          'Satori 协议内没有 <image/> 元素。想要发送的是否是 <img/>？',
          {
            code: 2143,
          },
        )
        return
      }

      default: {
        // 兜底
        await this.render(children)
        return
      }
    }
  }
}
