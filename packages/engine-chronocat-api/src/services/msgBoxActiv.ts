import type { Peer } from '@chronocat/red'
import { ContactListType } from '@chronocat/red'
import type { ChronocatContext } from '@chronocat/shell'
import type { F } from 'ts-toolbelt'
import { getMsgsIncludeSelfAndAddActiveChat } from '../definitions/msgService'
import { getBuddyList } from '../definitions/nodeStore'
import { fetchAndSubscribeABatchOfRecentContact } from '../definitions/recentContactService'

export interface MsgBoxActiv {
  activate: <T>(peer: F.Exact<T, Peer>, force?: boolean) => void
}

export const msgBoxActiv = (ctx: ChronocatContext): MsgBoxActiv => {
  const activated: string[] = []

  let activateIntl: (peer: Peer, force?: boolean) => void = () => {}

  const activate = (peer: Peer, force?: boolean) => activateIntl(peer, force)

  void ctx.chronocat
    .whenReady()
    .then(() => ctx.chronocat.sleep(4000))
    .then(() => ctx.chronocat.getConfig())
    .then((config) => {
      if (!config.receive_msgbox) return

      let task = Promise.resolve()

      activateIntl = (peer: Peer, force?: boolean) =>
        void (task = task.then(async () => {
          await ctx.chronocat.sleep(500)

          if (!peer || !peer.peerUid) return

          // 使用 isUid 即可判断群聊/私聊，无需携带 peer.chatType
          if (!force && activated.includes(peer.peerUid)) return
          activated.push(peer.peerUid)

          void getMsgsIncludeSelfAndAddActiveChat({
            peer,
            msgId: '0',
            cnt: 1,
            queryOrder: true,
          })
        }))

      void getBuddyList()

      void fetchAndSubscribeABatchOfRecentContact({
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
      })
    })

  return {
    activate,
  }
}
