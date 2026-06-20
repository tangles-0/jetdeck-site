import type { Metadata } from 'next'

import { unstable_cache, unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'

import { PageRenderer } from '@/components/PageRenderer'
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

const getPageData = async (path: string) => {
  const { page } = await getPageByPath(path)
  const navPages = await getNavPages()

  return {
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
  const { page } = await getPageByPath(pathFromSlug(slug))

  return {
    title: page?.title ? `${page.title} | JetDeck SCOUT` : 'JetDeck SCOUT',
  }
}

export default async function Page({ params }: Args) {
  const { slug } = await params
  const path = pathFromSlug(slug)
  const settings = await getSiteSettings()

  if (settings.disablePageCache) {
    noStore()
  }

  const { navPages, page } = settings.disablePageCache ? await getPageData(path) : await getCachedPageData(path)

  if (!page) {
    notFound()
  }

  return <PageRenderer page={page} navPages={navPages} settings={settings} />
}
