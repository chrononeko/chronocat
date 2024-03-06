import type {
  ChronocatContext,
  ChronocatSatoriServerConfig,
  MessageCreatePayload,
} from '@chronocat/shell'
import { common } from '../../common'
import { Messager } from './messager'

export const buildMessageCreate =
  (ctx: ChronocatContext) =>
  async (
    { channel_id, content }: MessageCreatePayload,
    config: ChronocatSatoriServerConfig,
  ) =>
    new Messager(ctx, config, common, channel_id).send(content)
