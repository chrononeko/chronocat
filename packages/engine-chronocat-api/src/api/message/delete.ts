import { ChatType } from '@chronocat/red'
import type { ChronocatContext, MessageDeletePayload } from '@chronocat/shell'
import { recallMsg } from '../../definitions/msgService'

export const buildMessageDelete =
  (ctx: ChronocatContext) =>
  async ({ channel_id, message_id }: MessageDeletePayload) => {
    await recallMsg({
      peer: channel_id.startsWith('private:')
        ? {
            chatType: ChatType.Private,
            peerUid: ctx.chronocat.uix.getUid(channel_id.slice(8))!, // private:
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
