import { rm } from 'fs/promises'
import { resolve } from 'node:path'

void Promise.all(
  [
    '../build',
    '../packages/red/lib',
    '../packages/red/tsconfig.tsbuildinfo',
    '../packages/shell/lib',
    '../packages/shell/generated',
    '../packages/shell/tsconfig.tsbuildinfo',
    '../packages/engine-chronocat-api/lib',
    '../packages/engine-chronocat-api/tsconfig.tsbuildinfo',
    '../packages/engine-chronocat-event/lib',
    '../packages/engine-chronocat-event/tsconfig.tsbuildinfo',
    '../packages/iife/lib',
    '../packages/llqqnt/lib',
    '../packages/docs/static/config-v0.schema.json',
    '../packages/docs/static/openapi.yaml',
  ].map((x) =>
    rm(resolve(__dirname, x), {
      force: true,
      recursive: true,
    }),
  ),
)
