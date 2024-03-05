import type {
  OnRichMediaDownloadComplete,
  RedIpcArgs,
  RedIpcDataEvent,
  RedIpcDataRequest,
} from '@chronocat/red'
import type { ChronocatContext } from '@chronocat/shell'
import type { IpcManData } from 'ipcman'
import { ipcMan } from 'ipcman'
import { buildAssetsGet } from './api/internal/assets/get'
import { requestMethodMap, richMediaDownloadMap } from './globalVars'

declare const __DEFINE_CHRONO_VERSION__: string

export const name = 'engine-chronocat-api'
export const version = __DEFINE_CHRONO_VERSION__

export const apply = async (ctx: ChronocatContext) => {
  const dispatcher = async (method: string, payload: unknown) => {
    switch (method) {
      case 'nodeIKernelMsgListener/onRichMediaDownloadComplete': {
        const { notifyInfo } = payload as OnRichMediaDownloadComplete

        const downloadId = `${notifyInfo.msgId}::${notifyInfo.msgElementId}`

        if (notifyInfo.fileDownType === 1 && richMediaDownloadMap[downloadId]) {
          richMediaDownloadMap[downloadId]!(notifyInfo.filePath)
          delete richMediaDownloadMap[downloadId]
        }
        return
      }
    }
  }

  const handler = (data: IpcManData) => {
    switch (data.type) {
      case 'event': {
        if (!data.args[1] || !Array.isArray(data.args[1])) return
        const d = data.args[1] as [RedIpcDataEvent]
        if (!d.length) return
        const e = d[0]
        if (!e || !('cmdName' in e)) return
        void dispatcher(e.cmdName, e.payload)
        return
      }

      case 'wrapped-request': {
        requestMethodMap[data.id] = (data.args[1] as RedIpcDataRequest)[0]
        return
      }

      case 'wrapped-response': {
        const method = requestMethodMap[data.id]
        if (!method) return
        delete requestMethodMap[data.id]
        void dispatcher(method, data.args[1] /* RedIpcDataResponse */)
        return
      }
    }
  }

  ipcMan<RedIpcArgs>({
    handler,
    getId: (p) => p[0].callbackId,
  })

  const register = ctx.chronocat.api.register(name)
  register('chronocat.internal.assets.get', buildAssetsGet(ctx))

  await ctx.chronocat.whenReady()
}
