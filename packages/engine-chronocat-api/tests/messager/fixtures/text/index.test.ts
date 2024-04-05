import type { RedMessage } from '@chronocat/red'
import h from '@satorijs/element'
import { Messager } from '../../../../src/api/message/create/messager'
import { ctx, satoriConfig, saveResult } from '../../../mocks'

test('Red 编码器应当正确编码 纯文本消息', async () => {
  const commonSend = jest.fn(async () => undefined as unknown as RedMessage)
  const commonSave = jest.fn(async () => saveResult)
  const commonSendForward = jest.fn(
    async () => undefined as unknown as RedMessage,
  )

  await new Messager(
    ctx,
    satoriConfig,
    {
      send: commonSend,
      save: commonSave,
      sendForward: commonSendForward,
    },
    '9998',
  ).send(h.parse('xxx'))

  const sendCalls = commonSend.mock.calls.map((x) => x.slice(1))

  expect(sendCalls).toMatchSnapshot()
})
