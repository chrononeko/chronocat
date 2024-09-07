import { commonFile, commonGenerateUploadPath } from './file'
import { commonSave } from './save'
import { commonSend, commonSendForward } from './send'

export const common = {
  send: commonSend,
  sendForward: commonSendForward,
  save: commonSave,
  file: commonFile,
  generateUploadPath: commonGenerateUploadPath,
} as const

export type Common = typeof common
