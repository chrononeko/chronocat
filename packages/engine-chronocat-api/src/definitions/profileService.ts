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
