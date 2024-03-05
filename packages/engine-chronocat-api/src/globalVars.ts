import type { Group, Profile, RedIpcData, RedIpcEvent } from '@chronocat/red'

export const requestMethodMap: Record<string, string> = {}
export const requestCallbackMap: Record<
  string,
  (this: RedIpcEvent, detail: RedIpcData) => void
> = {}

export const groupMap: Record<string, Group> = {}
export const roleMap: Record<string, Record<string, number>> = {}
export const friendMap: Record<string, Profile> = {}
export const richMediaDownloadMap: Record<string, (path: string) => void> = {}
