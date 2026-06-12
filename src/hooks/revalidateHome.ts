import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

// Re-render the home page whenever content is saved in the admin panel,
// so changes go live immediately without a rebuild.
const revalidate = () => {
  try {
    revalidatePath('/')
  } catch {
    // revalidatePath only works inside a Next.js request context.
    // Outside of it (e.g. the seed script) there is no cache to clear.
  }
}

export const revalidateHome: GlobalAfterChangeHook = ({ doc }) => {
  revalidate()
  return doc
}

export const revalidateHomeOnMediaChange: CollectionAfterChangeHook = ({ doc }) => {
  revalidate()
  return doc
}
