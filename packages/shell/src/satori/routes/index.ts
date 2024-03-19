import { channelGet } from './channel/get'
import { channelList } from './channel/list'
import { channelMemberMute } from './channel/member/mute'
import { channelMute } from './channel/mute'
import { friendApprove } from './friend/approve'
import { friendList } from './friend/list'
import { friendRemove } from './friend/remove'
import { guildApprove } from './guild/approve'
import { guildGet } from './guild/get'
import { guildList } from './guild/list'
import { guildMemberGet } from './guild/member/get'
import { guildMemberKick } from './guild/member/kick'
import { guildMemberList } from './guild/member/list'
import { guildMemberMute } from './guild/member/mute'
import { guildRemove } from './guild/remove'
import { loginGet } from './login/get'
import { messageCreate } from './message/create'
import { messageDelete } from './message/delete'
import { messageGet } from './message/get'
import { messageList } from './message/list'
import { notImplemented } from './notimpl'
import type { Route } from './types'
import { userChannelCreate } from './user/channel/create'
import { userGet } from './user/get'

const routesIntl = {
  'channel.get': channelGet,
  'channel.list': channelList,
  'channel.create': notImplemented,
  'channel.update': notImplemented,
  'channel.delete': notImplemented,
  'unsafe.channel.mute': channelMute,
  'unsafe.channel.member.mute': channelMemberMute,
  'user.channel.create': userChannelCreate,
  'guild.get': guildGet,
  'guild.list': guildList,
  'guild.approve': guildApprove,
  'unsafe.guild.remove': guildRemove,
  'guild.member.get': guildMemberGet,
  'guild.member.list': guildMemberList,
  'guild.member.kick': guildMemberKick,
  'guild.member.approve': notImplemented,
  'guild.member.mute': guildMemberMute,
  'guild.member.role.set': notImplemented,
  'guild.member.role.unset': notImplemented,
  'guild.role.list': notImplemented,
  'guild.role.create': notImplemented,
  'guild.role.update': notImplemented,
  'guild.role.delete': notImplemented,
  'login.get': loginGet,
  'message.create': messageCreate,
  'message.get': messageGet,
  'message.delete': messageDelete,
  'message.update': notImplemented,
  'message.list': messageList,
  'reaction.create': notImplemented,
  'reaction.delete': notImplemented,
  'reaction.clear': notImplemented,
  'reaction.list': notImplemented,
  'user.get': userGet,
  'friend.list': friendList,
  'friend.approve': friendApprove,
  'unsafe.friend.remove': friendRemove,
} as const

export type Routes = keyof typeof routesIntl

export const routes: Record<Routes, Route> = routesIntl
