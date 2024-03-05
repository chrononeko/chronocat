const uinRegex = /\d+/

const isUin = (uin: unknown) => typeof uin === 'string' && uinRegex.test(uin)

const isUid = (uid: unknown) =>
  typeof uid === 'string' && uid.length === 24 && uid.startsWith('u_')

const map: Record<string, string> = {}

const add = (uid: string, uin: string) => {
  if (!uid || !uin) return
  map[uid] = uin
  map[uin] = uid
}

const getUin = (uid: string) => {
  if (!isUid(uid)) return undefined
  const uin = map[uid]
  if (!isUin(uin)) return undefined
  return uin
}

const getUid = (uin: string) => {
  if (!isUin(uin)) return undefined
  const uid = map[uin]
  if (!isUid(uid)) return undefined
  return uid
}

export const uix = {
  map,
  add,
  isUin,
  isUid,
  getUin,
  getUid,
}
