const CONTROL_OR_BACKSLASH = /[\u0000-\u001F\u007F\\]/
const PAGE_PATH_PATTERN = /^\/(?:[A-Za-z0-9_-]+\/?)*$/

type FieldValue = string | string[] | null | undefined

export const validatePagePath = (value: FieldValue) => {
  if (typeof value !== 'string') {
    return 'Path must be a string'
  }

  if (value.trim() !== value) {
    return 'Path cannot contain leading or trailing whitespace'
  }

  if (!value.startsWith('/')) {
    return 'Path must start with /'
  }

  if (value.startsWith('//') || value.includes('//')) {
    return 'Path cannot contain consecutive slashes'
  }

  if (value.includes('?') || value.includes('#')) {
    return 'Path cannot include a query string or hash'
  }

  return PAGE_PATH_PATTERN.test(value)
    ? true
    : 'Path may only contain letters, numbers, slashes, hyphens, and underscores'
}

export const validateSafeHref = (value: FieldValue) => {
  if (typeof value !== 'string') {
    return 'URL must be a string'
  }

  const href = value.trim()

  if (href !== value) {
    return 'URL cannot contain leading or trailing whitespace'
  }

  if (!href) {
    return 'URL is required'
  }

  if (CONTROL_OR_BACKSLASH.test(href)) {
    return 'URL cannot contain control characters or backslashes'
  }

  if (href.startsWith('/')) {
    return href.startsWith('//') ? 'Relative URLs cannot start with //' : true
  }

  try {
    const url = new URL(href)

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return 'URL must use http, https, or a root-relative path'
    }

    if (url.username || url.password) {
      return 'URL cannot include embedded credentials'
    }

    return true
  } catch {
    return 'URL must be absolute http(s) or a root-relative path'
  }
}

export const isSafePagePath = (value: string | null | undefined): value is string =>
  validatePagePath(value) === true

export const isSafeHref = (value: string | null | undefined): value is string =>
  validateSafeHref(value) === true
