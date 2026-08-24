import { describe, it, expect, beforeEach } from 'vitest'
import { getCookie, setCookie } from '@shared/cookies'

beforeEach(() => {
  document.cookie.split('; ').forEach((c) => {
    const name = c.split('=')[0]
    if (name) document.cookie = `${name}=; path=/; max-age=0`
  })
})

describe('cookies', () => {
  it('sets and reads back a cookie', () => {
    setCookie('currency', 'USD')
    expect(getCookie('currency')).toBe('USD')
  })

  it('returns undefined for a missing cookie', () => {
    expect(getCookie('doesNotExist')).toBeUndefined()
  })

  it('URL-encodes and decodes values', () => {
    setCookie('note', 'hello world')
    expect(getCookie('note')).toBe('hello world')
  })
})
