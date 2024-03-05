import type { Methods } from '../types'

export type ApiImpl<M extends keyof Methods> = ((
  ...args: Methods[M][0]
) => Promise<Methods[M][1]>) & {
  engine: string
}

export type Api = {
  [M in keyof Methods]: ApiImpl<M>
} & {
  register: (
    engine: string,
  ) => <M extends keyof Methods>(
    method: M,
    impl: (...args: Methods[M][0]) => Promise<Methods[M][1]>,
  ) => void
}

export const api = {} as Api

api.register =
  (engine: string) =>
  <M extends keyof Methods>(
    method: M,
    impl: (...args: Methods[M][0]) => Promise<Methods[M][1]>,
  ) => {
    // FIXME: Do not use type assertion
    api[method] = impl /* ApiImpl<M> */ as Api[M]
    api[method].engine = engine
  }
