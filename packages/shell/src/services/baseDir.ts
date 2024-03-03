import { homedir } from 'node:os'
import { join } from 'node:path'

export const baseDir = join(homedir(), '.chronocat')
