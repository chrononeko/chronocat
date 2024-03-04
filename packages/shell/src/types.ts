import type { Message, MessageCreatePayload } from './satori/types'

export interface Methods {
  'message.create': [[MessageCreatePayload], Message[]]
}
