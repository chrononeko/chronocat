import type { ChronocatContext, Login } from '@chronocat/shell'
import { LoginStatus } from '@chronocat/shell'

export const buildLoginGet = (ctx: ChronocatContext) => async () => {
  const authData = await ctx.chronocat.getAuthData()

  const result: Login = {
    user: {
      id: authData.uin,
      avatar: `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${authData.uin}&spec=640`,
    },
    self_id: authData.uin,
    platform: ctx.chronocat.platform,
    status: LoginStatus.ONLINE,
  }

  return result
}
