import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

const revalidate = (path = '/', type?: 'page' | 'layout') => {
  try {
    revalidateTag('cms-pages', 'max')
    revalidatePath(path, type)
  } catch {
    // revalidatePath only works inside a Next.js request context.
    // Outside of it (e.g. the seed script) there is no cache to clear.
  }
}

export const revalidateHome: GlobalAfterChangeHook = ({ doc }) => {
  revalidate()
  return doc
}

export const revalidateAllPages: GlobalAfterChangeHook = ({ doc }) => {
  revalidate('/', 'layout')
  return doc
}

export const revalidatePage: CollectionAfterChangeHook = ({ doc }) => {
  if (typeof doc.path === 'string') {
    revalidate(doc.path)
  }

  revalidate('/', 'layout')
  return doc
}

export const revalidateHomeOnMediaChange: CollectionAfterChangeHook = ({ doc }) => {
  revalidate('/', 'layout')
  return doc
}
