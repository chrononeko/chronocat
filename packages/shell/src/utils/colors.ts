import styles from 'ansi-styles'
import type { ForegroundColor, BackgroundColor, Modifier } from 'ansi-styles'

export const color = (color: keyof ForegroundColor) => (text: string) => {
  const style = styles.color[color]
  return `${style.open}${text}${style.close}`
}

export const bgColor = (color: keyof BackgroundColor) => (text: string) => {
  const style = styles.bgColor[color]
  return `${style.open}${text}${style.close}`
}

export const modifier = (modifier: keyof Modifier) => (text: string) => {
  const style = styles.modifier[modifier]
  return `${style.open}${text}${style.close}`
}

export const bold = modifier('bold')
export const dim = modifier('dim')
export const italic = modifier('italic')
export const underline = modifier('underline')
export const overline = modifier('overline')

export const grey = color('grey')
export const red = color('red')
export const green = color('green')
export const yellow = color('yellow')
export const blue = color('blue')
export const magenta = color('magenta')
export const cyan = color('cyan')
export const white = color('white')

export type ColorFormatter = ReturnType<typeof color>
