import type { DispatchMessage } from '../types'

let profile: {
  nick: string
} = {
  nick: '',
}

export const setSelfProfile = async (message: DispatchMessage) => {
  if (message.type !== 'unsafe-selfprofile') return

  profile = await message.getSelfProfile()
}

export const getSelfProfile = () => profile
