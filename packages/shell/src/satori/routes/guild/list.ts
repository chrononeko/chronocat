import type { RouteContext } from '../types'

export const guildList = async ({ cctx }: RouteContext) =>
  cctx.chronocat.api['guild.list']()
