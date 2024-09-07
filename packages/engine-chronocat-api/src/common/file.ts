import type { ChronocatContext } from '@chronocat/shell'
import fetch from 'node-fetch'
import { createReadStream, createWriteStream } from 'node:fs'
import { copyFile, mkdir, unlink, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { finished } from 'node:stream/promises'
import {
  getFileMd5,
  getFileSize,
  getFileType,
  getImageSizeFromPath,
} from '../definitions/fsApi'
import {
  getRichMediaFilePath,
  getRichMediaFilePathForGuild,
} from '../definitions/msgService'
import { generateToken16, qqVersion } from '../utils'
import type { CommonFileResult } from './types'

const dispositionRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/

export const commonFile = async (
  ctx: ChronocatContext,
  urlString: string,
  fileInfo?: {
    fileName?: string | undefined
    fileMime?: string | undefined
  },
): Promise<CommonFileResult> => {
  const url = new URL(urlString)

  let { fileName, filePath, fileMime } = Object.assign(
    {} as {
      fileName: string
      filePath: string
      fileMime: string | undefined
    },
    fileInfo,
  )

  switch (url.protocol) {
    case 'file:': {
      // 本地图片
      fileName ||= basename(url.pathname)
      filePath = await saveFile(ctx, createReadStream(url), fileName)
      break
    }

    case 'http:':
    case 'https:': {
      const response = await fetch(url)

      // 从 Content-Disposition 获得文件名
      const disposition = response.headers.get('Content-Disposition')
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const matches = dispositionRegex.exec(disposition)
        if (matches && matches[1]) {
          fileName ||= matches[1].replace(/['"]/g, '')
        }
      }

      // 从 URL 获得文件名
      fileName ||= basename(url.pathname)

      // 从 Content-Type 获得 MIME
      fileMime ||= response.headers.get('Content-Type') || undefined
      if (fileMime && !fileName.includes('.')) {
        const ext = ctx.chronocat.mime.getExtension(fileMime)
        fileName += ext ? '.' + ext : ''
      }

      filePath = await saveFile(
        ctx,
        // Readable.fromWeb(response.body as ReadableStream),
        response.body!,
        fileName,
      )

      break
    }

    case 'data:': {
      const capture = /^data:([\w/-]+);base64,(.*)$/.exec(urlString)
      if (capture) {
        fileMime ||= capture[1]!
        const base64 = capture[2]!
        const ext = ctx.chronocat.mime.getExtension(fileMime)
        fileName ||= generateToken16() + (ext ? '.' + ext : '')
        filePath = await saveBuffer(
          ctx,
          Buffer.from(base64, 'base64'),
          fileName,
        )
      } else throw new Error('unsupportted data uri')

      break
    }

    default: {
      throw new Error(`unsupportted protocol: ${url.protocol}`)
    }
  }

  if (!fileMime) {
    // MIME 未知，使用 QQ 能力检测 MIME
    const fileType: {
      mime: string
    } = await getFileType(filePath)
    if (fileType?.mime) fileMime = fileType.mime
  }

  // QQ 也不能检测，使用默认 MIME
  fileMime ||= 'application/octet-stream'

  const fileCategory = fileMime.split('/')[0]!

  const [md5, imageInfo, fileSize] = await Promise.all([
    getFileMd5(filePath),
    fileCategory === 'image' ? getImageSizeFromPath(filePath) : undefined,
    getFileSize(filePath),
  ])

  const richMediaPath =
    qqVersion > 17000
      ? await getRichMediaFilePathForGuild({
          path_info: {
            md5HexStr: md5,
            fileName,
            elementType: getElementTypeFromMime(fileCategory),
            elementSubType: 0,
            thumbSize: 0,
            needCreate: true,
            fileType: 1,
            file_uuid: '',
            downloadType: 1,
          },
        })
      : await getRichMediaFilePath({
          md5HexStr: md5,
          fileName,
          elementType: getElementTypeFromMime(fileCategory),
          elementSubType: 0,
          thumbSize: 0,
          needCreate: true,
          fileType: 1,
        })

  const cancel = () => {
    void unlink(filePath)
  }

  const commit = async () => {
    await copyFile(filePath, richMediaPath)
    cancel()
  }

  return {
    srcPath: filePath,
    dstPath: richMediaPath,
    fileSize,
    fileName,
    fileMime,
    md5,
    imageInfo,
    commit,
    cancel,
  }
}

async function saveFile(
  ctx: ChronocatContext,
  file: {
    pipe: <T extends NodeJS.WritableStream>(
      destination: T,
      options?: { end?: boolean | undefined },
    ) => T
  },
  fileName: string,
) {
  const filePath = await commonGenerateUploadPath(ctx, fileName)
  await finished(file.pipe(createWriteStream(filePath)))
  return filePath
}

async function saveBuffer(
  ctx: ChronocatContext,
  buffer: Buffer,
  fileName: string,
) {
  const filePath = await commonGenerateUploadPath(ctx, fileName)
  await writeFile(filePath, buffer)
  return filePath
}

export async function commonGenerateUploadPath(
  ctx: ChronocatContext,
  fileName: string,
) {
  const dir = join(ctx.chronocat.baseDir, 'tmp/upload')
  await mkdir(dir, {
    recursive: true,
  })
  return join(dir, `${generateToken16()}-${fileName}`)
}

function getElementTypeFromMime(category: string) {
  switch (category) {
    case 'audio':
      return 4 // 语音
    case 'image':
      return 2 // 图片
    case 'video':
      return 5 // 视频
  }

  // 对未知类型统一假定为图片
  return 2 // 图片
}
