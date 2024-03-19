// 导入类型定义，以确保类型安全。
import type {
  ChronocatContext,  // 应用程序上下文类型，提供了操作和配置的接口。
  Message,           // 消息类型，定义了返回消息应有的结构。
  MessageGetPayload, // 获取消息时传递的负载类型，定义了必要的请求参数。
} from '@chronocat/shell'

// 定义buildMessageGet函数，它是一个高阶函数，接收一个ChronocatContext类型的上下文对象。
export const buildMessageGet =
  (_ctx: ChronocatContext) => // 接收上下文对象。这里使用_前缀表示参数未在函数体内使用，但保留这个参数为将来可能的扩展提供可能。
  async ({ message_id }: MessageGetPayload): Promise<Message> => { // 返回的异步函数，接收一个包含message_id的对象。
    // 返回一个Message对象。
    return {
      id: message_id,               // 使用请求中的message_id作为消息的id。
      content: undefined as unknown as string, // 将content初始化为undefined，然后强制类型转换为string。这是一个示例，实际应用中应从数据源获取内容。
    }
  }
