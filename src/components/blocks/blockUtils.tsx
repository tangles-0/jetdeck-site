'use client'

import {
  Antenna,
  Battery,
  Bluetooth,
  Camera,
  Cpu,
  EthernetPort,
  ExternalLink,
  Gamepad2,
  Gpu,
  HardDrive,
  Heart,
  Keyboard,
  MemoryStick,
  Radio,
  Terminal,
  Usb,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react'

import type { Media } from '@/payload-types'

export const icons: Record<string, LucideIcon> = {
  Antenna,
  Battery,
  Bluetooth,
  Camera,
  Cpu,
  EthernetPort,
  ExternalLink,
  Gamepad2,
  Gpu,
  HardDrive,
  Heart,
  Keyboard,
  MemoryStick,
  Radio,
  Terminal,
  Usb,
  Wifi,
  Zap,
}

export const iconColors: Record<string, string> = {
  cyan: 'text-cyan-400',
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  green: 'text-green-400',
  yellow: 'text-yellow-400',
  orange: 'text-orange-400',
  red: 'text-red-400',
  pink: 'text-pink-400',
}

export const asMedia = (value: number | Media | null | undefined): Media | null =>
  value && typeof value === 'object' ? value : null

export const toImages = (
  items: { image: number | Media }[] | null | undefined,
): { src: string; alt: string }[] =>
  (items ?? [])
    .map((item) => asMedia(item.image))
    .filter((media): media is Media => media !== null)
    .map((media) => ({ src: media.url ?? '', alt: media.alt ?? '' }))
