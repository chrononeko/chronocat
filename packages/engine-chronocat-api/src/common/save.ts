import type { ChronocatContext } from '@chronocat/shell'
import { commonFile } from './file'
import type { CommonSaveResult } from './types'

export const commonSave = async (
  ctx: ChronocatContext,
  urlString: string,
  fileInfo?: {
    fileName?: string | undefined
    fileMime?: string | undefined
  },
): Promise<CommonSaveResult> => {
  const parsedFile = await commonFile(ctx, urlString, fileInfo)

  await parsedFile.commit()

  return {
    filePath: parsedFile.destPath,
    fileSize: parsedFile.fileSize,
    fileName: parsedFile.fileName,
    fileMime: parsedFile.fileMime,
    md5: parsedFile.md5,
    imageInfo: parsedFile.imageInfo,
  }
}
