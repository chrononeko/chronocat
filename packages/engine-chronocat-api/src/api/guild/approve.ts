import type { ApprovePayload, ChronocatContext } from '@chronocat/shell'
import { operateSysNotify } from '../../definitions/groupService'

export const buildGuildApprove =
  (ctx: ChronocatContext) =>
  async ({ message_id, approve, comment }: ApprovePayload) => {
    if (comment)
      ctx.chronocat.l.warn(
        '不支持处理群申请时附加备注消息。备注消息将会被忽略。',
        {
          code: 2144,
        },
      )

    if (!approve) {
      ctx.chronocat.l.error('暂不支持拒绝群申请。', { code: 2145 })
      throw new Error('暂不支持拒绝群申请。')
    }

    // 这个是同意发过来的小卡片
    await operateSysNotify({
      doubt: false,
      operateMsg: {
        operateType: 1,
        targetMsg: {
          seq: '',
          type: 1,
          groupCode: message_id,
          postscript: '',
        },
      },
    })

    return {}
  }
