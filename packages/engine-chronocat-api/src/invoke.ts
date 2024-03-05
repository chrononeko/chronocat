// https://github.com/import-js/eslint-plugin-import/issues/2802
// eslint-disable-next-line import/no-unresolved
import { ipcMain } from 'electron'
import { requestCallbackMap } from './globalVars'
import type { NtApi } from './types'

export const invoke = async (
  channel: string,
  eventName: unknown,
  ...args: unknown[]
) => {
  const uuid = generateUUID()
  const result = await Promise.race([
    new Promise((_, reject) => setTimeout(() => reject(), 10000)),
    new Promise((resolve) => {
      requestCallbackMap[uuid] = resolve
      ipcMain.emit(
        channel,
        {
          sender: {
            send: (..._args: unknown[]) => {
              // resolve(args)
            },
          },
        },
        {
          type: 'request',
          callbackId: uuid,
          eventName,
        },
        args,
      )
    }),
  ])

  delete requestCallbackMap[uuid]

  return result
}

export type Invoke = typeof invoke

export function define<R = undefined, A extends unknown[] = []>(
  eventName: string,
  method: string,
): NtApi<R, A> {
  return (...args: A) =>
    invoke('IPC_UP_2', eventName, method, ...args) as Promise<R>
}

const generateUUID = () => {
  let d = new Date().getTime()
  d += performance.now()

  const uuid = 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}
