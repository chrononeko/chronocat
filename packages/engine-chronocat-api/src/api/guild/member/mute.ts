import type { ChronocatContext, GuildMemberMutePayload } from '@chronocat/shell'
import { setMemberShutUp } from '../../../definitions/groupService'

export const buildGuildMemberMute =
  (ctx: ChronocatContext) =>
  async ({ guild_id, user_id, duration }: GuildMemberMutePayload) => {
    const uid = await ctx.chronocat.uix.getUid2(user_id, guild_id)
    if (!uid) {
      ctx.chronocat.l.error('内部错误', {
        code: 2152,
        throw: true,
      })
      return {}
    }

    await setMemberShutUp({
      groupCode: guild_id,

      memList: [
        {
          uid,
          timeStamp: Math.floor(duration / 1000),
        },
      ],
    })

    return {}
  }
