import type { ChronocatContext, GuildListResponse } from '@chronocat/shell'
import { getGroupList } from '../../definitions/nodeStore'
import { chronoEventEmitter, groupMap } from '../../globalVars'

export const buildGuildList =
  (ctx: ChronocatContext) => async (): Promise<GuildListResponse> => {
    await new Promise<void>((res, rej) => {
      chronoEventEmitter.once('buddyListChange', res)
      setTimeout(rej, ctx.chronocat.timeout)
      void getGroupList()
    }).catch(() =>
      ctx.chronocat.l.warn('获取最新群列表失败，将使用上次的结果。', {
        code: 2147,
      }),
    )

    await ctx.chronocat.sleep(1000)

    return {
      data: Object.values(groupMap).map((x) => ({
        id: x.groupCode,
        name: x.groupName,
        avatar: `https://p.qlogo.cn/gh/${x.groupCode}/${x.groupCode}/640`,
      })),
    }
  }
