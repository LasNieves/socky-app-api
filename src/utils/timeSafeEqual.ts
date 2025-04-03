import * as crypto from 'crypto'

export const timingSafeEqual = (
  a: string | number,
  b: string | number
): boolean => {
  const first = Buffer.from(String(a))
  const second = Buffer.from(String(b))

  return first.length === second.length && crypto.timingSafeEqual(first, second)
}
