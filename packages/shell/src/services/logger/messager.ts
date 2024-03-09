import h from '@satorijs/element'
import { link } from 'logiri'
import { grey } from '../../utils/colors'

export class LogiriMessager {
  private children: string[] = []
  private results: string[] = []

  prepare = async () => {}

  render = async (elements: h[], flush?: boolean) => {
    for (const element of elements) await this.visit(element)
    if (flush) await this.flush()
  }

  send = async (content: string | null | undefined) => {
    if (!content) return []
    await this.prepare()
    const elements = h.normalize(content)
    await this.render(elements)
    await this.flush()
    return this.results.filter(Boolean)
  }

  flush = async () => {
    if (!this.children.length) return
    this.results.push(
      this.children.join('').replace(/\r/g, '').replace(/\n/g, ' '),
    )
    this.children = []
  }

  visit = async (element: h) => {
    const { type, attrs, children } = element

    switch (type) {
      case 'text': {
        this.children.push(attrs['content'] as string)
        return
      }

      case 'img': {
        this.children.push(link('[图片]', attrs['src'] as string))
        return
      }

      case 'audio': {
        this.children.push(link('[语音]', attrs['src'] as string))
        return
      }

      case 'file': {
        this.children.push(link('[文件]', attrs['src'] as string))
        return
      }

      case 'at': {
        if (attrs['type'] === 'all') this.children.push('@全体成员 ')
        else
          this.children.push(
            `@${attrs['name'] as string}(${attrs['id'] as string}) `,
          )
        return
      }

      case 'quote': {
        const [author] = h.select(children, 'author')
        const id = author?.attrs['user-id'] as string | undefined

        this.children.push(
          grey(
            id
              ? `${link(
                  `[回复${id}]`,
                  `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${id}&spec=640`,
                )} `
              : `[回复] `,
          ),
        )
        return
      }

      case 'chronocat:poke': {
        this.children.push('[戳一戳]')
        return
      }

      case 'message': {
        // 前面的消息直接发送，开始一条新消息
        await this.flush()

        if ('forward' in attrs) {
          if ('id' in attrs) {
            this.children.push('[单条转发消息]')
          } else if (children.every((x) => 'id' in x)) {
            this.children.push('[普通合并转发消息]')
          } else {
            this.children.push('[伪造合并转发消息]')
          }
        } else {
          // 普通切割消息
          await this.render(children, true)
        }
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
