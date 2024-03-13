import h from '@satorijs/element'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { Messager } from '../../../../src/api/message/create/messager'
import {
  commonSend,
  commonSendForward,
  ctx,
  satoriConfig,
  saveResult,
} from '../../../mocks'

test('Red 编码器应当正确编码 图片消息', async () => {
  const save = jest.fn().mockReturnValueOnce(saveResult)

  await new Messager(
    ctx,
    satoriConfig,
    {
      send: commonSend,
      save,
      sendForward: commonSendForward,
    },
    '9998',
  ).send(
    h.parse(
      `xxx<img src="${pathToFileURL(
        resolve(__dirname, '../../../../docs/static/chronocat.png'),
      ).toString()}" />yyy`,
    ),
  )

  const sendCalls = commonSend.mock.calls.map((x) => x.slice(1))
  const saveCalls = save.mock.calls.map((x) => (x as unknown[]).slice(1))

  expect(sendCalls).toMatchSnapshot()
  expect(saveCalls).toMatchSnapshot()
})
