import { define } from '../invoke'

export const approvalFriendRequest = define<
  unknown,
  [
    {
      approvalInfo: {
        friendUid: string
        reqTime: string // '1700000000'
        accept: boolean
      }
    },
  ]
>('ns-ntApi-2', 'nodeIKernelBuddyService/approvalFriendRequest')

export const delBuddy = define<
  unknown,
  [
    {
      delInfo: {
        friendUid: string
        tempBlock: boolean
        tempBothDel: boolean
      }
    },
  ]
>('ns-ntApi-2', 'nodeIKernelBuddyService/delBuddy')
