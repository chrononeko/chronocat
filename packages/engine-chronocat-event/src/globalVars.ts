import type { Group, Profile } from '@chronocat/red'

export const requestMethodMap: Record<string, string> = {}
export const emittedBuddyReqList: string[] = []

export const sendQueue: string[] = []

export const groupMap: Record<string, Group> = {}
export const friendMap: Record<string, Profile> = {}
