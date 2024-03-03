import { access } from 'node:fs/promises'

export async function exists(path: string): Promise<boolean> {
  try {
    await access(path)
  } catch (_) {
    return false
  }
  return true
}
