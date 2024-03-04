declare const authData: {
  account: string // 与 uin 相同
  mainAccount: ''
  uin: string
  // uid: string
  nickName: ''
  gender: 0
  age: 0
  faceUrl: ''
  a2: ''
  d2: ''
  d2key: ''
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
 * 与 selfProfile 的不同点在于，selfProfile 有 nick。
 *
 * @returns {@link authData}。
 */
export const getAuthData = () => task
