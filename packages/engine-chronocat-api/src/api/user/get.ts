import type { ChronocatContext, User, UserGetPayload } from '@chronocat/shell'

export const buildUserGet =
  (_ctx: ChronocatContext) =>
  async ({ user_id }: UserGetPayload): Promise<User> => {
    return {
      id: user_id,
      avatar: `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${user_id}&spec=640`,
    }
  }
