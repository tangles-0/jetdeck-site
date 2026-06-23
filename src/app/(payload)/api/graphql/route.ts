import config from '@payload-config'
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes'

const graphQLPost = GRAPHQL_POST(config)

export const POST: typeof graphQLPost = async (...args) => {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Not found', { status: 404 })
  }

  return graphQLPost(...args)
}

export const OPTIONS = REST_OPTIONS(config)
