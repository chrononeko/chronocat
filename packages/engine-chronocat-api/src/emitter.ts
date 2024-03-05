/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { EventEmitter } from 'node:events'

type EmittedEvents = Record<string | symbol, (...args: unknown[]) => unknown>

export interface TypedEventEmitter<ES extends EmittedEvents> {
  on<E extends keyof ES>(event: E, listener: ES[E]): this
  once<E extends keyof ES>(event: E, listener: ES[E]): this
  emit<E extends keyof ES>(event: E, ...args: Parameters<ES[E]>): boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TypedEventEmitter<ES extends EmittedEvents> extends EventEmitter {}

export type ChronoEvents = {
  buddyListChange: () => void
  groupListUpdate: () => void
}

export class ChronoEventEmitter extends TypedEventEmitter<ChronoEvents> {
  emitBuddyListChange = () => this.emit('buddyListChange')
  emitGroupListUpdate = () => this.emit('groupListUpdate')
}
