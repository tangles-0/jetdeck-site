import type { Metadata } from 'next'

import { unstable_cache, unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'

import { PageRenderer } from '@/components/PageRenderer'
import { resolvePagePath } from '@/lib/knowledgebasePaths'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const pathFromSlug = (slug?: string[]) => (slug?.length ? `/${slug.join('/')}` : '/')

type Args = {
  params: Promise<{
    slug?: string[]
  }>
}

const getPageByPath = async (path: string) => {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'pages',
    depth: 2,
    limit: 1,
    where: {
      path: {
        equals: path,
      },
    },
  })

  return { payload, page: result.docs[0] ?? null }
}

const getNavPages = async () => {
  const payload = await getPayloadClient()

  return payload.find({
    collection: 'pages',
    depth: 0,
    limit: 100,
    sort: 'navOrder',
    where: {
      showInNav: {
        equals: true,
      },
    },
  })
}

const getKnowledgebasePages = async () => {
  const payload = await getPayloadClient()

  return payload.find({
    collection: 'pages',
    depth: 1,
    limit: 200,
    sort: 'knowledgebaseOrder',
    where: {
      isKnowledgebasePage: {
        equals: true,
      },
    },
  })
}

const findKnowledgebasePageByResolvedPath = (
  path: string,
  pages: Awaited<ReturnType<typeof getKnowledgebasePages>>['docs'],
) => pages.find(page => resolvePagePath(page, pages) === path) ?? null

const getPageByResolvedPath = async (path: string) => {
  const { page } = await getPageByPath(path)

  if (page) {
    return page
  }

  const knowledgebasePages = await getKnowledgebasePages()
  return findKnowledgebasePageByResolvedPath(path, knowledgebasePages.docs)
}

const getPageData = async (path: string) => {
  const [{ page: explicitPage }, navPages, knowledgebasePages] = await Promise.all([
    getPageByPath(path),
    getNavPages(),
    getKnowledgebasePages(),
  ])
  const page = explicitPage ?? findKnowledgebasePageByResolvedPath(path, knowledgebasePages.docs)

  return {
    knowledgebasePages: knowledgebasePages.docs,
    navPages: navPages.docs,
    page,
  }
}

const getCachedPageData = unstable_cache(getPageData, ['cms-page-data'], {
  tags: ['cms-pages'],
})

const getSiteSettings = async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 0 })
}

export const generateMetadata = async ({ params }: Args): Promise<Metadata> => {
  const { slug } = await params
  const page = await getPageByResolvedPath(pathFromSlug(slug))

  return {
    title: page?.title ? `${page.title} | JetDeck SCOUT` : 'JetDeck SCOUT',
  }
}

const Page = async ({ params }: Args) => {
  const { slug } = await params
  const path = pathFromSlug(slug)
  const settings = await getSiteSettings()

  if (settings.disablePageCache) {
    noStore()
  }

  const { knowledgebasePages, navPages, page } = settings.disablePageCache
    ? await getPageData(path)
    : await getCachedPageData(path)

  if (!page) {
    notFound()
  }

  return (
    <PageRenderer
      page={page}
      currentPath={path}
      navPages={navPages}
      settings={settings}
      knowledgebasePages={knowledgebasePages}
    />
  )
}

export default Page
