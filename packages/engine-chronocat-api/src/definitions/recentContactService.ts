import type { ContactListType } from '@chronocat/red'
import { define } from '../invoke'

export const fetchAndSubscribeABatchOfRecentContact = define<
  {
    result: 0
    errMsg: ''
  },
  [
    {
      fetchParam: {
        anchorPointContact: {
          contactId: string // ''
          sortField: string // ''
          pos: number // 0
        }
        relativeMoveCount: number // 0
        listType: ContactListType
        count: number // 200
        fetchOld: boolean // true
      }
    },
  ]
>(
  'ns-ntApi-2',
  'nodeIKernelRecentContactService/fetchAndSubscribeABatchOfRecentContact',
)
