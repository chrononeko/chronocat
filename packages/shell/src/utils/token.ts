import { randomBytes } from 'node:crypto'

export const generateToken = () => randomBytes(32).toString('hex')
export const generateToken16 = () => randomBytes(16).toString('hex')

export const buildEventIdCounter = () => {
  let i = 0
  return () => ++i
}
