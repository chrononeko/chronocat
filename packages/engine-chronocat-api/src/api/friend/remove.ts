import type { ChronocatContext, UserPayload } from '@chronocat/shell'
import { delBuddy } from '../../definitions/buddyService'

export const buildFriendRemove =
  (ctx: ChronocatContext) =>
  async ({ user_id }: UserPayload) => {
    const friendUid = await ctx.chronocat.uix.getUid2(user_id)
    if (!friendUid) {
      ctx.chronocat.l.error('内部错误', {
        code: 2152,
        throw: true,
      })
      return {}
    }

    await delBuddy({
      delInfo: {
        friendUid,
        tempBlock: false,
        tempBothDel: true,
      },
    })

    return {}
  }
