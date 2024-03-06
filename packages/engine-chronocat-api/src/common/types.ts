export interface CommonSaveResult {
  filePath: string
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
