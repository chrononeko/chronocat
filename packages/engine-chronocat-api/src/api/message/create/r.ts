import type { Element, FaceBubbleType, Peer, QFace } from '@chronocat/red'
import { AtType, FaceType } from '@chronocat/red'
import type { ChronocatContext } from '@chronocat/shell'
import type { O } from 'ts-toolbelt'
import type { CommonSaveResult } from '../../../common/types'

const b = () => {
  const reg = {
    'payload/sendMsg': {
      msgId: '0',
      elements: [],
    },

    'peer/private': {
      chatType: 1,
      guildId: '',
      peerUid: '',
      peerUin: '',
    },
    'peer/group': {
      chatType: 2,
      guildId: '',
      peerUid: '',
      peerUin: '',
    },
  } as const

  const r = <T extends keyof typeof reg, D>(type: T, data: D) =>
    Object.assign({}, reg[type], data) as (typeof reg)[T] & D

  const h = {
    reg,

    peerPrivate: (peerUin: string): Peer =>
      r('peer/private', {
        peerUin,
      }),

    peerGroup: (peerUin: string): Peer =>
      r('peer/group', {
        peerUin,
      }),

    text: (content: string): O.Partial<Element, 'deep'> => ({
      elementId: '',
      elementType: 1,
      textElement: {
        content,
        atUid: '',
        atNtUid: '',
        atTinyId: '',
        atType: AtType.None,
      },
    }),

    at: (
      ctx: ChronocatContext,
      name: string,
      id: string,
    ): O.Partial<Element, 'deep'> => ({
      elementId: '',
      elementType: 1,
      textElement: {
        content: `@${name}`,
        atUid: id === 'all' ? 'all' : id,
        // atNtUin: (id === 'all' ? undefined : id) as string,
        atNtUid: (id === 'all'
          ? 'all'
          : ctx.chronocat.uix.getUid(id)) as string,
        atTinyId: '',
        atType: id === 'all' ? AtType.All : AtType.Normal,
      },
    }),

    face: (qface: QFace, faceType: FaceType): O.Partial<Element, 'deep'> =>
      isNaN(Number(qface.QSid))
        ? {
            elementId: '',
            elementType: 1,
            textElement: {
              content: qface.QSid,
              atUid: '',
              atNtUid: '',
              atTinyId: '',
              atType: AtType.None,
            },
          }
        : {
            elementType: 6,
            elementId: '',
            faceElement: {
              faceIndex: Number(qface.QSid),
              faceText: `[${qface.QDes.slice(1)}]`,
              faceType,
              imageType: 1,
              packId: qface.AniStickerPackId,
              stickerId: qface.AniStickerId,
              stickerType: qface.AniStickerType,
              sourceType: 1,
              resultId: '',
              superisedId: '',
              randomType: 1,
            },
          },

    marketEmoticon: (faceIndex: number): O.Partial<Element, 'deep'> => ({
      elementType: 6,
      elementId: '',
      faceElement: {
        faceIndex,
        faceText: '\n',
        faceType: FaceType.MarketEmoticon,
        imageType: 1,
      },
    }),

    marketFace: (
      tabId: number,
      faceId: string,
      key: string,
    ): O.Partial<Element, 'deep'> => ({
      elementType: 11,
      elementId: '',
      marketFaceElement: {
        itemType: 6,
        faceInfo: 1,
        emojiPackageId: tabId,
        subType: 3,
        mediaType: 0,
        imageWidth: 200,
        imageHeight: 200,
        faceName: '[动画表情]',
        emojiId: faceId,
        key: key,
        emojiType: 1,
      },
    }),

    faceBubble: (
      id: FaceBubbleType,
      count?: number,
      summary?: string,
      content?: string,
    ): O.Partial<Element, 'deep'> => ({
      elementType: 27,
      elementId: '',
      faceBubbleElement: {
        faceType: id,
        faceCount: count || 1,
        faceSummary: summary || '',
        faceFlag: 0,
        content: content || `[${summary}]x${count}`,
        oldVersionStr: '',
      },
    }),

    pcPoke: (pokeType: number): O.Partial<Element, 'deep'> => ({
      elementId: '0',
      elementType: 6,
      faceElement: {
        faceIndex: 0,
        faceType: FaceType.PCPoke,
        msgType: 0,
        pokeType,
        pokeStrength: 0,
      },
    }),

    reply: (
      /**
       * 消息 ID，选填。
       *
       * 消息 ID 与消息序号可二选一。
       *
       * 不填则在手机非 NT 版本
       * QQ（8.9.63 以下版本）无法看到引用消息。
       */
      replayMsgId?: string,

      /**
       * 消息序号，选填。
       *
       * 可由消息 ID 通过 message/getHistory 换取。
       */
      replayMsgSeq?: string,

      /**
       * 引用消息的发送者 QQ，选填。
       *
       * 不填则消息前会有一个奇怪的「@」文本。
       */
      senderUin?: string,
    ): O.Partial<Element, 'deep'> => ({
      elementId: '',
      elementType: 7,
      replyElement: {
        replayMsgId,
        replayMsgSeq,
        senderUin,
        senderUinStr: senderUin,
      },
    }),

    remoteImage: (
      saveResult: CommonSaveResult,
      picType: number,
    ): O.Partial<Element, 'deep'> => ({
      elementId: '',
      elementType: 2,
      extBufForUI: '',
      picElement: {
        fileName: saveResult.fileName,
        fileSize: String(saveResult.fileSize),
        fileSubId: '',
        fileUuid: '',
        md5HexStr: saveResult.md5,
        original: true,
        picHeight: saveResult.imageInfo!.height,
        picWidth: saveResult.imageInfo!.width,
        picType,
        picSubType: 0,
        sourcePath: saveResult.filePath,
        summary: '',
        thumbFileSize: 0,
        // thumbPath: undefined,
      },
    }),

    remoteAudio: (
      saveResult: CommonSaveResult,
      duration: number,
      waveAmplitudes?: number[],
    ): O.Partial<Element, 'deep'> => ({
      elementId: '',
      elementType: 4,
      pttElement: {
        canConvert2Text: true,
        fileName: saveResult.fileName,
        filePath: saveResult.filePath,
        md5HexStr: saveResult.md5,
        fileId: 0,
        fileSubId: '',
        fileSize: String(saveResult.fileSize),
        duration,
        formatType: 1,
        voiceType: 1,
        voiceChangeType: 0,
        playState: 1,
        waveAmplitudes: waveAmplitudes || [
          99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99,
        ],
      },
    }),

    remoteFile: (saveResult: CommonSaveResult): O.Partial<Element, 'deep'> => ({
      elementId: '',
      elementType: 3,
      fileElement: {
        fileMd5: '',
        fileName: saveResult.fileName,
        filePath: saveResult.filePath,
        fileSize: String(saveResult.fileSize),
        picHeight: 0,
        picWidth: 0,
        picThumbPath: {},
        file10MMd5: '',
        fileSha: '',
        fileSha3: '',
        fileUuid: '',
        fileSubId: '',
        thumbFileSize: 750,
      },
    }),
  }

  return Object.defineProperties(
    r,
    Object.fromEntries(Object.entries(h).map(([k, value]) => [k, { value }])),
  ) as typeof r & typeof h
}

export const r = b()
