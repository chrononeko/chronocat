import type { QFace } from '@chronocat/red'
import { readFile } from 'node:fs/promises'
import { getEmojiResourcePath } from '../../definitions/msgService'

let task: Promise<void> | undefined = undefined
let qfaces: QFace[] | undefined = undefined

const init = async () => {
  const { resourcePath } = await getEmojiResourcePath({
    type: 0,
  })
  qfaces = (
    JSON.parse((await readFile(resourcePath)).toString('utf-8')) as {
      sysface: QFace[]
    }
  ).sysface
}

export const qfaceGet = async (sid: string) => {
  if (!task) task = init()
  await task

  return qfaces!.find((x) => sid === x.QSid)
}

export const qfaceList = async () => {
  if (!task) task = init()
  await task

  return qfaces!
}
