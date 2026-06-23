import { NextResponse, type NextRequest } from 'next/server'

type RateLimitRule = {
  id: string
  limit: number
  windowMs: number
}

type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

const authRule: RateLimitRule = { id: 'auth', limit: 10, windowMs: 60_000 }
const graphQLRule: RateLimitRule = { id: 'graphql', limit: 30, windowMs: 60_000 }
const apiRule: RateLimitRule = { id: 'api', limit: 120, windowMs: 60_000 }
const adminRule: RateLimitRule = { id: 'admin', limit: 120, windowMs: 60_000 }

const productionGraphQLPaths = new Set(['/api/graphql', '/api/graphql-playground'])
const authEndpointPattern = /^\/api\/users\/(login|forgot-password|reset-password|first-register)$/

const clientIp = (request: NextRequest) =>
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  request.headers.get('x-real-ip') ||
  'unknown'

const ruleForPath = (pathname: string): RateLimitRule | null => {
  if (authEndpointPattern.test(pathname)) {
    return authRule
  }

  if (pathname === '/api/graphql' || pathname === '/api/graphql-playground') {
    return graphQLRule
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return adminRule
  }

  if (pathname === '/api' || pathname.startsWith('/api/')) {
    return apiRule
  }

  return null
}

const checkRateLimit = (key: string, rule: RateLimitRule) => {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    const nextBucket = { count: 1, resetAt: now + rule.windowMs }
    buckets.set(key, nextBucket)
    return { limited: false, remaining: rule.limit - 1, resetAt: nextBucket.resetAt }
  }

  bucket.count += 1

  return {
    limited: bucket.count > rule.limit,
    remaining: Math.max(rule.limit - bucket.count, 0),
    resetAt: bucket.resetAt,
  }
}

const withRateLimitHeaders = (response: NextResponse, rule: RateLimitRule, remaining: number, resetAt: number) => {
  response.headers.set('X-RateLimit-Limit', String(rule.limit))
  response.headers.set('X-RateLimit-Remaining', String(remaining))
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetAt / 1000)))
  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (process.env.NODE_ENV === 'production' && productionGraphQLPaths.has(pathname)) {
    return new NextResponse('Not found', { status: 404 })
  }

  const rule = ruleForPath(pathname)

  if (!rule) {
    return NextResponse.next()
  }

  const result = checkRateLimit(`${rule.id}:${clientIp(request)}`, rule)

  if (result.limited) {
    return withRateLimitHeaders(new NextResponse('Too many requests', { status: 429 }), rule, result.remaining, result.resetAt)
  }

  return withRateLimitHeaders(NextResponse.next(), rule, result.remaining, result.resetAt)
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}
