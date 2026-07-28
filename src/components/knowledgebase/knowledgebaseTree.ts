import type { Page } from '@/payload-types'

import { resolvePagePath } from '@/lib/knowledgebasePaths'

export type KnowledgebasePage = Pick<
  Page,
  | 'id'
  | 'path'
  | 'title'
  | 'isKnowledgebasePage'
  | 'knowledgebaseLabel'
  | 'knowledgebaseDescription'
  | 'knowledgebaseParent'
  | 'knowledgebaseOrder'
>

export type KnowledgebaseTreeItem = KnowledgebasePage & {
  children: KnowledgebaseTreeItem[]
  resolvedPath: string | null
}

const parentIdForPage = (page: KnowledgebasePage) => {
  if (!page.knowledgebaseParent) {
    return null
  }

  return typeof page.knowledgebaseParent === 'number' ? page.knowledgebaseParent : page.knowledgebaseParent.id
}

const hasParentCycle = (pageId: number, parentById: Map<number, number | null>) => {
  const seen = new Set<number>()
  let nextParentId = parentById.get(pageId)

  while (nextParentId) {
    if (nextParentId === pageId || seen.has(nextParentId)) {
      return true
    }

    seen.add(nextParentId)
    nextParentId = parentById.get(nextParentId)
  }

  return false
}

const sortKnowledgebaseItems = (items: KnowledgebaseTreeItem[]) => {
  items.sort((a, b) => {
    const orderComparison = (a.knowledgebaseOrder ?? 0) - (b.knowledgebaseOrder ?? 0)

    if (orderComparison !== 0) {
      return orderComparison
    }

    return (a.knowledgebaseLabel ?? a.title).localeCompare(b.knowledgebaseLabel ?? b.title)
  })

  items.forEach(item => sortKnowledgebaseItems(item.children))
}

export const buildKnowledgebaseTree = (pages: KnowledgebasePage[]) => {
  const byId = new Map<number, KnowledgebaseTreeItem>()
  const parentById = new Map<number, number | null>()

  pages.forEach(page => {
    byId.set(page.id, { ...page, children: [], resolvedPath: resolvePagePath(page, pages) })
    parentById.set(page.id, parentIdForPage(page))
  })

  const roots: KnowledgebaseTreeItem[] = []

  byId.forEach(item => {
    const parentId = parentById.get(item.id)
    const parent = parentId ? byId.get(parentId) : null

    if (parent && !hasParentCycle(item.id, parentById)) {
      parent.children.push(item)
      return
    }

    roots.push(item)
  })

  sortKnowledgebaseItems(roots)

  return roots
}
