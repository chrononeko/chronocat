import type { Methods } from '../types'

export type ApiImpl<M extends keyof Methods> = ((
  ...args: Methods[M][0]
) => Promise<Methods[M][1]>) & {
  engine: string
}

export type Api = {
  [M in keyof Methods]: ApiImpl<M>
} & {
  register: (engine: string) => void
}

export const api = {} as Api

api.register =
  (engine: string) =>
  <M extends keyof Methods>(
    method: M,
    impl: (...args: Methods[M][0]) => Promise<Methods[M][1]>,
  ) => {
    api[method] = impl as ApiImpl<M>
    api[method].engine = engine
  }
