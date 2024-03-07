import type { RouteContext } from '../types'

export const loginGet = ({ cctx }: RouteContext) =>
  cctx.chronocat.api['login.get']()
