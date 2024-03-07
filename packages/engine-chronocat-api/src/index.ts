import type { RedIpcArgs } from '@chronocat/red'
import type { ChronocatContext } from '@chronocat/shell'
import { ipcMan } from 'ipcman'
import { buildAssetsGet } from './api/internal/assets/get'
import { qfaceGet, qfaceList } from './api/internal/qface'
import { buildMessageCreate } from './api/message/create'
import { buildHandler } from './handler'

declare const __DEFINE_CHRONO_VERSION__: string

export const name = 'engine-chronocat-api'
export const version = __DEFINE_CHRONO_VERSION__

export const apply = async (ctx: ChronocatContext) => {
  ipcMan<RedIpcArgs>({
    handler: buildHandler(ctx),
    getId: (p) => p?.[0]?.callbackId,
  })

  const register = ctx.chronocat.api.register(name)
  register('chronocat.internal.assets.get', buildAssetsGet(ctx))
  register('message.create', buildMessageCreate(ctx))
  register('chronocat.internal.message.create.forward', buildMessageCreate(ctx))

  await ctx.chronocat.whenReady()

  register('chronocat.internal.qface.get', qfaceGet)
  register('chronocat.internal.qface.list', qfaceList)
}
