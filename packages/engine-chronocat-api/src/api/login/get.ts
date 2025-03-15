import type { ChronocatContext, Login } from '@chronocat/shell'

// TODO: Should it share the same counter with Event?
let loginSn = 0

export const buildLoginGet = (ctx: ChronocatContext) => async () => {
  const authData = await ctx.chronocat.getAuthData()

  const result: Login = {
    sn: ++loginSn,
    platform: ctx.chronocat.platform,
    user: {
      id: authData.uin,
      avatar: `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${authData.uin}&spec=640`,
    },
    status: 1, // LoginStatus.ONLINE,
    adapter: ctx.chronocat.adapter,
    features: [
      'channel.get',
      'channel.list',
      'channel.create',
      'channel.update',
      'channel.delete',
      'unsafe.channel.mute',
      'unsafe.channel.member.mute',
      'user.channel.create',
      'guild.get',
      'guild.list',
      'guild.approve',
      'unsafe.guild.remove',
      'guild.member.get',
      'guild.member.list',
      'guild.member.kick',
      'guild.member.approve',
      'guild.member.mute',
      'guild.member.role.set',
      'guild.member.role.unset',
      'chronocat.guild.member.title.set',
      'guild.role.list',
      'guild.role.create',
      'guild.role.update',
      'guild.role.delete',
      'login.get',
      'message.create',
      'message.get',
      'message.delete',
      'message.update',
      'message.list',
      'reaction.create',
      'reaction.delete',
      'reaction.clear',
      'reaction.list',
      'user.get',
      'friend.list',
      'friend.approve',
      'unsafe.friend.remove',
      'chronocat.putongdejiekou1',
      'guild.plain',
    ],
  }

  return result
}
