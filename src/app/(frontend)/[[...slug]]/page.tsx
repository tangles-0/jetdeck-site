import type { Metadata } from 'next'

import config from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { PageRenderer } from '@/components/PageRenderer'

const pathFromSlug = (slug?: string[]) => (slug?.length ? `/${slug.join('/')}` : '/')

type Args = {
  params: Promise<{
    slug?: string[]
  }>
}

const getPageByPath = async (path: string) => {
  const payload = await getPayload({ config })

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

export const generateMetadata = async ({ params }: Args): Promise<Metadata> => {
  const { slug } = await params
  const { page } = await getPageByPath(pathFromSlug(slug))

  return {
    title: page?.title ? `${page.title} | JetDeck SCOUT` : 'JetDeck SCOUT',
  }
}

export const generateStaticParams = async () => {
  const payload = await getPayload({ config })
  const pages = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 100,
  })

  return pages.docs.map((page) => ({
    slug: page.path === '/' ? [] : page.path.replace(/^\//, '').split('/'),
  }))
}

export default async function Page({ params }: Args) {
  const { slug } = await params
  const { payload, page } = await getPageByPath(pathFromSlug(slug))

  if (!page) {
    notFound()
  }

  const [settings, navPages] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', depth: 0 }),
    payload.find({
      collection: 'pages',
      depth: 0,
      limit: 100,
      sort: 'navOrder',
      where: {
        showInNav: {
          equals: true,
        },
      },
    }),
  ])

  return <PageRenderer page={page} navPages={navPages.docs} settings={settings} />
}
