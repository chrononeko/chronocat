import type { ChronocatContext, GuildMemberMutePayload } from '@chronocat/shell'
import { setMemberShutUp } from '../../../definitions/groupService'

export const buildGuildMemberMute =
  (ctx: ChronocatContext) =>
  async ({ channel_id, user_id, duration }: GuildMemberMutePayload) => {
    await setMemberShutUp({
      groupCode: channel_id,

      memList: [
        {
          uid: ctx.chronocat.uix.getUid(user_id),
          timeStamp: Math.floor(duration / 1000),
        },
      ],
    })

    return {}
  }
