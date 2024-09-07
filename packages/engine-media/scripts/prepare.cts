import AdmZip from 'adm-zip'
import { access, mkdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const filenames = ['ntsilk-win32-x64.exe', 'ntsilk-linux-x64']
const dstDir = resolve(__dirname, '../../../build/caches')
const dstPath = join(dstDir, 'ntsilk.zip')

export async function exists(path: string): Promise<boolean> {
  try {
    await access(path)
  } catch (_) {
    return false
  }
  return true
}

void (async () => {
  await mkdir(dstDir, {
    recursive: true,
  })

  if (await exists(dstPath)) return

  const zip = new AdmZip()

  await Promise.all(
    filenames.map((name) =>
      fetch(
        `https://raw.githubusercontent.com/ntsilk-userland/binaries/master/${name}`,
      )
        .then((response) => response.arrayBuffer())
        .then((data) => {
          zip.addFile(name, Buffer.from(data))
        }),
    ),
  )

  await zip.writeZipPromise(dstPath)
})()
