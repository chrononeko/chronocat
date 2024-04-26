import type { AssetRequest } from '@chronocat/red'
import { ChatType } from '@chronocat/red'
import type { ChronocatContext } from '@chronocat/shell'
import {
  downloadRichMedia,
  fetchMarketEmoticonAioImage,
} from '../../../definitions/msgService'
import { emojiDownloadMap, richMediaDownloadMap } from '../../../globalVars'

export const buildAssetsGet =
  (ctx: ChronocatContext) => async (raw: string) => {
    const data = JSON.parse(
      Buffer.from(raw, 'base64url').toString('utf-8'),
    ) as AssetRequest

    if ('type' in data) {
      switch (data.type) {
        case 'marketface': {
          const downloadId = data.tabId + '::' + data.faceId

          const downloadCompletePromise = new Promise<string>((res, rej) => {
            emojiDownloadMap[downloadId] = res
            void ctx.chronocat.sleep(5000).then(rej)
          })

          await fetchMarketEmoticonAioImage({
            marketEmoticonAioImageReq: {
              eId: data.faceId,
              epId: data.tabId,
              name: data.name,
              width: 200,
              height: 200,
              jobType: 0,
              encryptKey: data.key,
              filePath: data.filePath,
              downloadType: 3,
            },
          })

          return await downloadCompletePromise
        }
      }
    } else {
      const downloadId = data.msgId + '::' + data.elementId

      const downloadCompletePromise = new Promise<string>((res, rej) => {
        richMediaDownloadMap[downloadId] = res
        void ctx.chronocat.sleep(1000).then(rej)
      })

      if (data.chatType === ChatType.Private && !data.peerUid.startsWith('u_'))
        data.peerUid = ctx.chronocat.uix.getUid(data.peerUid)!

      await downloadRichMedia({
        getReq: {
          ...data,
          downloadType: 1,
        },
      })

      return await downloadCompletePromise
    }
  }
