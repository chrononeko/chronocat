import type { IncomingMessage, ServerResponse } from 'node:http'
import type { ChronocatSatoriServerConfig } from '../../services/config/configEntity'
import type { ChronocatContext } from '../../types'

export interface RouteContext {
  cctx: ChronocatContext
  config: ChronocatSatoriServerConfig
  req: IncomingMessage
  res: ServerResponse<IncomingMessage>
  path: string
  buffer: () => Promise<Buffer>
  string: () => Promise<string>
  json: () => Promise<unknown>
}

export type Route = (rctx: RouteContext) => Promise<unknown>
