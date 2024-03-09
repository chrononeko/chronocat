import type { Methods } from '../types'
import { bgMagenta, cyan, magenta, white } from '../utils/colors'
import { l } from './logger'

const notimplSym = Symbol('chronocat.internal.notimpl')

export type ApiImpl<M extends keyof Methods> = ((
  ...args: Methods[M][0]
) => Promise<Methods[M][1]>) & {
  [notimplSym]: boolean

  engine: string
  priority: number
}

export type Api = {
  [M in keyof Methods]: ApiImpl<M>
} & {
  notimpl: typeof notimplSym

  register: (
    engine: string,
    priority?: number,
  ) => <M extends keyof Methods>(
    method: M,
    impl: (...args: Methods[M][0]) => Promise<Methods[M][1]>,
  ) => void
}

const buildNotimpl = (name: string) => {
  const fn = () =>
    l.error(
      new Error(
        `没有引擎提供 ${bgMagenta(white(name))}。可能没有加载所需的引擎？`,
      ),
      {
        code: 2159,
        throw: true,
      },
    )

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
  (engine: string, defaultPriority: number = 0) =>
  <M extends keyof Methods>(
    method: M,
    impl: (...args: Methods[M][0]) => Promise<Methods[M][1]>,
    priority: number = -1,
  ) => {
    const newPriority = priority === -1 ? defaultPriority : priority
    if (!api[method][notimplSym]) {
      l.warn(
        `${cyan(engine)}(${newPriority}) 与 ${cyan(api[method].engine)}(${
          api[method].priority
        }) 重复注册了方法 ${magenta(method)}，将采用 ${newPriority > api[method].priority ? engine : api[method].engine} 的版本。`,
      )

      if (newPriority < api[method].priority) return
    }
    // FIXME: Do not use type assertion
    api[method] = impl /* ApiImpl<M> */ as Api[M]
    api[method].engine = engine
    api[method].priority = newPriority
  }
