import { link } from 'logiri'
import type { Event } from '../../satori/types'
import { blue, cyan, grey } from '../../utils/colors'
import { send } from './messager'

export const logiriMessageCreated = async (data: object) => {
  const d = data as Event
  if (d.type !== 'message-created') return
  const rawMessage = await send(d.message?.content)
  const message = rawMessage.join('').replace(/\r/g, '').replace(/\n/g, ' ')
  return [message].map(
    (x) =>
      `${blue(
        link(
          d.channel?.id === d.guild?.id
            ? `${d.channel?.name}(${d.channel?.id})`
            : `${d.guild?.name}(${d.guild?.id})/${d.channel?.name}(${d.channel?.id})`,
          d.guild?.avatar,
        ),
      )}${grey('-')}${cyan(
        link(
          `${d.user?.name || d.member?.nick}(${d.user?.id})`,
          d.user?.avatar,
        ),
      )}${grey(':')} ${x}`,
  )
}
