import type { RedMessage } from '@chronocat/red'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { buildParser } from '../../../../src/parser'
import { ctx, satoriConfig } from '../../../mocks'

test('Red 解析器应当正确解析 群聊 视频消息', async () => {
  const message = JSON.parse(
    (await readFile(join(__dirname, 'data.json'))).toString('utf-8'),
  ) as RedMessage

  const events = await buildParser(ctx, satoriConfig)(message)

  expect(events).toBeTruthy() // 解析到的消息应该存在
  expect(events).toHaveLength(1) // 应当解析到 1 条消息

  const [event] = events!
  expect(event).toMatchSnapshot()
})
