import h from '@satorijs/element'
import { Messager } from '../../../../src/api/message/create/messager'
import {
  commonSave,
  commonSend,
  commonSendForward,
  ctx,
  satoriConfig,
} from '../../../mocks'

test('Red 编码器应当正确编码 纯文本消息', async () => {
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
