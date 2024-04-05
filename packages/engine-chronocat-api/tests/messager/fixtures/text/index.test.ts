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

test('Red 编码器应当正确编码 链接', async () => {
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
  ).send(h.parse('<a href="https://chronocat.vercel.app">Chronocat</a>'))

  const sendCalls = commonSend.mock.calls.map((x) => x.slice(1))

  expect(sendCalls).toMatchSnapshot()
})

test('Red 编码器应当正确编码 br 换行', async () => {
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
  ).send(h.parse('<br/>aaa<br/>bbb<br/><br/>ccc<br/><br/><br/>ddd<br/>'))

  const sendCalls = commonSend.mock.calls.map((x) => x.slice(1))

  expect(sendCalls).toMatchSnapshot()
})

test('Red 编码器应当正确编码 p 换行', async () => {
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
  ).send(
    h.parse(
      '<p></p>aaa<p>bbb</p>ccc<p>ddd</p><p>eee</p><p></p><p></p>fff<p></p><p></p><p>ggg</p><p><p></p></p>hhh<p><p></p></p><p>iii</p><p></p>',
    ),
  )

  const sendCalls = commonSend.mock.calls.map((x) => x.slice(1))

  expect(sendCalls).toMatchSnapshot()
})

test('Red 编码器应当正确编码 br/p 混搭换行', async () => {
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
  ).send(
    h.parse(
      '<p></p>aaa<p>bbb<br/>uuu<br/></p>ccc<p>ddd</p><p>eee</p>vvv<br/>www<p></p><p></p>fff<p></p><p></p><p>ggg</p><p><p></p></p>hhh<p><p></p></p><p>iii</p><p>xxx<br/>yyy</p><p><br/>zzz<br/></p><p></p>',
    ),
  )

  const sendCalls = commonSend.mock.calls.map((x) => x.slice(1))

  expect(sendCalls).toMatchSnapshot()
})
