import type {
  ChronocatContext,
  FriendListResponse,
  Next,
} from '@chronocat/shell'
import { getBuddyList } from '../../definitions/nodeStore'
import { chronoEventEmitter, friendMap } from '../../globalVars'

export const buildFriendList =
  (ctx: ChronocatContext) =>
  async (_: Next): Promise<FriendListResponse> => {
    await new Promise<void>((res, rej) => {
      chronoEventEmitter.once('buddyListChange', res)
      setTimeout(rej, ctx.chronocat.timeout)
      void getBuddyList()
    }).catch(() =>
      ctx.chronocat.l.warn('获取最新好友列表失败，将使用上次的结果。', {
        code: 2146,
      }),
    )

    await ctx.chronocat.sleep(1000)

    return {
      data: Object.values(friendMap).map((x) => ({
        id: x.uin,
        name: x.nick,
        nick: x.remark || undefined,
        avatar: `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${x.uin}&spec=640`,
        is_bot: false,
      })),
    }
  }
