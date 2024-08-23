import type {
  ChannelMemberMutePayload,
  ChronocatContext,
} from '@chronocat/shell'
import { setMemberShutUp } from '../../../definitions/groupService'

export const buildChannelMemberMute =
  (ctx: ChronocatContext) =>
  async ({ channel_id, user_id, duration }: ChannelMemberMutePayload) => {
    const uid = await ctx.chronocat.uix.getUid2(user_id, channel_id)
    if (!uid) {
      ctx.chronocat.l.error('内部错误', {
        code: 2152,
        throw: true,
      })
      return {}
    }

    await setMemberShutUp({
      groupCode: channel_id,

      memList: [
        {
          uid,
          timeStamp: duration,
        },
      ],
    })

    return {}
  }
