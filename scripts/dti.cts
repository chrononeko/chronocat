import type { Buffer } from 'node:buffer'
import { verify } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { argv } from 'node:process'

const checkScript = (key: Buffer, rawFile: Buffer) =>
  new Promise<Buffer>((res, rej) => {
    const partSig = rawFile.subarray(0, 1024)
    const partData = rawFile.subarray(1024)

    verify('sha256', partData, key, partSig, (e, r) =>
      e ? rej(e) : r ? res(partData) : rej(new Error('Check failed.')),
    )
  })

void (async () => {
  const key = await readFile(
    resolve(__dirname, '../packages/docs/static/ti.pub'),
  )
  const rawFile = await readFile(argv[2]!)
  await checkScript(key, rawFile)
})()
