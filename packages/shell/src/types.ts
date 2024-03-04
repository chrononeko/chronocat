import type { O } from 'ts-toolbelt'
import type { Event, Message, MessageCreatePayload } from './satori/types'
import type {
  ChronocatLogCurrentConfig,
  ChronocatSatoriEventsConfig,
} from './services/config/configEntity'

export interface DispatchMessage {
  toSatori: (
    selfId: string,
    config: O.Intersect<ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig>,
  ) => Promise<Event[]>
}

export interface Methods {
  'message.create': [[MessageCreatePayload], Message[]]
}
