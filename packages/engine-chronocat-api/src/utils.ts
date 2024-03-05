// eslint-disable-next-line import/no-unresolved
import { app } from 'electron'

export const qqVersion = +app.getVersion().split('-')[1]!
