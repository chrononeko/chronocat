import type { ApprovePayload, ChronocatContext } from '@chronocat/shell'
import { operateSysNotify } from '../../../definitions/groupService'

export const buildGuildMemberApprove =
  (ctx: ChronocatContext) =>
  async ({ message_id, approve, comment }: ApprovePayload) => {
    if (comment)
      ctx.chronocat.l.warn(
        '不支持处理群申请时附加备注消息。备注消息将会被忽略。',
        {
          code: 2144,
        },
      )

    const [seq, groupCode, doubt] = message_id.split(':')

    if (!seq || !groupCode || !doubt)
      ctx.chronocat.l.warn('message_id 不合法。将仍然尝试处理加群请求。')

    // 这个是同意发过来的小卡片
    await operateSysNotify({
      doubt: doubt! === '1',
      operateMsg: {
        operateType: approve ? 1 : 2,
        targetMsg: {
          seq: seq!,
          type: 7,
          groupCode: groupCode!,
          postscript: '',
        },
      },
    })

    return {}
  }
