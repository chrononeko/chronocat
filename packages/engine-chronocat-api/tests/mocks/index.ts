import type { RedMessage } from '@chronocat/red'
import type { ChronocatContext } from '@chronocat/shell'
import h from '@satorijs/element'

export const ctx: ChronocatContext = {
  chronocat: {
    api: {
      'chronocat.internal.red.message.parse': (() => {
        const fn = (async () =>
          undefined) as unknown as ChronocatContext['chronocat']['api']['chronocat.internal.red.message.parse']

        fn.notimpl = false
        fn.engine = 'engine-mock'
        fn.priority = 0

        return fn
      })(),
    } as ChronocatContext['chronocat']['api'],
    l: {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as unknown as ChronocatContext['chronocat']['l'],
    h,
  } as ChronocatContext['chronocat'],
  chronocatEngineChronocatApi: {
    msgBoxActiv: {
      activate: () => {},
    },
  },
}

export const satoriConfig = {
  type: 'satori',
  listen: '0.0.0.0',
  port: 5500,
  self_url: 'https://chronocat.vercel.app',
  token: 'DEFINE_CHRONO_TOKEN',
  enable: true,
} as const

export const saveResult = {
  filePath: '',
  fileSize: 0,
  fileName: '',
  fileMime: '',
  md5: '',
  imageInfo: {
    width: 0,
    height: 0,
    type: 'png',
    mime: 'image/png',
    wUnits: '1',
    hUnits: '1',
  },
}

export const commonSend = jest.fn(
  async () => undefined as unknown as RedMessage,
)
export const commonSave = jest.fn(async () => saveResult)
export const commonSendForward = jest.fn(async () => {})
