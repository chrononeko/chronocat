import type { ChronocatContext } from '@chronocat/shell'
import { getMemberInfo } from '../../definitions/groupService'
import { getUserDetailInfoWithBizInfo } from '../../definitions/profileService'

export const buildGetUin = (ctx: ChronocatContext) => async (uid: string) => {
  await getUserDetailInfoWithBizInfo({
    uid,
    keys: [0],
  })

  return new Promise<string>((res, rej) => {
    ctx.chronocat.uix.once(uid, res)
    void ctx.chronocat.sleep(5000).then(rej)
  })
}

export const buildGetUinWithGroup =
  (ctx: ChronocatContext) => async (uid: string, group: string) => {
    await getMemberInfo({
      forceUpdate: true,
      groupCode: group,
      uids: [uid],
    })

    return new Promise<string>((res, rej) => {
      ctx.chronocat.uix.once(uid, res)
      void ctx.chronocat.sleep(5000).then(rej)
    })
  }
