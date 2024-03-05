import type { Media } from '@chronocat/red'
import { ChatType } from '@chronocat/red'
import type { ChronocatContext } from '@chronocat/shell'
import { downloadRichMedia } from '../../../definitions/msgService'
import { richMediaDownloadMap } from '../../../globalVars'

export const buildAssetsGet =
  (ctx: ChronocatContext) => async (raw: string) => {
    const data = JSON.parse(
      Buffer.from(raw, 'base64url').toString('utf-8'),
    ) as Media

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
