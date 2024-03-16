# CHANGELOG

## v0.2.5 (2024-03-17)

戳一戳引擎在 9.9.8/6.9.30/3.2.6 仍然适配，无需升级。Shell 和 Chronocat 系列引擎均需要同时升级至此版本。

### shell

- 新增 `receive_msgbox` 配置项（默认开启），用于控制是否接收群助手内群消息 (c1086a704f6c93727b9e9a9b223bffdf8f18daf1)

### engine-chronocat-api

- 修复了群助手内的群收不到聊天信息的问题 (07170f2b804310d2e5ccf9fe0c2d7be256654c3c)

### engine-chronocat-event

- 修复了收不到聊天信息的问题 (a55fb930ab4105f3002bc8f33a9c4bb934351ee8)

## v0.2.4 (2024-03-10)

LiteLoaderQQNT 用户请安装前三个插件。此版本新增的「戳一戳引擎」可根据自身需求选择安装。

### iife

- 修复了 iife 未加载引擎的问题 (4a098692c5cb1bba973784a7c4ae245786e35128)

### engine-chronocat-api

- 修复了 `guild.get` 返回结果内没有群名称的问题 感谢群友发现问题 (1311e1b5d131a6ecd0493fe62ba274ac7b0ce9bc)
- 修复了 `guild.list` 耗时较长且提示「获取群列表失败」，实际上正确获取了最新数据的问题 (2800c7c8e4685dd158ec1a0c6889caa4c779f2da)

### engine-poke

- 实现戳一戳引擎

## v0.2.3 (2024-03-10)

这个版本包含重大架构更改。请阅读 Team Chrononeko
的最新博客以了解详情。**LiteLoaderQQNT 用户请安装全部三个插件，TI 用户请直接安装 TI 文件**。

### shell

- 使用被动式引擎加载 (7ea06d1ef8c7a3bf8fb2794f46bec71279ac4004)
- 实现 IIFE (1cae1a0720a17519ee7e91de6dcd9dc582e6a5a2)
- 实现可信安装 (6f5fb99afe966662c9656f678fd90e1ab3ad7016)
- 优化启动体验 (f721816d9ee5bc253ebe906646ca8de95038da40)
- 实现 API 注册优先级 (49d12becefb43a058d52bd0df52b094ddfdff3c3)
- 修改挂载点 (41b0eba4ce246a0a04622a4047133fd55df0e26e)
- LiteLoaderQQNT 插件取消内置引擎 (d9c736f07d1e24ed672c4c420a864627c5af59f7)
- 引擎打包为 LiteLoaderQQNT 插件 (6614d8270fecd07f00eb99d5deb42aa1aef6debd)

## v0.2.2 (2024-03-08)

### shell

- 即使外部引擎存在，也始终加载内置引擎 (1205dc7d180f10e5c6863e17a14980527a36371d)
- 修复了 IPv6 无法调用 Satori API 的问题 感谢群友发现问题 (ae9b642ed5a0e88fa41a14f891d19e6acf7afa56)

### llqqnt

- 发布包同时支持 LiteLoaderQQNT v0 和 v1 (81ca85e1ff5fa22acdf04a1b8032206119a3c3c1)

### engine-chronocat-api

- 实现 `channel.list` (32e8060facb4d0acd0e9f2871b1c100006987d8b)
- 实现 `channel.get` (1d5ed2d05e909e273ae8080e140e7006f2ee8c7d)
- 实现 `unsafe.channel.mute` (6efc21489de1e2ab19ac8f63d31a93d351ec3a57)
- 实现 `unsafe.channel.member.mute` (10b7362656d16c09d26572fa038505a138b6b515)
- 实现 `user.channel.create` (8e38e33069801cf72bbb63ecc54c90de85d16487)
- 实现 `guild.get` (6e499f499f408cc0a86916efe0220232fc93f752)
- 实现 `guild.list` (991f654b490c9a36e51400d4c8acd2bf68e11a4f)
- 实现 `guild.approve` (b71a61a4307e7ea6a4eebf103f62a5b4fdafef05)
- 实现 `guild.remove` (c6374f574d869099420e88ac33eddfe7de71e440)
- 实现 `guild.member.get` (45d644947eb7370157f062679619341a58949ce3)
- 实现 `guild.member.list` (d0df894c10a7af1de09417c9f7e22d2c30b2270a)
- 实现 `message.get` (6f71181ee226bace81af61c4a6768cb4450756e6)
- 实现 `message.delete` (bf14ad477f4b18e68bc82d485ae2db0b4ae6798e)
- 实现 `message.list` (df371ce674f747d83704c77f8cdbe7af81eb73fe)
- 实现 `user.get` (163fcda9d2dca0796fd1a785e9a3e56a60bbee0b)
- 实现 `friend.list` (122ee09de938080c1d7a9ea93bec08d778f3eac8)
- 实现 `friend.approve` (81a6ed1449561c13ef41214a0c16b2f98ec6b558)
- 实现 `unsafe.friend.remove` (f4d59395654c4d04bb78b111675c0414fd57e060)

### engine-chronocat-event

- 修复 `guild-member-added` 事件中没有 Member 资源的问题 感谢群友发现问题 (09b7d625df03bf1f714b2420f42f1dd3446e45bf)

## v0.2.1 (2024-03-08)

### shell

- 内置 chronocat 两个引擎，在未找到外部引擎时自动加载内置引擎 (6c5404e5085f353a47be17ea3ba0f47c41b89da0)
- 统一日志与 HTTP 错误码 (2f41a2c89be30f8285caedccb098ffc2fc7726ce)
- 优化 API 调用报错时的日志 (3c7c3e1c1be31c8ff75624bb56e61160c6af7931)
- 修复了日志在终端直接输出时会产生空行的问题 (90941772fbcd2b5fb8793dc7527829d20bb8e578)

### engine-chronocat-api

- 修复了 at 元素的解析和发送问题 (1d30a45d1f2abd5330a45df49a0e1a14d7bce22f)
- 实现 `qface.get` 和 `qface.list` (32f24c5ce251b9592dbd1804185214bc2427360d)
- 实现 `login.get` (0b9e6970a19d7855323c80ff9593855fe289f4ab)

### engine-chronocat-event

- 修复了 at 元素的解析和发送问题 (1d30a45d1f2abd5330a45df49a0e1a14d7bce22f)

## v0.2.0 (2024-03-06)

这是一个主要（Major）版本，并包含破坏性更改。请阅读 Team Chrononeko 的最新博客以了解详情。Chronocat v0.1.x 将会继续维护。

### shell

- 重构 core 到 Chronocat Shell

### engine-chronocat-api

- 首个版本

### engine-chronocat-event

- 首个版本

## v0.1.1 (2024-02-25)

### core

- Satori：`pcpoke` 支持收发具体类型，包括「戳一戳」「比心」「点赞」「心碎」「666」「放大招」 (567494fbed23cefef4b7c973068716e956b95565)
- Satori：`pcpoke` 不要与其他元素一起发送 (3b8b1b24f61e6f2c06c30b8072c1b36871acc0d5)
- Satori：`pcpoke` 添加日志提示 (44ce55ad92216b836a849746e050666580c10506)

## v0.1.0 (2024-02-23)

### core

- 登录服务接入日志 (e2a0d398d1ab8d3e4b4723065ae8bac589a38300)
- 弃用实验性 `platform` 配置项 (1df2f55ca17c85017a501991f2485d20be9687b4)

## v0.0.75 (2024-02-13)

### core

- Satori：实现了 API `unsafe.channel.mute`、`unsafe.channel.member.mute` (3fd128630b691374524fc45e05fdd989db139c22)
- Satori：实现了 API `channel.list` (ebc9d1e4aa1cf5a0e3c41810f8535e01b410f54d)
- Satori：实现了 API `channel.get`、`guild.get`、`user.get`、`message.list`、`guild.member.kick` (dfe6b097f958439b071352eeadb483b08b2b8250)

## v0.0.74 (2024-02-06)

### core

- 日志回复消息可点击 (92cec78e5f2f0badd592698f831c226112ae8a2d)
- 日志打印戳一戳消息 (720eddca88dfdce791acceb11be27de77fa4fcf0)
- Satori：实现了 API `message.get`、`message.delete` (ab94944b79c6756589ae25931adbcf6d20aed079)
- Satori：实现 `face` 元素，支持任意 QQ 表情/Emoji/超级表情收发，支持接收掷骰结果/剪刀石头布结果/接龙次数 (013b28a4b7cd4a7bdaf593f05d20eb0f70870c56)
- Satori：实现 `pcpoke` 元素，支持收发「窗口抖动」表情 (399148074ef98ae3ec8ae7ce1c755652d88ce4a5)
- Red & Satori：实现了 `message-deleted` 事件 (87f06d5d9a190e6c5f1bba2de4391f5f45f3ea7c)

## v0.0.73 (2024-01-29)

### core

- 细化日志信息 (089ae1f75d4c7afb4dae2ac826eefab029f8f226)

### module-native

- 彻底修复无法发送合并转发和接收戳一戳的问题 (b43ed6f53c527e7685f6e1251eacf3aab4126b4b)

## v0.0.72 (2024-01-28)

### core

- 修复了模块加载失败时不会打印错误日志的问题 (2e9a2807d12904420f7a79d938f40c37d1f91cfe)
- 内存泄漏时日志提示并转储 (3b4f69100303a65c290699c94a0ada4f9726f2ac)

## v0.0.71 (2024-01-22)

### core

- 尝试修复无法发送合并转发和接收戳一戳的问题 (11623ef12c937ee9cb28814b85ea9eb55d1a240a)
- 优化文件体积 (fbd489e362ae02aa6a816b2d82fc9ac06ffcafa2)
- 远程登录支持 https (02ecb31e594dab5ed7db45de284b5864d9324503)

### llqqnt

- 修复了 LiteLoaderQQNT 无法加载 Chronocat 的问题 感谢群友发现问题 (12458892be7bf398d85c955392649f993bfce30f)

## v0.0.70 (2024-01-20)

### core

- 添加了初始化完成的日志 (9c91cc11b9bab48b4c8718003de6715340fb536c)

## v0.0.69 (2024-01-18)

### core

- 日志使用 `console.log()` 输出 (d9e293dd970bc017ec81365e588e9010aee99b2b)
- Satori：修正频道类型 (bd44e9f1f3c117a45787cfcd18572f9f64792609)
- 修复了群成员填写了群名片的情况下昵称显示为 `undefined` 的问题 (e3f3749e2399b9cbe5397fa382b29d40ff107a7f)

## v0.0.68 (2024-01-12)

### core

- Satori：修复了 API `friend.list` 返回空数组的问题 (27f64af2e7087c34b0908b8be65199476298e024)
- Satori：提升了 API `friend.list` 性能 (4edc27ba53f765e1b04f0990249bc1e38950c053)
- Satori：实现了 API `guild.list`，解决了初次获取群列表时列表为空的问题 (aefc7eefa5f57c833109454ab389e285de409b0b)
- Satori：修复了 API `friend.list` 和 `guild.list` 偶发 500 的问题 (3002783d1d318e6b1a00d4ccb698e2dc89d8c213)
- Satori：由于 QQ 自身未支持而无法实现的 API 返回错误码 501 (2f55bf52b27cd0b8187f527504c721d7ab203a59)

## v0.0.67 (2024-01-10)

### llqqnt

- 同时支持 LiteLoaderQQNT v0 和 v1 (93142fd1e6a9ffcfed1bf6b5b0619f022c2864e6)

## v0.0.66 (2024-01-08)

### core

- 修复了 Chronocat 数据目录与 QQ 数据目录不在同一卷上的时候无法发送媒体资源的问题 感谢群友发现问题 (cf69bacc2ef969ae4043e6db35e9ed7114157062)
- 更新至最新标准 Satori 协议 (87f0690668f72a36c6103889bde572a91c6e8bf2)
- Satori：实现了 API `unsafe.guild.remove` (12c50772ca7bbed6f164461bb104b6e1e6440627)
- Satori：实现了 API `friend.approve` (6cbc327727bfbf93c09e3155fcd66da33b599bf1)
- Satori：实现了 API `friend.list`，解决了初次获取好友列表时列表为空的问题 (8b4dc36a67f863de0affa7d20b03c4e7fd061840)
- Satori：实现了 API `guild.approve` (6c247016bf21d565b5da5b16d419e5431193f97f)
- Satori：实现了 API `unsafe.friend.remove` (0ca890ea6ae4ba929d158e7cd87b2e7a36d3d6c7)
- Red & Satori：实现了 `friend-request` 事件 (e9de796f50c2e41601ed6f1a24d8f5720a67c2c8)
- Satori：实现了 quote 元素的作者、内容支持和转发支持 (0447f17884309ee4c38d89934a3d5ac3405ab5b2)
- Satori：不再将自己视为 Bot (acb77e2cc56581148dd81ad4b8b86360b1ac8e13)

## v0.0.65 (2024-01-07)

### core

- Satori：修复了某些客户端下调用 API 始终报错 500 的问题 (43d6eb5aa80ca1fdfe621bfe442068d5b92d531e)
- Satori：为常见的错误消息元素添加报错 感谢群友发现问题 (5553f134670f32384f7ec12fee61621cf7cb2f86)

### module-native

- 移除不再可用的 Windows x86 支持 (fdb4678d5cb220fb6bf31a7eab7e9167b793491b)

## v0.0.64 (2024-01-03)

### core

- 日志支持输出异常原因 (2816f398489ecdb7e9ae607c5853b898f9bb9360)
- 日志直接输出时使用 stderr 输出 (f44c831b21a8e02208396ec81c618dce1aadc831)
- Satori：异常时输出日志 (1955bca2e3c52b0b31b47e6cebf19edcfb4ca5c2)

### module-native

- 临时文件置于 Chronocat 数据目录内 (08bdd49307d7da24a58a607be2bde457f0da5a16)

## v0.0.63 (2023-12-30)

### core

- Windows：修复了日志窗口乱码的问题 (cd44b22dfd5e4d0c80dcfb50416e2b36b9b261bd)
- Windows：修复了日志窗口在没有安装 Windows 终端的电脑上不启动的问题 (b39ea50957910760045ce68799b674004399f0cd)
- 修复了合并转发未生效的问题 感谢群友发现问题 (7c58e6323c9c00b8dd708f914cd30ee932f9a268)

## v0.0.62 (2023-12-29)

### core

- 实现 Chronocat 日志系统 (39ba57813a1dbd7d0b0afbb417390c186efeb391)
- Satori：修复了 Satori WebHook 服务不生效的问题 (8addf74aed5d223355798bb14a8cdd8baacf499a)

### qqntim

- 移除了 QQNTim 支持 (3b85b61a633f63ab82b36a2e7d3f9d7abc971d68)

## v0.0.61 (2023-12-27)

### core

- 统一媒体上传接口优化文件类型判断逻辑 (fb01cace3f14bd28bd5d820c71749eedefe00aaf)

### module-native

- 戳一戳消息适配 20139 版本 (1e430d8f30b8dd43a268e578fa0e313777e7382e)

## v0.0.60 (2023-12-26)

### core

- 修复了 9.9.6 版本无法发送媒体消息的问题 (ecc051cb4fb2fb814198dc40576554a22971d371)
- Satori：修复了无法发送 png 和 gif 格式图片的问题 (80dec235d7292a0b980b41af493d4b49700f0e3b)

## v0.0.59 (2023-12-20)

### core

- Red & Satori：支持接收戳一戳消息 (cbbf7b2dbe5c80c49110e0afb24813a8c3df68a8)

### module-native

- 支持接收戳一戳消息 (1e430d8f30b8dd43a268e578fa0e313777e7382e)

## v0.0.58 (2023-12-19)

### core

- Red：优化事件下发逻辑 (c111b6baeb818be89b2957156bb8a383e9e59ab3)
- Satori：不再下发警告 (db3ffc0bd12ab9131d4a65e280cbe9ebbe850480)

## v0.0.57 (2023-12-12)

### core

- 实现统一合并转发接口 (4ad59311542e3b67635e7c702f836cec8adc28d3)
- Satori：支持合并转发 (40264b0af43d5749f238e6ead197a32387d97bd0)

## v0.0.56 (2023-12-07)

### core

- 统一媒体上传接口根据文件类型存放文件 (dbd3127524a6d537bf2c697a0bb7ddf8da148bae)
- Red & Satori：自动清理发送消息时缓存的媒体文件 (0d1829b0bc92952705337da6b866fb65f68b6c2d)
- Satori：发送媒体支持指示 fileName/fileMime (21913c60193db0bc73f950ac4addddf24922456c)
- Red：`upload` API 使用统一媒体上传接口 (461b94ce93aec9c8d04a1ddab09f732289598f26)
- 添加「不在前端显示的消息」类型支持 (baddae3c67c8acd094dde976712d8e94a29aba37)
- 尝试修复无法获取 QQ 号问题 (5354182ff4b35bdaff21ce8a58092660ed0ab9ce)

## v0.0.55 (2023-11-02)

### core

- Satori：支持接收 `quote` 元素 (c16eee0ec5afbf21b7a873944555f64895fdff30)
- Satori：支持发送 `quote` 元素 (e36678d31991b5a5786dfd7323063c386b4d2350)
- Red：新增 API `bot/initGuild`，用于启用频道相关功能 (840054bbc89124ad06bf1889558ba088480ff1dd)
- 修复了 r 助手 `reply()` 的参数问题 (85c8061362627d145b2c5369fed4fdea772237fd)

## v0.0.54 (2023-10-17)

### core

- Satori：更换到标准元素 (7dfd01387f72070905bdad314f19f18a97953f9b)
- Satori：实现了 API `guild.member.list` (9e8a9dac7286983398ee8d1a93ce15bb7316c88a)
- Satori：支持了 WebHook (1960b4c76a1c6e9d8c404081cc2d0a143b11618e)
- 支持使用 `autologin` 开关自动登录 (da79fd4fbf79273a17916e799a0982ccc117c941)
- Red：优化了 API `group/getMemberList` 的实现 (4bb28608b16ffbcb0b56b9bc04249832d678e12c)
- TDD：添加 Satori 消息编码器的单元测试 (f10092fc54961791c545dfe48341adfeb40904ea)
- Red：修复了事件中用户身份不正确的问题 @boxie123 (9fa7b0a80a2071a19f4dd298d0682dd1976bd915)
- 修复了 Satori 无法获取网络图片和 WebHook 无法请求的问题 (3e63ddb1a6c8061d57e764b78f059e8d040a54c7)

## v0.0.53 (2023-10-17)

### core

- 添加了 Chronocat Satori OpenAPI 文档 (5708c069223f36cc07e24d34b4a4d33a1b6b9ae8)
- Red & Satori：修复了尝试下载不存在的媒体文件时连接无响应的问题 (78558d42b12aec38e1549da042667720178de427)
- Satori：修复了 `token` 配置项为空时仍然无法连接到事件服务的问题 (c123f0f87a7a0056c2596ad17f823f9749af2c6a)
- Satori：修复了 `token` 配置项为空时事件服务不推送任何事件的问题 (1a9ae46aecbcdf6ca7933b0d2a010586f8abad23)
- Satori：支持使用 `platform` 配置项自定义 Satori 事件服务对外显示的平台 (1900ef5ddf875a39b47dc0e358efc6e0cd5ff875)
- Satori：修复了访问媒体资源报错 `401 unauthorized` 的问题 (3f9206ae550141d5609e4ff152663562b569e2cb)
- Satori：修复了私聊情况下接收消息频道 ID 不一致的问题 (c55debe5219d94556f0a11bbed9dcf1f7226b7f4)
- Satori：实现了 API `user.channel.create` (b63a757c337854f0a05e1a158979bfacdc94b9de)
- Satori：支持发送 `image`/`audio`/`file` 元素 (53ca2e667bb2de607d74bee2711adbb8eab9764b)
- 更新文档 Satori SDK 部分 @Nyayurn (9238c131d5d7df63111d9a6a5130d31b48870fda)
- Chronocat 管理服务在登录成功后给出提示 @falconshark (48054114d76e035399c66567a1b605cea1c58613)
- TDD：添加 Satori 解析器的单元测试 (4b0ea13b50e95a35d8f92e00b94cffcf203d04ad)

## v0.0.52 (2023-10-11)

### core

- Satori：修复了 API `assets` 报错 500 的问题 (#33)
- Satori：支持发送 `message` 元素 (730635590f4bec561b795114286c6165687e8245)
- Satori：修复了发送消息时 `message` 元素无 children 导致发送失败的问题 (8a440b23e63fb37cd64dd1c6a7a7aabbd5540b8d)
- 资源获取 API 避免误获取到缩略图而非原图 (e24030895e3491d989b389962b5168f3b65a8403)

此更改直接对所有资源获取事件进行了仅原图的筛选。已在多个 QQ
版本上测试通过。遇到问题请创建新的 Issue。

## v0.0.51 (2023-10-10)

### core

- 增加了 Chronocat 的 Logo @Lipraty (bbe271eebdc578ca91411a24f259a1adb9fea61a)
- Satori：修复了事件端点错误的问题 (a485533866313e1f6c3a14519c67de67d8c3adb0)
- Satori：支持 `READY` 信令的响应数据 (12df4f8fa5edecf80875a75ad4cb7a82c82dda0d)
- Satori：标准元素实现最新版规范 (7a328e3ce692ce4905007f921a95e3e264ad52f1)
- Satori：API `message.create` 返回 content 字段 (f09df36a1485af3a8f3dd73502a855b813d270bc)
- 移除了无头模式（模式 1 和模式 2） (e4e1945709beba656863331626e4cff64470a62a)
- 修复了无头模式导致 QQ 无法正常退出的问题 (1da52f2c46b9b738423e0f375b191c0e54048e00)

## v0.0.50 (2023-10-07)

### core

- 实装了远程登录 (1d22d6d21cd3fac52e76e8bc06382f47bbbebae9)
- 修复了远程登录无响应的问题 (7bae5f2366f461232ec2eecfc3f18b4ee83e9670)
- 实现远程登录失败时返回错误信息 (94a2b42dccc0b3699eb0c23c957a0d8bbad90e79)
- 修复远程登录在 Linux QQ v3.1.2-13107 上的问题 (eb5006fa252bbd20f7ba1265601e1f04bf6e3371)
- 实装了无头模式（模式 3） (8ddea1a1938b59072fbbf3c4e2e49cc64b14d5cf)
- 实装了无头模式（模式 4） (917f1e02fb130b39e41771c2cf6e1dccea7dfae7)
- 仅在调试环境挂载全局变量 (25ce1cfd980aedaa76aeffb5f930393eea276d56)
- 支持使用 `--chrono-mode` 和 `CHRONO_MODE` 设定运行环境 (b0159c0ed3bb17e1f5388cfb985193d9fb5aaaee)
- 支持 chrono-mode 传入 `debug` (8fc0e7c15a852b089e43ff9949dc2ad50a63072c)
- 支持使用 `--chrono-default-token` 和 `CHRONO_DEFAULT_TOKEN` 设定初始 token (a45c6a366a744c7ea7543f0cd8002e14a32b0775)
- Satori：支持了 API `message.create` (6f80d19ea9529148c2fd953c76e14a1ac0470b87)
- Satori：实装了消息编码器 (6601032c4f793cc201600af474052b1a4376386e)
- Satori：修复了 API 调用未等待调用结束的问题 (2eaf3eae6df0a9208564ea97983854f723f63a22)
- Satori：修复了消息编码器的返回数据格式 (a6d66b158d949bb9469d0a6a83496e22ae2131d0)
- Red：新增 API `bot/exit`，用于关闭机器人 (03c066d601d87d20aa30b6ea0a0f21d10bcc4acd)

### llqqnt

- 直接加载核心而不等待 ready 事件 (98a3a76c93e4620ceb19f2a73c04482dcd270795)

### docker

- 首个版本

## v0.0.49 (2023-10-04)

### core

- 更新登录逻辑 (c8c788e3a6a32ba67937b7913e4669c65dc123b7)
- Satori：实现 Satori Assets (69eb7a8e7d6fa1766d9e3e14d6fff43a6462457f)
- Satori：修复了入群事件名称错误的问题 (f32c834e0b5310f82d3a1c1b4d9b5dc30c39cf10)
- Red：修复了 17153 及以上版本发送消息闪退的问题 (b2e0910375645e922c5894b3ea22807a78e7f247)
- Red：修复了 17153 及以上版本发送消息有概率失败的问题 (8c887cf99cd09dfd18708c853dd13a05fed30c20)
- Red：修复了 17153 及以上版本上传文件报错 500 的问题 (8b51c3d74a9ecc5ea1d9d8f4260107b9aed3ede6)

### cli

- 首个版本

## v0.0.48 (2023-10-02)

### core

- 更新登录逻辑 (8317e0eeb30977e45553c5fe3d2f74956371e842)
- Satori：修复了 Channel 和 Member 对象错误携带 `avatar` 字段的问题 (b1f862e642291be2518f780284401cea291898e1)
- Satori：无法获取用户名时不提供 `user.name` (55c3b2313d0f5ff252192a29bcd646506e68d420)
- Satori：不使用 `POST` 调用 API 时返回 `405 Method Not Allowed` (8136cfc5fcb5426142a55541ba6272fb38eb7eb7)
- Red：修复了 API `message/fetchRichMedia` 返回缩略图而非原图的问题 (5e5b3941a7036dd76822d3fbf1dacf9864f691de)

## v0.0.47 (2023-09-29)

### core

- 修复了配置文件中覆写配置部分的未填写字段仍然会以默认值覆写全局配置的已有字段的问题 (d55929bdd319ff1dda8681324511b92c8232629f)
- Satori：新增 `self_url` 配置项 (d8bec3d4778eedc947c73ad0e5e6d7bf10fbf254)
- Satori：支持事件 (fc5bb0050185507213aff295e23311fe3a0ea301)
- Satori：事件携带唯一 ID (1891c7d0d5e35fbf7fe7153efc89540585ad959c)
- Satori：优化 Index 页面 (c3dfa994f89a07b3ea4e9a7756ba25fcff6d3102)
- Satori：修复了 image 元素携带无用的 `no-isemoji` 属性问题 (ecd040686d1ade5f6f022427893e9dec25a3a5be)
- 支持了可信安装 (94097552a86c2b236e81205f473b46c7b7495e03)
- Red：API `message/getHistory` 响应添加 QQ 号 (4d50496679f43e6f23dd83c38dc0a8edd66a6e14)

## v0.0.46 (2023-09-25)

### core

- 添加了 Chronocat 配置文件的类型定义 (3b85d7737ad18637047e68038d4e7055ffecb1b7)
- 添加了 Chronocat 配置文件类型定义到 JSON Schema 的生成 (28527870ada1b5e0928c44fd251184a04a8d44a3)
- 支持了 Chronocat 配置文件的解析、校验、自动生成和迁移 (2cb1aa009a55334092ec3eff29314d9d4549075a)
- 移除了插件卸载逻辑 (7ea7b3fa75eb20ab7fa789d4b571349f1992f8a0)
- 支持根据配置文件启动任意个数的服务 (4069e711e36322a26df7bb051a5d30371c163c0c)
- 禁止服务使用默认 token 启动 (a4a6cb76c88b91fda0c7c2385dfafea044c0bde0)
- 支持了 Satori 协议 (b974114b93c4cc6277556f7a350a12a763fb3fd5)
- Satori：支持了 API `login.get` (4abd5ed61b085c957a69fc484fb8b43ad973538d)

## v0.0.45 (2023-09-20)

### core

- 修复了 API 请求中以数字形式传入 QQ 号会导致报错 500 的问题 (53d77e1f472aabde0c95b1b0e7f150adf342435a)
- 修复了非 NT 手机 QQ（8.9.63 以下版本）无法显示引用消息的问题 (9de067ee26e9e064935491367a394d23a7860ced)

### red

- 更新了 `r.reply()` 的参数 (c74aa56d03f5f0946c20b4d1d355f02623cf2740)

## v0.0.44 (2023-09-19)

### core

**这个版本修复了一个严重的安全问题，我们建议所有用户立即升级到这一版本。**

- 修复了 HTTP 不进行认证仍能调用 API 的问题 (d2f610d7ed0594f0108095cce93a6a0c8dd99ce4)

### red

- r 助手支持 `reply()` (c370aebbbb677bbe516717d1b43ed5dc504cbcf7)
- r 助手添加了类型校验 (55417fca62963de03f25f0b498bac1c764c8f5fb)
- 修复了 `r.remoteFile()` 的类型问题 (b0c8e82bae3589038aff7512646c72e4ab2c23a4)
- 修复了 r 助手中的类型问题 (55417fca62963de03f25f0b498bac1c764c8f5fb)

## v0.0.43 (2023-09-19)

### core

- 修复了 `message::recv` 的 payload 可能为空的问题 (6c421411dfb02ae59fc3136d457dc39e9f7c8693)
- 修复了 API 响应的相关问题 (#14)

### red

- r 助手支持 `remoteFile()` (d1d9f2239dc3db2d64462f79ca035e972c7f117b)
- 完善 `Message` 类型 (846f2d60c9c252e59f8173c9001f12708f7e9377)

## v0.0.42 (2023-09-17)

### core

- 修复了 API `upload` 可能会无限等待响应的问题 (38ea51dd0a48ac3a42b6d1e7f4fde891b7611cb7)
- 修复了 API `upload` 上传未知格式文件会失败的问题 (bfd0ba13013a5fd91025a4d1e4cc8c08b449163c)
- 修复了 WebSocket 鉴权失败和断连时的问题 @XiYang6666 (#10)

现在，WebSocket 鉴权失败后会遵循 WebSocket 标准，以状态码 `3000`
关闭连接。详见 Issue 内讨论。

### red

- r 助手支持 `remoteAudio()` (5e401924a773a3767606a6b138f7702aae1484d8)
- `r.remoteAudio()` 添加 `duration` 为必须参数 (30c62e599d7a9848947485a41c794d5fccbf6494)
- 合并转发载荷类型由 `MessageSendForwardPayload` 修改为 `UnsafeMessageSendForwardPayload` (363db56fa707045f0c99a92456680b34e68bd231)

该修改只影响 TypeScript 类型定义，不影响逻辑代码。

## v0.0.41 (2023-09-15)

### core

- 支持普通合并转发
- 普通合并转发、伪造合并转发支持所有 Windows QQ 版本
- 支持伪造合并转发消息发送者使用 QQ 号指定 (53062537c27b59df7ec6e5564b165fb402edd3b5)

### koishi-plugin-adapter

- 支持发送文件 (24db317b9f9a39645bd5312771602d0722818df0)
- 适配了 Koishi v4.14.6 和 Satori v3 (4b8fb8cb0b6246fdd4d11dba56a351c94fcdc15d)

## v0.0.40 (2023-09-10)

### core

- 修复了 native 模块导致 QQ 无法启动的问题 (#7)

版本 0.0.40 紧急修复了 Chronocat 导致 QQ
无法启动的问题。特别地，如果你已经安装了版本 0.0.39
并已经无法启动 QQ，可以按照如下步骤进行修复：

1. 打开 `文档/LiteLoaderQQNT/plugins` 文件夹，删除下面带有 `LiteLoader-Plugin-Chronocat` 字样的文件夹
1. 使用任务管理器结束所有 QQ 进程
1. 重新打开 QQ，QQ 应当能够正常启动。接下来可以前往 LiteLoaderQQNT 插件市场下载 0.0.40 版本。

### module-native

- 修复了 native 模块导致 QQ 无法启动的问题 (#7)
- 普通合并转发、伪造合并转发支持所有 Windows QQ 版本 (e98d26cd2956d65618fdf2645b0442813b0ad307)

### koishi-plugin-adapter

- 支持发送语音消息 (0f872ca68b8e0f5f9dfd16682143d2df4ca81176)

## v0.0.39 (2023-09-09)

### core

- 发送消息后返回发送结果 @Hieuzest (#4)
- 支持伪造合并转发 (#5)
- 修复了文件上传和资源获取有概率失败的问题 @Hieuzest (#6)

### module-native

- 支持伪造合并转发 (#5)

### miraigo

- 支持伪造合并转发 (#5)

### koishi-plugin-adapter

- 适配了 Koishi v4.14.5 和 Satori v3 (e124693ef6c27cfbbab0a4e0d135b29b0adb19ff)

## v0.0.38 (2023-08-30)

### core

- 接收到的聊天消息中现在会包含群成员身份组信息 @Hieuzest (#3)
- 修复了 HTTP API 无法使用的问题
- 修复了文件上传的问题

### koishi-plugin-assets-memory

- 修复了资源获取失败的问题 (a45ac5934b6053c783c8122e3466b43ce0c24eb8)

## v0.0.37 (2023-08-26)

### core

- 修复了一个问题，该问题会导致首次使用 Chronocat 时不会自动创建 token 文件 (ad8b570bd7d41ecc9ac600421c34b5bb8049e3f5)

## v0.0.36 (2023-08-26)

### core

- 完全重构了 Chronocat Core

### red

- 添加 Payload 相关类型

### llqqnt

- 首个版本

### qqntim

- 首个版本

### iife

- 首个版本

### koishi-plugin-adapter

- 拆分了资源存储逻辑

### koishi-plugin-assets-memory

- 首个版本

## v0.0.35 (2023-08-11)

### koishi-plugin-adapter

- 修复了一些小的问题并提升了稳定性

## v0.0.34 (2023-08-04)

### core

- 更新了 Chronocat 核心

## v0.0.33 (2023-08-04)

### core

- 更新了 Chronocat 核心

## v0.0.32 (2023-07-31)

### core

- 更新了 Chronocat 核心

## v0.0.31 (2023-07-30)

### core

- 更新了 Chronocat 核心

## v0.0.30 (2023-07-27)

### koishi-plugin-adapter

- 撤回了将 chronocatAssets 服务提升至 host 插件的更改，因为这会导致问题

## v0.0.29 (2023-07-27)

### koishi-plugin-adapter

- 支持了 session 上的 avatar 字段
- 修复了一个问题，该问题会导致群聊无法发送消息

## v0.0.28 (2023-07-26)

### core

- 更新了 Chronocat 核心

### koishi-plugin-adapter

- 更新了插件配置
- 将 chronocatAssets 服务提升至 host 插件
- 修复了处理消息过慢的问题

## v0.0.27 (2023-07-25)

### core

- 更新了 Chronocat 核心

### koishi-plugin-adapter

- 实现接收文件
- 实现接收语音消息
- 实现接收视频消息
- 实现「群组内群员被禁言」事件
- 支持 `session.isDirect`
- 修复了处理消息过慢的问题

## v0.0.26 (2023-07-24)

### koishi-plugin-adapter

- 俢復孒①些尒哋問趧並諟圱孒穏萣悻

## v0.0.25 (2023-07-23)

### koishi-plugin-adapter

- 开发流程启用 TDD 模式：现在，开发 Chronocat 时无需启动 Chronocat、Koishi 或 QQ
- 支持「旧版群成员邀请新人入群」事件
- 修复了「新人自行入群」事件不触发的问题

### koishi-plugin-launcher

- 启动器适配 QQ v9.9.1.15293

## v0.0.24 (2023-07-21)

### koishi-plugin-adapter

- 修复了一个表情混排消息导致消息解析出错的问题
- 修复图片接收问题

### koishi-plugin-launcher

- 移除了第一代启动器
- 更新了 Chronocat 核心
- 修复了 QQ 无限转圈的问题

## v0.0.23 (2023-07-20)

### koishi-plugin-adapter

- 使用 host 插件作为入口点
- 俢復孒①些尒哋問趧並諟圱孒穏萣悻

### koishi-plugin-launcher

- 默认使用 Chronocat 第二代启动器
- 启动器适配 QQ v9.9.1.15240
- 启动器支持 Windows ARM / Linux ARM

## v0.0.22 (2023-07-19)

### koishi-plugin-adapter

- 现在，在 session 存在字段缺失时会给出警告。在反馈问题时，请携带相关错误码进行反馈。
- 实现 getMessageList
- 实现 getGuild、getGuildList
- 检测群名称变更事件
- 修复图片接收错误

## v0.0.21 (2023-07-19)

### koishi-plugin-launcher

- 支持 Chronocat 第二代启动器

## v0.0.20 (2023-07-17)

### koishi-plugin-adapter

- 俢復孒①些尒哋問趧並諟圱孒穏萣悻

## v0.0.19 (2023-07-14)

### koishi-plugin-adapter

- 修复了一些小的问题并提升了稳定性

## v0.0.18 (2023-07-14)

### core

- 更新了 Chronocat 核心

## v0.0.17 (2023-07-13)

### koishi-plugin-adapter

- 现在，每个已弃用或未实现的 API 都配备了专属的错误码。在反馈问题时，请携带相关错误码进行反馈。
- 不再解析 ark 消息
- 修复了接收到的图片 URL 中出现 undefined 的问题
- 修复了使用 bot.sendMessage() 无法主动发送群聊消息的问题
- 修复了一些小的问题并提升了稳定性

## v0.0.16 (2023-07-11)

### koishi-plugin-adapter

- 修复了 adapter 无法加载的问题

## v0.0.15 (2023-07-11)

### koishi-plugin-adapter

- 添加了更多 API

## v0.0.14 (2023-07-11)

### core

- 更新 Chronocat 核心到 v1.0.1

## v0.0.13 (2023-07-11)

### koishi-plugin-adapter

- 优化了消息解析逻辑

## v0.0.12 (2023-07-09)

### koishi-plugin-adapter

- 优化了消息解析逻辑
- 修复了入群提醒判断不正确的问题

## v0.0.11 (2023-07-09)

### koishi-plugin-adapter

- 优化了消息解析逻辑
- 修复了 `jpeg` 图片无法正常发送的问题

## v0.0.10 (2023-07-09)

### koishi-plugin-adapter

- 重构了消息解析逻辑

## v0.0.9 (2023-07-09)

### koishi-plugin-adapter

- 支持新成员入群事件
- 修复图片发送逻辑

### koishi-plugin-launcher

- 修复 launcher 插件导致 QQ 无限转圈的问题

## v0.0.8 (2023-07-08)

### koishi-plugin-adapter

- 接收到的 at 元素添加 name 属性

### koishi-plugin-launcher

- 修复了 launcher 无法检测 QQ 是否正在运行的问题

## v0.0.7 (2023-07-07)

### koishi-plugin-adapter

- 适配最新版 Koishi Desktop
- 实现发送 at 消息
- 推荐使用 `OneBotCL` API
- 修复了 v0.0.5 版本无法使用的问题

### koishi-plugin-launcher

- 优化了启动逻辑

## v0.0.6 (2023-07-06)

### koishi-plugin-adapter

- 修复了 v0.0.5 版本无法使用的问题

## v0.0.5 (2023-07-04)

### koishi-plugin-adapter

- 实现接收 at 消息
- 实现发送 base64 图片

## v0.0.4 (2023-07-03)

### koishi-plugin-launcher

- 实装 launcher

## v0.0.3 (2023-07-02)

### koishi-plugin-adapter

- 修复了一些小的问题并提升了稳定性

## v0.0.2 (2023-07-02)

### koishi-plugin-adapter

- 修复了一些小的问题并提升了稳定性

## v0.0.1 (2023-07-01)

### koishi-plugin-adapter

- 首个版本
