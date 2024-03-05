import type { PathLike } from 'node:fs'
import { define } from '../invoke'
import { qqVersion } from '../utils'

const fsApiName = qqVersion > 19000 ? 'ns-FsApi-2' : 'ns-fsApi-2'

export const getFileMd5 = define<string, [PathLike]>(fsApiName, 'getFileMd5')

export const getImageSizeFromPath = define<
  {
    width: number
    height: number
    type: string // png
    mime: string // image/png
    wUnits: string // px
    hUnits: string // px
  },
  [PathLike]
>(fsApiName, 'getImageSizeFromPath')

export const getFileSize = define<number, [PathLike]>(fsApiName, 'getFileSize')

export const getFileType = define<
  {
    mime: string
  },
  [PathLike]
>(fsApiName, 'getFileType')
