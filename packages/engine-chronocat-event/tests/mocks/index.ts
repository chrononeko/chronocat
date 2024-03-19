import type { ChronocatContext } from '@chronocat/shell'
import h from '@satorijs/element'

export const ctx: ChronocatContext = {
  chronocat: {
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
