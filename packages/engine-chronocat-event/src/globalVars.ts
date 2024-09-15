import type { Group } from '@chronocat/red'

export const requestMethodMap: Record<string, string> = {}
export const emittedBuddyReqList: string[] = []
export const emittedGuildRequestList: string[] = []
export const emittedGuildMemberRequestList: string[] = []
export const emittedGuildMemberRemovedList: string[] = []

export const sendQueue: string[] = []

export const groupMap: Record<string, Group> = {}
