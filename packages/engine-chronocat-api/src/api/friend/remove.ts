import type { ChronocatContext, UserPayload } from '@chronocat/shell'
import { delBuddy } from '../../definitions/buddyService'

export const buildFriendRemove =
  (ctx: ChronocatContext) =>
  async ({ user_id }: UserPayload) => {
    await delBuddy({
      delInfo: {
        friendUid: ctx.chronocat.uix.getUid(user_id)!,
        tempBlock: false,
        tempBothDel: true,
      },
    })

    return {}
  }
