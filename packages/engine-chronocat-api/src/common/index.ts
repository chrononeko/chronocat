import { commonFile } from './file'
import { commonSave } from './save'
import { commonSend, commonSendForward } from './send'

export const common = {
  send: commonSend,
  sendForward: commonSendForward,
  save: commonSave,
  file: commonFile,
} as const

export type Common = typeof common
