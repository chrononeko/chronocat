// Should be 'mime/lite' but there's hoist pollution
import { Mime } from 'mime/dist/src/index_lite'
import mimeStandard from 'mime/types/standard.js'

export const mime = new Mime().define(mimeStandard).define({
  'audio/silk': ['slk', 'silk', 'ntsilk'],
})
