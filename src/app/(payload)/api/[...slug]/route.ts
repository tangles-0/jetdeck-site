import config from '@payload-config'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'
import { getPayload } from 'payload'

const restGet = REST_GET(config)

const notFound = () => new Response('Not found', { status: 404 })

const isProtectedPublicRead = (request: Request) => {
  if (process.env.NODE_ENV !== 'production') {
    return false
  }

  const [, apiSegment, firstSegment, secondSegment] = new URL(request.url).pathname.split('/')

  if (apiSegment !== 'api') {
    return false
  }

  if (firstSegment === 'media' && secondSegment === 'file') {
    return false
  }

  return firstSegment === 'pages' || firstSegment === 'media' || (firstSegment === 'globals' && secondSegment === 'site-settings')
}

const hasAuthenticatedUser = async (request: Request) => {
  try {
    const payload = await getPayload({ config })
    const result = await payload.auth({ headers: request.headers })

    return Boolean(result.user)
  } catch {
    return false
  }
}

export const GET: typeof restGet = async (...args) => {
  const [request] = args

  if (isProtectedPublicRead(request) && !(await hasAuthenticatedUser(request))) {
    return notFound()
  }

  return restGet(...args)
}
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
