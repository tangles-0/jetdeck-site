import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

let cachedPayload: Promise<Payload> | null = null

export const getPayloadClient = () => {
  cachedPayload ??= getPayload({ config })
  return cachedPayload
}
