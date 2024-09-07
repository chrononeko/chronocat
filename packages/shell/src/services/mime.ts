// @ts-expect-error
// There's a hoist pollution (@types/mime). see
// https://github.com/Microsoft/TypeScript/issues/11917
import { Mime } from 'mime/lite'
import mimeStandard from 'mime/types/standard.js'

export const mime = new Mime().define(mimeStandard).define({
  'audio/silk': ['slk', 'silk', 'ntsilk'],
})
