import { clsx } from 'clsx'
import React from 'react'
import styles from './Badge.module.css'

export const badgeType = {
  satori: {
    children: 'Satori',
    class: styles.badgeSatori,
  },
  chronocat: {
    children: 'Chronocat',
    class: styles.badgeChronocat,
  },
  recv: {
    children: '收',
    class: styles.badgeEvent,
  },
  primary: {
    children: '',
    class: 'badge--primary',
  },
  secondary: {
    children: '',
    class: 'badge--secondary',
  },
  success: {
    children: '',
    class: 'badge--success',
  },
  introduced: {
    children: '',
    class: 'badge--success',
  },
  send: {
    children: '发',
    class: 'badge--success',
  },
  forward: {
    children: '合并转发',
    class: 'badge--success',
  },
  info: {
    children: '',
    class: 'badge--info',
  },
  warning: {
    children: '',
    class: 'badge--warning',
  },
  experimental: {
    children: '实验性',
    class: 'badge--warning',
  },
  danger: {
    children: '',
    class: 'badge--danger',
  },
  notavailable: {
    children: '未具备',
    class: 'badge--danger',
  },
  notimplemented: {
    children: '未实现',
    class: 'badge--danger',
  },
} as const

export type BadgeType = keyof typeof badgeType

export interface BadgeProps {
  type: BadgeType
  children?: React.ReactNode
}

export const Badge = ({ type, children }: BadgeProps) => (
  <span
    className={clsx('badge', badgeType[type].class)}
    children={children || badgeType[type].children}
  />
)
