import type { Page } from '@/payload-types'

import { isSafePagePath } from './cmsValidation'

export type KnowledgebasePathPage = Pick<
  Page,
  'id' | 'path' | 'title' | 'isKnowledgebasePage' | 'knowledgebaseLabel' | 'knowledgebaseParent'
>

const normalizePagePath = (path: string) => {
  if (path === '/') {
    return path
  }

  return path.replace(/\/+$/, '')
}

const explicitPathForPage = (page: Pick<Page, 'path'>) => {
  if (!page.path || !isSafePagePath(page.path)) {
    return null
  }

  return normalizePagePath(page.path)
}

const parentIdForPage = (page: Pick<Page, 'knowledgebaseParent'>) => {
  if (!page.knowledgebaseParent) {
    return null
  }

  return typeof page.knowledgebaseParent === 'number' ? page.knowledgebaseParent : page.knowledgebaseParent.id
}

export const slugifyKnowledgebaseLabel = (value: string) => {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || 'page'
}

export const resolvePagePath = (page: KnowledgebasePathPage, pages: KnowledgebasePathPage[] = []) => {
  const explicitPath = explicitPathForPage(page)

  if (explicitPath) {
    return explicitPath
  }

  if (!page.isKnowledgebasePage) {
    return null
  }

  const byId = new Map(pages.map(item => [item.id, item]))
  const segments: string[] = []
  const seen = new Set<number>()
  let current: KnowledgebasePathPage | undefined = page

  while (current && !seen.has(current.id)) {
    seen.add(current.id)

    const currentExplicitPath = current.id === page.id ? null : explicitPathForPage(current)

    if (currentExplicitPath) {
      const suffix = segments.reverse().join('/')
      return suffix ? `${currentExplicitPath === '/' ? '' : currentExplicitPath}/${suffix}` : currentExplicitPath
    }

    segments.push(slugifyKnowledgebaseLabel(current.knowledgebaseLabel ?? current.title))

    const parentId = parentIdForPage(current)
    current = parentId ? byId.get(parentId) : undefined
  }

  return `/${segments.reverse().join('/')}`
}
