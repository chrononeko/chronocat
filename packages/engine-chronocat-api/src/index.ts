import type { RedIpcArgs } from '@chronocat/red'
import type { ChronocatContext } from '@chronocat/shell'
import { ipcMan } from 'ipcman'
import { buildChannelGet } from './api/channel/get'
import { buildChannelList } from './api/channel/list'
import { buildChannelMemberMute } from './api/channel/member/mute'
import { buildChannelMute } from './api/channel/mute'
import { buildGuildGet } from './api/guild/get'
import { buildAssetsGet } from './api/internal/assets/get'
import { qfaceGet, qfaceList } from './api/internal/qface'
import { buildLoginGet } from './api/login/get'
import { buildMessageCreate } from './api/message/create'
import { buildUserChannelCreate } from './api/user/channel/create'
import { buildHandler } from './handler'

declare const __DEFINE_CHRONO_VERSION__: string

export const name = 'engine-chronocat-api'
export const version = __DEFINE_CHRONO_VERSION__

export const apply = async (ctx: ChronocatContext) => {
  ipcMan<RedIpcArgs>({
    handler: buildHandler(ctx),
    getId: (p) => p?.[0]?.callbackId,
  })

  const register = ctx.chronocat.api.register(name)
  register('chronocat.internal.assets.get', buildAssetsGet(ctx))
  register('channel.list', buildChannelList(ctx))
  register('channel.get', buildChannelGet(ctx))
  register('unsafe.channel.mute', buildChannelMute(ctx))
  register('unsafe.channel.member.mute', buildChannelMemberMute(ctx))
  register('user.channel.create', buildUserChannelCreate(ctx))
  register('guild.get', buildGuildGet(ctx))
  register('message.create', buildMessageCreate(ctx))
  register('login.get', buildLoginGet(ctx))
  register('chronocat.internal.message.create.forward', buildMessageCreate(ctx))

  await ctx.chronocat.whenReady()

  register('chronocat.internal.qface.get', qfaceGet)
  register('chronocat.internal.qface.list', qfaceList)
}
