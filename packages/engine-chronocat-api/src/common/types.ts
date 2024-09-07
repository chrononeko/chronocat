interface CommonFileInfo {
  fileSize: number
  fileName: string
  fileMime: string
  md5: string
  imageInfo:
    | {
        width: number
        height: number
        type: string // png
        mime: string // image/png
        wUnits: string // px
        hUnits: string // px
      }
    | undefined
}

export interface CommonSaveResult extends CommonFileInfo {
  filePath: string
}

export interface CommonFileResult extends CommonFileInfo {
  srcPath: string
  dstPath: string
  commit: () => Promise<void>
  cancel: () => void
}
