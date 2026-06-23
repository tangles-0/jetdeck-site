import config from '@payload-config'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

const graphQLPlaygroundGet = GRAPHQL_PLAYGROUND_GET(config)

export const GET: typeof graphQLPlaygroundGet = async (...args) => {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Not found', { status: 404 })
  }

  return graphQLPlaygroundGet(...args)
}
