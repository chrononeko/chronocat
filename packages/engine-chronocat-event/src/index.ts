import type { RedIpcArgs } from '@chronocat/red'
import type { ChronocatContext } from '@chronocat/shell'
import { ipcMan } from 'ipcman'
import { buildHandler } from './handler'
import { buildParser } from './parser'

declare const __DEFINE_CHRONO_VERSION__: string

export const name = 'engine-chronocat-event'
export const version = __DEFINE_CHRONO_VERSION__

export const apply = async (ctx: ChronocatContext) => {
  ipcMan<RedIpcArgs>({
    handler: buildHandler(ctx),
    getId: (p) => p?.[0]?.callbackId,
  })

  const register = ctx.chronocat.api.register(name)
  register('chronocat.internal.red.message.parse', (m, c) =>
    buildParser(ctx, c)(m),
  )

  await ctx.chronocat.whenReady()
}
