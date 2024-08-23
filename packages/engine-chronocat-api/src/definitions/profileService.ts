import { define } from '../invoke'

export const getUserSimpleInfo = define<
  unknown,
  [
    {
      force: boolean
      uids: string[]
    },
  ]
>('ns-ntApi-2', 'nodeIKernelProfileService/getUserSimpleInfo')

export const getUserDetailInfoWithBizInfo = define<
  unknown,
  [
    {
      uid: string
      keys: [0]
    },
  ]
>('ns-ntApi-2', 'nodeIKernelProfileService/getUserDetailInfoWithBizInfo')
