// 导入Node.js的事件发射器模块。
import { EventEmitter } from 'node:events'

// 定义一个类型，用于描述事件名和对应的监听器函数。
type EmittedEvents = Record<string | symbol, (...args: unknown[]) => unknown>

// 定义一个接口，指定TypedEventEmitter类的行为，包括on, once, 和 emit方法。
// 这些方法分别用于添加事件监听器、添加一次性事件监听器、以及发射事件。
export interface TypedEventEmitter<ES extends EmittedEvents> {
  on<E extends keyof ES>(event: E, listener: ES[E]): this
  once<E extends keyof ES>(event: E, listener: ES[E]): this
  emit<E extends keyof ES>(event: E, ...args: Parameters<ES[E]>): boolean
}

// 定义TypedEventEmitter类，它继承自Node.js的EventEmitter。
// 这个类是泛型的，允许在创建实例时指定一个事件类型的集合，从而实现类型安全的事件处理。
export class TypedEventEmitter<ES extends EmittedEvents> extends EventEmitter {}

// 定义ChronoEvents类型，指定应用中可能发生的事件及其对应的监听器函数类型。
// 在这个示例中，定义了buddyListChange和groupListUpdate两个事件，它们的监听器不接受参数也不返回值。
export type ChronoEvents = {
  buddyListChange: () => void
  groupListUpdate: () => void
}

// 定义ChronoEventEmitter类，继承自TypedEventEmitter并指定ES为ChronoEvents。
// 这意味着ChronoEventEmitter是一个具体的事件发射器，用于处理buddyListChange和groupListUpdate事件。
export class ChronoEventEmitter extends TypedEventEmitter<ChronoEvents> {
  // 定义emitBuddyListChange方法，用于发射buddyListChange事件。
  // 这是一个方便的封装，允许外部代码通过调用一个方法来发射事件，而无需关心事件的具体名称。
  emitBuddyListChange = () => this.emit('buddyListChange')
  // 定义emitGroupListUpdate方法，同样是为了方便地发射groupListUpdate事件。
  emitGroupListUpdate = () => this.emit('groupListUpdate')
}
