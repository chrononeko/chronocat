import type { ChannelMutePayload, ChronocatContext } from '@chronocat/shell'
import { setGroupShutUp } from '../../definitions/groupService'

export const buildChannelMute =
  (_ctx: ChronocatContext) =>
  async ({ channel_id, enable }: ChannelMutePayload) => {
    await setGroupShutUp({
      groupCode: channel_id,
      shutUp: enable,
    })

    return {}
  }
