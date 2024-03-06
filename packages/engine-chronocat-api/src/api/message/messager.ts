import type { Peer, Element as RedElement } from '@chronocat/red'
import { ChatType, FaceType } from '@chronocat/red'
import type {
  ChronocatContext,
  ChronocatSatoriServerConfig,
  Message,
} from '@chronocat/shell'
import type h from '@satorijs/element'
import type { O } from 'ts-toolbelt'
import type { Common } from '../../common'
import { r } from './r'

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
  public results: Message[] = []

  stack: State[] = [new State('message')]
  children: O.Partial<RedElement, 'deep'>[] = []

  prepare = async () => {}

  render = async (elements: h[], flush?: boolean) => {
    for (const element of elements) await this.visit(element)
    if (flush) await this.flush()
  }

  async send(content: h.Fragment) {
    await this.prepare()
    const elements = this.ctx.chronocat.h.normalize(content)
    await this.render(elements)
    await this.flush()

    if (this.errors.length) throw this.errors
    else return this.results.filter(Boolean) // .map(({ id }) => ({ id }))
  }

  flush = async () => {
    if (!this.children.length) return

    const result = await this.common.send(this.ctx, this.peer, this.children)

    const parsedEvents = await this.ctx.chronocat.api[
      'chronocat.internal.red.message.parse'
    ](result, this.config)

    if (parsedEvents)
      for (const parsedEvent of parsedEvents)
        if (parsedEvent.message) this.results.push(parsedEvent.message)

    this.children = []
  }

  // private normalize = () => {}

  // private isEndLine = () => {}

  visit = async (element: h) => {
    const { type, attrs, children } = element

    switch (type) {
      case 'text': {
        // 文本消息
        this.children.push(r.text(attrs['content'] as string))
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
        const result = await this.common.save(this.ctx, urlString, {
          fileName: attrs['chronocat:filename'] as string | undefined,
          fileMime: attrs['chronocat:mime'] as string | undefined,
        })
        this.children.push(r.remoteAudio(result, 1))
        return
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
        this.children.push(
          r.face(
            (await this.ctx.chronocat.api['chronocat.internal.qface.get'](
              `${attrs['id']}`,
            ))!,
            attrs['unsafe-super'] ? FaceType.Super : FaceType.Normal,
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
            (author?.attrs['user-id'] as string | undefined) || undefined,
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
            await this.common.sendForward(
              this.ctx,
              this.peer,
              children.map((x) => ({
                msgId: x.attrs['id'] as string,
                senderShowName: 'QQ用户',
              })),
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
