import * as fs from 'node:fs'
import * as crypto from 'node:crypto'


const watchFolder = process.argv[2]
if (!watchFolder) {
  console.error('Usage: node -r esbuild-register runOnChanged <folder> <command>')
  process.exit(1)
}
const command = process.argv.slice(3).join(' ')

// create or compare hash of files in the folder
let hasChanged = false

let hashes = new Map()

const sha1 = (data: string) => crypto.createHash('sha1').update(data).digest('hex')


const hashFile = (file: string) => {
  const hash = sha1(fs.readFileSync(file, 'utf8'))
  if (hashes.get(file) !== hash) {
    hashes.set(file, hash)
    hasChanged = true
  }
}

const hashFilepath = `${watchFolder}/.runOnChanged.hashes.json`
const hashFolder = (folder: string) => {
  const files = fs.readdirSync(folder)
  files.forEach((file: any) => {
    const path = `${folder}/${file}`

    if (file.endsWith('.runOnChanged.hashes.json')) return

    if (fs.statSync(path).isDirectory()) {
      hashFolder(path)
    } else {
      hashFile(path)
    }
  })
}

if (fs.existsSync(hashFilepath)) {
  const oldHashes = JSON.parse(fs.readFileSync(hashFilepath, 'utf8'))
  hashes = new Map(Object.entries(oldHashes))
}

hashFolder(watchFolder)

if (hasChanged) {
  console.log('[+] Files have changed, rebuilding...')
  fs.writeFileSync(hashFilepath, JSON.stringify(Object.fromEntries(hashes)))
  require('child_process').execSync(command, { stdio: 'inherit' })
} else {
  console.log('[-] Files not changed :)')
}

