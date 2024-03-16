import { ChatType, ContactListType } from '@chronocat/red'
import type { ChronocatContext } from '@chronocat/shell'
import { getAioFirstViewLatestMsgsAndAddActiveChat } from '../definitions/msgService'
import { fetchAndSubscribeABatchOfRecentContact } from '../definitions/recentContactService'

export interface MsgBoxActiv {
  activate: (peerUid: string) => void
}

export const msgBoxActiv = (ctx: ChronocatContext): MsgBoxActiv => {
  const activated: string[] = []

  let activateIntl: (peerUid: string) => void = () => {}

  const activate = (peerUid: string) => activateIntl(peerUid)

  void ctx.chronocat
    .whenReady()
    .then(() => ctx.chronocat.sleep(4000))
    .then(() => ctx.chronocat.getConfig())
    .then((config) => {
      if (!config.receive_msgbox) return

      let task = fetchAndSubscribeABatchOfRecentContact({
        fetchParam: {
          anchorPointContact: {
            contactId: '',
            sortField: '',
            pos: 0,
          },
          relativeMoveCount: 0,
          listType: ContactListType.MsgBox,
          count: 200,
          fetchOld: true,
        },
      }) as unknown as Promise<void>

      activateIntl = (peerUid: string) =>
        void (task = task.then(async () => {
          await ctx.chronocat.sleep(500)

          if (!peerUid) return

          if (activated.includes(peerUid)) return

          activated.push(peerUid)

          void getAioFirstViewLatestMsgsAndAddActiveChat({
            peer: {
              chatType: ChatType.Group,
              peerUid,
              guildId: '',
            },
            cnt: 20,
          })
        }))
    })

  return {
    activate,
  }
}
