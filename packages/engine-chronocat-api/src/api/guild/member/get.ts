import type {
  ChronocatContext,
  GuildMember,
  GuildMemberGetPayload,
} from '@chronocat/shell'

export const buildGuildMemberGet =
  (_ctx: ChronocatContext) =>
  async ({ user_id }: GuildMemberGetPayload): Promise<GuildMember> => {
    return {
      user: {
        id: user_id,

        avatar: `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${user_id}&spec=640`,
      },

      avatar: `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${user_id}&spec=640`,
    }
  }
