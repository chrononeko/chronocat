import type { groupNotify } from './services/groupNotify'
import type { MsgBoxActiv } from './services/msgBoxActiv'

declare module '@chronocat/shell' {
  interface ChronocatContext {
    chronocatEngineChronocatApi: {
      msgBoxActiv: MsgBoxActiv
      groupNotify: typeof groupNotify
    }
  }
}

export type NtApi<R, A extends unknown[]> = (...args: A) => Promise<R>
