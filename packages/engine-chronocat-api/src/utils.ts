// eslint-disable-next-line import/no-unresolved
import { app } from 'electron'
import { randomBytes } from 'node:crypto'

export const qqVersion = +app.getVersion().split('-')[1]!

export const generateToken = () => randomBytes(32).toString('hex')
export const generateToken16 = () => randomBytes(16).toString('hex')
