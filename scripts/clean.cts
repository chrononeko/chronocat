import { rm } from 'fs/promises'
import { resolve } from 'node:path'

void Promise.all(
  [
    '../build',
    '../packages/shell/lib',
    '../packages/shell/tsconfig.tsbuildinfo',
    '../packages/llqqntv0/lib',
    '../packages/llqqntv1/lib',
  ].map((x) =>
    rm(resolve(__dirname, x), {
      force: true,
      recursive: true,
    }),
  ),
)
