import type {
  ChronocatContext,
  GuildMemberListPayload,
  GuildMemberListResponse,
} from '@chronocat/shell'

export const buildGuildMemberList =
  (_ctx: ChronocatContext) =>
  async (_: GuildMemberListPayload): Promise<GuildMemberListResponse> => {
    return {
      data: [],
    }
  }
