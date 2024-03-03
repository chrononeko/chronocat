import type { Schema } from 'ajv'
import Ajv from 'ajv'
import localize from 'ajv-i18n/localize/zh'
import schemas from '../../generated/schemas.json'

const ajv = new Ajv({
  discriminator: true,
  useDefaults: true,
})

ajv.addKeyword({
  keyword: 'defaultProperties',
  valid: true,
})

ajv.addSchema(schemas as Schema[])

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
