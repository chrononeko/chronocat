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

// 使用一个全局常量__DEFINE_CHRONO_VERSION__来声明模块的版本。
// 这个常量的值在构建过程中被定义。
declare const __DEFINE_CHRONO_VERSION__: string

// 定义模块的名称和版本。
export const name = 'engine-chronocat-api'
export const version = __DEFINE_CHRONO_VERSION__

// apply函数用于配置和初始化模块。
// 它接受一个上下文对象ctx，这个对象提供了与应用程序框架交互的能力。
export const apply = async (ctx: ChronocatContext) => {
  // 在ctx对象上配置一个特定的属性，用于存储消息盒子活动化的功能。
  ctx.chronocatEngineChronocatApi = {
    msgBoxActiv: msgBoxActiv(ctx),
  }

  // 使用ipcMan函数来配置IPC（进程间通信）的处理逻辑。
  // 它依赖于buildHandler函数来构建消息处理器，并使用getId函数来获取回调ID。
  ipcMan<RedIpcArgs>({
    handler: buildHandler(ctx),
    getId: (p) => p?.[0]?.callbackId,
  })

  // 使用ctx.chronocat.api.register函数注册一系列的API处理器。
  // 每个API处理器都是通过调用一个构建函数来创建的，这些构建函数接收上下文对象ctx。
  // 这里注册了多种API，包括资产获取、频道列表/创建/静音等，用户和好友管理，消息创建/获取/删除等。
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

  // 等待ctx.chronocat对象变为就绪状态。
  await ctx.chronocat.whenReady()

  // 注册更多内部使用的API，比如获取和列出表情等。
  register('chronocat.internal.qface.get', qfaceGet)
  register('chronocat.internal.qface.list', qfaceList)
}
