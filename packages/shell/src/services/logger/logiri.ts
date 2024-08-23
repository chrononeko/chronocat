import { link } from 'logiri'
import type { Event } from '../../satori/types'
import { ChannelType } from '../../satori/types'
import { blue, cyan, grey } from '../../utils/colors'
import { send } from './messager'

export const logiriMessageCreated = async (data: object) => {
  const d = data as Event
  if (d.type !== 'message-created') return
  const rawMessage = await send(d.message?.content)
  const message = rawMessage.join('').replace(/\r/g, '').replace(/\n/g, ' ')
  return [message].map(
    (x) =>
      `${
        d.channel?.type === ChannelType.DIRECT
          ? ''
          : blue(
              link(
                d.channel?.id === d.guild?.id
                  ? `${d.channel?.name}(${d.channel?.id})`
                  : `${d.guild?.name}(${d.guild?.id})/${d.channel?.name}(${d.channel?.id})`,
                d.guild?.avatar,
              ),
            )
      }${d.channel?.type === ChannelType.DIRECT ? '' : grey('-')}${cyan(
        link(
          `${d.user?.name || d.member?.nick}(${d.user?.id})`,
          d.user?.avatar,
        ),
      )}${grey(':')} ${x}`,
  )
}

export const logiriMessageDeleted = async (data: object) => {
  const d = data as Event
  if (d.type !== 'message-deleted') return
  const rawMessage = await send(d.message?.content)
  const message = rawMessage.join('').replace(/\r/g, '').replace(/\n/g, ' ')
  return [message].map(
    (x) =>
      `${
        d.channel?.type === ChannelType.DIRECT
          ? ''
          : blue(
              link(
                d.channel?.id === d.guild?.id
                  ? `${d.channel?.name}(${d.channel?.id})`
                  : `${d.guild?.name}(${d.guild?.id})/${d.channel?.name}(${d.channel?.id})`,
                d.guild?.avatar,
              ),
            )
      }${d.channel?.type === ChannelType.DIRECT ? '' : grey('-')}${cyan(
        link(
          `${d.user?.name || d.member?.nick}(${d.user?.id})`,
          d.user?.avatar,
        ),
      )}${grey(':')} ${x}`,
  )
}

export const logiriGuildRequest = async (data: object) => {
  const d = data as Event
  if (d.type !== 'guild-request') return
  return [
    `${grey('用户')} ${cyan(
      link(`${d.user?.name || d.member?.nick}(${d.user?.id})`, d.user?.avatar),
    )} ${grey('申请加入群')} ${blue(
      link(`${d.guild?.name}(${d.guild?.id})`, d.guild?.avatar),
    )}`,
  ]
}

export const logiriFriendRequest = async (data: object) => {
  const d = data as Event
  if (d.type !== 'friend-request') return
  return [
    `${grey('用户')} ${cyan(
      link(`${d.user?.name || d.member?.nick}(${d.user?.id})`, d.user?.avatar),
    )} ${grey('申请添加好友')}`,
  ]
}

export const logiriGuildMemberAdded = async (data: object) => {
  const d = data as Event
  if (d.type !== 'guild-member-added') return
  return [
    `${grey('用户')} ${cyan(
      link(`${d.user?.name || d.member?.nick}(${d.user?.id})`, d.user?.avatar),
    )} ${grey('由')} ${cyan(
      link(
        `${d.operator?.name || d.operator?.nick}(${d.operator?.id})`,
        d.operator?.avatar,
      ),
    )} ${grey('批准/邀请加入了群')} ${blue(
      link(`${d.guild?.name}(${d.guild?.id})`, d.guild?.avatar),
    )}`,
  ]
}

export const logiriUnsafeGuildMute = async (data: object) => {
  const d = data as Event
  if (d.type !== 'unsafe-guild-mute') return
  return [
    `${grey('用户')} ${cyan(
      link(`${d.user?.name || d.member?.nick}(${d.user?.id})`, d.user?.avatar),
    )} ${grey('由管理')} ${cyan(
      link(
        `${d.operator?.name || d.operator?.nick}(${d.operator?.id})`,
        d.operator?.avatar,
      ),
    )} ${grey('禁言')}`,
  ]
}

export const logiriUnsafeGuildUnmute = async (data: object) => {
  const d = data as Event
  if (d.type !== 'unsafe-guild-unmute') return
  return [
    `${grey('用户')} ${cyan(
      link(`${d.user?.name || d.member?.nick}(${d.user?.id})`, d.user?.avatar),
    )} ${grey('由管理')} ${cyan(
      link(
        `${d.operator?.name || d.operator?.nick}(${d.operator?.id})`,
        d.operator?.avatar,
      ),
    )} ${grey('解除禁言')}`,
  ]
}
