import { ChatType } from '@chronocat/red'
import type { ChronocatContext, MessageDeletePayload } from '@chronocat/shell'
import { recallMsg } from '../../definitions/msgService'

export const buildMessageDelete =
  (ctx: ChronocatContext) =>
  async ({ channel_id, message_id }: MessageDeletePayload) => {
    const privatePeerUid = await ctx.chronocat.uix.getUid2(channel_id.slice(8)) // private:
    if (!privatePeerUid) {
      ctx.chronocat.l.error('内部错误', {
        code: 2152,
        throw: true,
      })
      return {}
    }

    await recallMsg({
      peer: channel_id.startsWith('private:')
        ? {
            chatType: ChatType.Private,
            peerUid: privatePeerUid,
          }
        : {
            chatType: ChatType.Group,
            peerUid: channel_id,
            guildId: '',
          },
      msgIds: [message_id],
    })

    return {}
  }
