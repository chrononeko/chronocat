import type { ChatType, SendType } from '@chronocat/red';
import { MsgType } from '@chronocat/red';
/**
 * QQNT 消息类型。
 *
 * @remarks
 * # 消息类型
 *
 * QQNT 的消息类型共有四种，它们分别是 {@link RedMessage.chatType}、{@link RedMessage.msgType}、{@link RedMessage.subMsgType}
 * 和 {@link RedMessage.sendType}。下面分别介绍这四种类型。
 *
 * ## {@link RedMessage.chatType}
 *
 * 消息的归属。目前只有 {@link ChatType.Private} 和 {@link ChatType.Group}。
 *
 * ## {@link RedMessage.msgType}
 *
 * 消息的主要类型。
 *
 * ## {@link RedMessage.subMsgType}
 *
 * 消息内容中包含的元素类型。普通消息的情况下以 Bitset 提供，可使用 {@link adaptMsgTypes}
 * 解析为一组 {@link Boolean} 字段。
 *
 * ## {@link RedMessage.sendType}
 *
 * 消息的呈现类型。
 */
export interface MsgTypes {
    chatType: ChatType;
    msgType: MsgType;
    subMsgType: {
        /**
         * 文本消息，如纯文本消息、at 消息等。
         *
         * @remarks
         * - Bit: `0000 0010 | 0000 0000 0000 0001` = `2-1`
         * - Bit: `0000 1001 | 0000 0000 0000 0001` = `9-1`
         * - `elementType`: `1`
         */
        text: boolean;
        /**
         * 图片。
         *
         * @remarks
         * - Bit: `0000 0010 | 0000 0000 0000 0010` = `2-2`
         * - `elementType`: `2`
         */
        pic: boolean;
        /**
         * 普通表情。
         *
         * @remarks
         * - Bit: `0000 0010 | 0000 0000 0001 0000` = `2-16`
         * - Bit: `0000 1001 | 0000 0000 0001 0000` = `9-16`
         * - `elementType`: `6`
         */
        face: boolean;
        /**
         * 链接。
         *
         * @remarks
         * - Bit: `0000 0010 | 0000 0000 1000 0000` = `2-128`
         * - `elementType`: `1`
         */
        link: boolean;
        /**
         * 合并转发。
         *
         * @remarks
         * - Bit: `0000 0010 | 0000 0000 0000 1000` = `2-8` (NT 合并转发)
         * - Bit: `0000 1000 | 0000 0000 0000 0000` = `8-0` (手 Q 合并转发)
         * - `elementType`: `16`
         */
        multiForward: boolean;
        /**
         * 回复（Quote）。
         *
         * @remarks
         * - Bit: `0000 1001 | 0000 0000 0010 0000` = `9-32`
         * - `elementType`: `7`
         */
        reply: boolean;
        /**
         * 原创表情。
         *
         * @remarks
         * - Bit: `0001 0001 | 0000 0000 0000 1000` = `17-8`
         * - `elementType`: `11`
         */
        marketFace: boolean;
        /**
         * 文件。
         *
         * @remarks
         * - Bit: `0000 0011 | 0000 0010 0000 0000` = `3-512`
         * - `elementType`: `3`
         */
        file: boolean;
    };
    sendType: SendType;
}
/**
 * 解析 QQNT 消息类型。
 */
export declare const parseMsgTypes: (message: RedMessage) => MsgTypes;
