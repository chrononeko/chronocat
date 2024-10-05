import type { ApprovePayload, ChronocatContext } from '@chronocat/shell'
import { operateSysNotify } from '../../definitions/groupService'

export const buildGuildApprove =
  (ctx: ChronocatContext) =>
  async ({ message_id, approve, comment }: ApprovePayload) => {
    if (comment)
      ctx.chronocat.l.warn(
        '不支持处理群邀请时附加备注消息。备注消息将会被忽略。',
        {
          code: 2144,
        },
      )

    const [seq, groupCode] = message_id.split(':')

    if (!seq || !groupCode)
      ctx.chronocat.l.warn('message_id 不合法。将仍然尝试处理加群请求。')

    await operateSysNotify({
      doubt: false,
      operateMsg: {
        operateType: approve ? 1 : 2,
        targetMsg: {
          seq: seq!,
          type: 1,
          groupCode: groupCode!,
          postscript: '',
        },
      },
    })

    return {}
  }
