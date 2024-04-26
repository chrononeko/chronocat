import type { Group, Profile, RedIpcData, RedMessage } from '@chronocat/red'
import { ChronoEventEmitter } from './emitter'

export const requestMethodMap: Record<string, string> = {}
export const requestCallbackMap: Record<
  string,
  (/* this: RedIpcEvent, */ detail: RedIpcData) => void
> = {}

export const groupMap: Record<string, Group> = {}
export const roleMap: Record<string, Record<string, number>> = {}
export const friendMap: Record<string, Profile> = {}
export const richMediaDownloadMap: Record<string, (path: string) => void> = {}
export const emojiDownloadMap: Record<string, (path: string) => void> = {}

export const sendQueue: ((msg: RedMessage) => void)[] = []
export const sendCallbackMap: Record<string, (msg: RedMessage) => void> = {}

export const chronoEventEmitter = new ChronoEventEmitter()
