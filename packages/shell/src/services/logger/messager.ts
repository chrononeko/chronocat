import h from '@satorijs/element'
import { link } from 'logiri'
import { grey } from '../../utils/colors'

type DisplayComponent = string

export class LogiriMessager {
  prepare = async () => {}

  render = async (elements: h[]): Promise<DisplayComponent[] | false> => {
    if (!elements.length) return ['空消息']
    const result = await Promise.all(elements.map(this.visit))
    if (result.every((x) => x === false)) return false
    return result.flatMap((x) => (x === false ? ['[不支持的消息]'] : x))
  }

  send = async (
    content: string | null | undefined,
  ): Promise<DisplayComponent[]> => {
    if (!content) return ['空消息']
    await this.prepare()
    const elements = h.normalize(content)
    let result = await this.render(elements)
    if (result === false) result = ['[不支持的消息]']
    return result
  }

  visit = async (element: h): Promise<DisplayComponent[] | false> => {
    const { type, attrs, children } = element

    switch (type) {
      case 'text': {
        return [attrs['content'] as string]
      }

      case 'img': {
        return [link('[图片]', attrs['src'] as string)]
      }

      case 'audio': {
        return [link('[语音]', attrs['src'] as string)]
      }

      case 'file': {
        return [link('[文件]', attrs['src'] as string)]
      }

      case 'at': {
        if (attrs['type'] === 'all') return ['@全体成员 ']
        else return [`@${attrs['name'] as string}(${attrs['id'] as string}) `]
      }

      case 'quote': {
        const [author] = h.select(children, 'author')
        const id = author?.attrs['id'] as string | undefined

        return [
          grey(
            id
              ? `${link(
                  `[回复${id}]`,
                  `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${id}&spec=640`,
                )} `
              : `[回复] `,
          ),
        ]
      }

      case 'chronocat:poke': {
        return ['[戳一戳]']
      }

      case 'message': {
        if ('forward' in attrs) {
          if ('id' in attrs) {
            return ['[单条转发消息]']
          } else if (children.every((x) => 'id' in x)) {
            return ['[普通合并转发消息]']
          } else {
            return ['[伪造合并转发消息]']
          }
        } else {
          // 普通切割消息
          const result = await this.render(children)
          if (result) return ['[切割消息]', ...result]
          else return ['[切割消息]']
        }
      }

      default: {
        // 兜底
        return await this.render(children)
      }
    }
  }
}
