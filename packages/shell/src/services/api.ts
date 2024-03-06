import type { Methods } from '../types'
import { l } from './logger'

const notimplSym = Symbol('chronocat.internal.notimpl')

export type ApiImpl<M extends keyof Methods> = ((
  ...args: Methods[M][0]
) => Promise<Methods[M][1]>) & {
  [notimplSym]: boolean

  engine: string
}

export type Api = {
  [M in keyof Methods]: ApiImpl<M>
} & {
  notimpl: typeof notimplSym

  register: (
    engine: string,
  ) => <M extends keyof Methods>(
    method: M,
    impl: (...args: Methods[M][0]) => Promise<Methods[M][1]>,
  ) => void
}

const buildNotimpl = (name: string) => {
  const fn = () =>
    l.error(new Error(`没有引擎提供 ${name}。可能没有加载所需的引擎？`), {
      code: 2159,
      throw: true,
    })

  ;(
    fn as unknown as {
      [notimplSym]: boolean
    }
  )[notimplSym] = true

  return fn
}

const handler: ProxyHandler<Api> = {
  get: (target, name) =>
    typeof name === 'symbol' ||
    Object.prototype.hasOwnProperty.call(target, name)
      ? target[name as keyof Methods]
      : buildNotimpl(name),
}

export const api = new Proxy({} as Api, handler)

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
