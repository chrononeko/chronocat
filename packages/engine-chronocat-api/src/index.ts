import type { RedIpcArgs } from '@chronocat/red'
import type { ChronocatContext } from '@chronocat/shell'
import { ipcMan } from 'ipcman'
import { buildChannelGet } from './api/channel/get'
import { buildChannelList } from './api/channel/list'
import { buildChannelMemberMute } from './api/channel/member/mute'
import { buildChannelMute } from './api/channel/mute'
import { buildFriendApprove } from './api/friend/approve'
import { buildFriendList } from './api/friend/list'
import { buildFriendRemove } from './api/friend/remove'
import { buildGuildApprove } from './api/guild/approve'
import { buildGuildGet } from './api/guild/get'
import { buildGuildList } from './api/guild/list'
import { buildGuildMemberGet } from './api/guild/member/get'
import { buildGuildMemberKick } from './api/guild/member/kick'
import { buildGuildMemberList } from './api/guild/member/list'
import { buildGuildMemberMute } from './api/guild/member/mute'
import { buildGuildRemove } from './api/guild/remove'
import { buildAssetsGet } from './api/internal/assets/get'
import { qfaceGet, qfaceList } from './api/internal/qface'
import { buildLoginGet } from './api/login/get'
import { buildMessageCreate } from './api/message/create'
import { buildMessageDelete } from './api/message/delete'
import { buildMessageGet } from './api/message/get'
import { buildMessageList } from './api/message/list'
import { buildUserChannelCreate } from './api/user/channel/create'
import { buildUserGet } from './api/user/get'
import { buildHandler } from './handler'
import { msgBoxActiv } from './services/msgBoxActiv'

declare const __DEFINE_CHRONO_VERSION__: string

export const name = 'engine-chronocat-api'
export const version = __DEFINE_CHRONO_VERSION__

export const apply = async (ctx: ChronocatContext) => {
  ctx.chronocatEngineChronocatApi = {
    msgBoxActiv: msgBoxActiv(ctx),
  }

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
  register('guild.list', buildGuildList(ctx))
  register('guild.approve', buildGuildApprove(ctx))
  register('guild.remove', buildGuildRemove(ctx))
  register('guild.member.get', buildGuildMemberGet(ctx))
  register('guild.member.list', buildGuildMemberList(ctx))
  register('guild.member.kick', buildGuildMemberKick(ctx))
  register('guild.member.mute', buildGuildMemberMute(ctx))
  register('message.create', buildMessageCreate(ctx))
  register('chronocat.internal.message.create.forward', buildMessageCreate(ctx))
  register('message.get', buildMessageGet(ctx))
  register('message.delete', buildMessageDelete(ctx))
  register('message.list', buildMessageList(ctx))
  register('login.get', buildLoginGet(ctx))
  register('user.get', buildUserGet(ctx))
  register('friend.list', buildFriendList(ctx))
  register('friend.approve', buildFriendApprove(ctx))
  register('unsafe.friend.remove', buildFriendRemove(ctx))

  await ctx.chronocat.whenReady()

  register('chronocat.internal.qface.get', qfaceGet)
  register('chronocat.internal.qface.list', qfaceList)
}
