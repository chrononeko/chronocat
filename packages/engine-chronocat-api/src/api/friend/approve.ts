import type { ApprovePayload, ChronocatContext } from '@chronocat/shell'
import { approvalFriendRequest } from '../../definitions/buddyService'

export const buildFriendApprove =
  (ctx: ChronocatContext) =>
  async ({ message_id, approve, comment }: ApprovePayload) => {
    if (comment)
      ctx.chronocat.l.warn(
        '不支持处理好友申请时附加备注消息。备注消息将会被忽略。',
        {
          code: 2144,
        },
      )

    const [uin, reqTime] = message_id.split(':') as [string, string]

    const friendUid = await ctx.chronocat.uix.getUid2(uin)
    if (!friendUid) {
      ctx.chronocat.l.error('内部错误', {
        code: 2152,
        throw: true,
      })
      return {}
    }

    await approvalFriendRequest({
      approvalInfo: {
        friendUid,
        reqTime,
        accept: approve,
      },
    })

    return {}
  }
