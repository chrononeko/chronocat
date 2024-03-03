declare const authData: {
  uin: string
}

const task = new Promise<typeof authData>((res) => {
  const interval: NodeJS.Timeout = setInterval(() => {
    if ('authData' in globalThis && authData?.uin) {
      clearInterval(interval)
      res(authData)
    }
  }, 500)
})

/**
 * 获取 {@link authData}。
 *
 * 与直接取 {@link authData}
 * 的不同点在于，此方法保证 {@link authData} 存在。
 *
 * @returns {@link authData}。
 */
export const getAuthData = () => task
