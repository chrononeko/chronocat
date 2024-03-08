import type {
  ChannelMemberMutePayload,
  ChronocatContext,
} from '@chronocat/shell'
import { setMemberShutUp } from '../../../definitions/groupService'

export const buildChannelMemberMute =
  (ctx: ChronocatContext) =>
  async ({ channel_id, user_id, duration }: ChannelMemberMutePayload) => {
    await setMemberShutUp({
      groupCode: channel_id,

      memList: [
        {
          uid: ctx.chronocat.uix.getUid(user_id),
          timeStamp: duration,
        },
      ],
    })

    return {}
  }
