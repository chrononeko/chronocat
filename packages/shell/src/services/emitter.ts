import type { DispatchMessage } from '../types'

export type Emit = (message: DispatchMessage) => unknown

const handlers: Emit[] = []

export const emitter = {
  register: (e: Emit) => handlers.push(e),
  emit: (message: DispatchMessage) => handlers.forEach((e) => e(message)),
}
