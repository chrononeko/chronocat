export interface ChronocatBaseConfig {
  /**
   * @title 日志
   *
   * @description Chronocat 的日志配置。
   *
   * @default { "self_url": "https://chronocat.vercel.app", "debug": false }
   */
  log?: ChronocatLogConfig

  /**
   * @title 服务
   *
   * @description Chronocat 需要启动的服务。
   *
   * @default []
   */
  servers?: (ChronocatSatoriServerConfig | ChronocatSatoriWebHookConfig)[]
}

export interface ChronocatConfig extends ChronocatBaseConfig {
  /**
   * @title 启用
   *
   * @description 是否启用这个功能。
   *
   * @default true
   */
  enable?: boolean

  /**
   * @title 账号配置
   *
   * @description 账号专属的配置。
   *
   * @default {}
   */
  overrides?: {
    [account: string]: ChronocatCurrentConfig
  }
}

export interface ChronocatCurrentConfig extends ChronocatBaseConfig {
  /**
   * @title 启用
   *
   * @description 是否启用这个功能。
   */
  enable?: boolean
}

export interface ChronocatServerConfig {
  /**
   * @title 启用
   *
   * @description 是否启用这个功能。
   *
   * @default true
   */
  enable?: boolean

  /**
   * @title 密码
   *
   * @description 服务的密码。客户端使用服务时需要提供！
   */
  token: string
}

export interface ChronocatHttpServerConfig {
  /**
   * @title 监听地址
   *
   * @description 服务器监听的地址。
   *
   * 如果你不知道这是什么，那么不填此项即可！
   *
   * @default "0.0.0.0"
   */
  listen?: string
}

export interface ChronocatSelfUrlConfig {
  /**
   * @title 客户端访问 Satori 服务时的地址
   *
   * @description 客户端将会使用这个地址访问 Satori。
   *
   * 大多数情况下可以不填写此配置，但如果你的 Satori
   * 服务与客户端框架位于不同的网络主机（如 Docker
   * 环境），那么你需要填写客户端访问 Satori 时的地址。
   *
   * 举两个例子：
   *
   * - 当 Satori 服务与客户端分别位于局域网下的两台主机时，self_url
   * 应当形如：
   *
   * http://192.168.1.2:5500
   *
   * - 当网络由 Docker Compose 或 Kubernetes 管理时，self_url
   * 应当形如：
   *
   * http://chronocat.local:5500
   *
   * 判断地址是否正确的方法：
   *
   * 从客户端所在的网络环境直接访问此地址，应当看到
   * Satori 返回的「恭喜」的 HTML 页面。
   *
   * @TJS-pattern ^https?:\/\/[A-Za-z0-9:.]+$
   * @default "https://chronocat.vercel.app"
   */
  self_url?: string
}

export interface ChronocatSatoriEventsConfig extends ChronocatSelfUrlConfig {}

export interface ChronocatSatoriServerConfig
  extends ChronocatServerConfig,
    ChronocatHttpServerConfig,
    ChronocatSatoriEventsConfig {
  type: 'satori'

  /**
   * @title 监听端口
   *
   * @description 服务器监听的端口。
   *
   * 默认为 5500。
   *
   * @TJS-type integer
   * @default 5500
   * @minimum 1
   * @maximum 65535
   */
  port?: number
}

export interface ChronocatSatoriWebHookConfig
  extends ChronocatSatoriEventsConfig {
  type: 'satori_webhook'

  /**
   * @title WebHook URL
   *
   * @description WebHook 推送事件的目标 URL。
   */
  url: string

  /**
   * @title 启用
   *
   * @description 是否启用这个功能。
   *
   * @default true
   */
  enable?: boolean

  /**
   * @title WebHook 推送鉴权密码
   *
   * @description
   *
   * WebHook 推送事件时，会设置 Authorization 头为
   * Bearer 加上此鉴权密码。
   *
   * 强烈建议为 WebHook 服务设置单独的鉴权密码。
   *
   * @default ""
   */
  token?: string
}

export interface ChronocatLogConfig extends ChronocatSelfUrlConfig {
  /**
   * @title 输出调试日志
   *
   * @description 输出调试日志。
   *
   * @default false
   */
  debug?: boolean
}

export interface ChronocatLogCurrentConfig extends ChronocatLogConfig {}
