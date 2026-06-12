import config from '@payload-config'
import { getPayload } from 'payload'

import { HomePage } from '@/components/HomePage'

export default async function Page() {
  const payload = await getPayload({ config })
  const content = await payload.findGlobal({ slug: 'site-content', depth: 2 })

  return <HomePage content={content} />
}
