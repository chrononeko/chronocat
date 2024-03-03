import type { Schema } from 'ajv'
import Ajv from 'ajv'
import localize from 'ajv-i18n/localize/zh'

const ajv = new Ajv({
  discriminator: true,
  useDefaults: true,
})

ajv.addKeyword({
  keyword: 'defaultProperties',
  valid: true,
})

// eslint-disable-next-line @typescript-eslint/no-var-requires
ajv.addSchema(require('../../generated/schemas.json') as Schema[])

export const validate = (id: string) => async (data: unknown) => {
  const validate = ajv.getSchema(id)
  if (await validate!(data)) return undefined
  localize(validate!.errors)
  let e = ''
  let i = 0
  for (const error of validate!.errors!)
    e += `\t问题 ${++i}：${error.schemaPath}：${error.message}`
  return e
}
