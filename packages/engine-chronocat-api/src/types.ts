import type { MsgBoxActiv } from './services/msgBoxActiv'

declare module '@chronocat/shell' {
  interface ChronocatContext {
    chronocatEngineChronocatApi: {
      msgBoxActiv: MsgBoxActiv
    }
  }
}

export type NtApi<R, A extends unknown[]> = (...args: A) => Promise<R>
