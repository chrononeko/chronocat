import h from '@satorijs/element'
import { link } from 'logiri'
import { grey } from '../../utils/colors'
import { PLATFORM } from '../../utils/consts'

type DisplayComponent = string

// const prepare = async () => {}

const render = async (elements: h[]): Promise<DisplayComponent[] | false> => {
  if (!elements.length) return ['空消息']
  const result = await Promise.all(elements.map(visit))
  if (result.every((x) => x === false)) return false
  return result.flatMap((x) => (x === false ? ['[不支持的消息]'] : x))
}

export const send = async (
  content: string | null | undefined,
): Promise<DisplayComponent[]> => {
  if (!content) return ['空消息']
  // await prepare()
  const elements = h.normalize(content)
  let result = await render(elements)
  if (result === false) result = ['[不支持的消息]']
  return result
}

const visit = async (element: h): Promise<DisplayComponent[] | false> => {
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

    case 'video': {
      return [link('[视频]', attrs['src'] as string)]
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

    case `${PLATFORM}:poke`: {
      return ['[戳一戳]']
    }

    case `${PLATFORM}:pcpoke`: {
      return ['[窗口抖动]']
    }

    case `${PLATFORM}:face`: {
      let result = ''

      let description = '表情'
      if (attrs['unsafe-super']) description = '超级表情'
      if (attrs['unsafe-market-emoticon']) description = 'Emoticon 表情'

      result = link(
        `[${description}]`,
        h.select(children, 'img')?.[0]?.attrs['src'] as string | undefined,
      )

      if (attrs['unsafe-result-id'])
        result += ` 掷骰结果：${attrs['unsafe-result-id']}`
      if (attrs['unsafe-chain-count'])
        result += ` 接龙个数：${attrs['unsafe-chain-count']}`
      return [result]
    }

    case `${PLATFORM}:marketface`: {
      return [
        link(
          `[商城表情]`,
          h.select(children, 'img')?.[0]?.attrs['src'] as string | undefined,
        ),
      ]
    }

    case `${PLATFORM}:facebubble`: {
      return [
        link(
          `[气泡表情]`,
          h.select(children, 'img')?.[0]?.attrs['src'] as string | undefined,
        ),
      ]
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
        const result = await render(children)
        if (result) return ['[切割消息]', ...result]
        else return ['[切割消息]']
      }
    }

    default: {
      // 兜底
      return await render(children)
    }
  }
}
