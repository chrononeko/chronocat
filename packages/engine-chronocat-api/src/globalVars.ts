// 从'@chronocat/red'包中导入Group, Profile, RedIpcData, RedMessage类型定义。
// 这些类型用于定义群组信息、个人资料、IPC数据结构和消息格式。
import type { Group, Profile, RedIpcData, RedMessage } from '@chronocat/red'

// 从'./emitter'模块中导入ChronoEventEmitter类，这是一个自定义的事件发射器，用于应用内部事件的管理和通知。
import { ChronoEventEmitter } from './emitter'

// requestMethodMap用于映射请求ID到请求方法名。
export const requestMethodMap: Record<string, string> = {}

// requestCallbackMap用于映射请求ID到处理该请求的回调函数。
export const requestCallbackMap: Record<
  string,
  (/* this: RedIpcEvent, */ detail: RedIpcData) => void
> = {}

// groupMap用于存储群组信息，键是群组的标识符，值是群组的详细信息。
export const groupMap: Record<string, Group> = {}

// roleMap用于存储用户在不同群组中的角色信息，外层键是群组的标识符，内层键是用户的标识符，值是用户在该群组中的角色。
export const roleMap: Record<string, Record<string, number>> = {}

// friendMap用于存储好友信息，键是好友的标识符，值是好友的详细信息。
export const friendMap: Record<string, Profile> = {}

// richMediaDownloadMap用于管理富媒体下载，键是下载的唯一标识符，值是处理下载完成的回调函数。
export const richMediaDownloadMap: Record<string, (path: string) => void> = {}

// sendQueue是一个队列，用于存储等待发送的消息的回调函数。
export const sendQueue: ((msg: RedMessage) => void)[] = []

// sendCallbackMap用于映射消息ID到处理消息发送结果的回调函数。
export const sendCallbackMap: Record<string, (msg: RedMessage) => void> = {}

// chronoEventEmitter是ChronoEventEmitter类的一个实例，用于在应用程序内部发射和监听事件。
export const chronoEventEmitter = new ChronoEventEmitter()
