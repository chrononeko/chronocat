export type RedIpcArgs = [RedIpcEvent, RedIpcData]

export interface RedIpcEvent {
  type: 'request' | 'response'
  eventName: string
  callbackId?: string | number
  promiseStatue?: 'full'
}

export type RedIpcData =
  | RedIpcDataRequest
  | RedIpcDataEvent
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  | RedIpcDataResponse

export type RedIpcDataRequest = [method: string, ...args: unknown[]]

export interface RedIpcDataEvent {
  cmdName: string
  cmdType: 'event'
  payload: unknown
}

export type RedIpcDataResponse = unknown
