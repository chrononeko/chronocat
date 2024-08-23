import { EventEmitter } from 'node:events'

const uinRegex = /\d+/

const isUin = (uin: unknown) =>
  (typeof uin === 'string' && uin !== '0' && uinRegex.test(uin)) ||
  (typeof uin === 'number' && uin > 9999)

const isUid = (uid: unknown) =>
  typeof uid === 'string' && uid.length === 24 && uid.startsWith('u_')

export class Uix extends EventEmitter {
  map: Record<string, string> = {}

  isUin = isUin
  isUid = isUid

  add = (uid: string, uin: string) => {
    if (!isUid(uid) || !isUin(uin)) return
    this.map[uid] = uin
    this.map[uin] = uid
    this.emit(uin, uid)
    this.emit(uid, uin)
  }

  getUin = (uid: string) => {
    if (!isUid(uid)) return undefined
    const uin = this.map[uid]
    if (!isUin(uin)) return undefined
    return uin
  }

  getUid = (uin: string) => {
    if (!isUin(uin)) return undefined
    const uid = this.map[uin]
    if (!isUid(uid)) return undefined
    return uid
  }
}

export const uix = new Uix()
