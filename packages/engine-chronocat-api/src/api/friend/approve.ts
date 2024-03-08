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

    await approvalFriendRequest({
      approvalInfo: {
        friendUid: ctx.chronocat.uix.getUid(uin)!,
        reqTime,
        accept: approve,
      },
    })

    return {}
  }
