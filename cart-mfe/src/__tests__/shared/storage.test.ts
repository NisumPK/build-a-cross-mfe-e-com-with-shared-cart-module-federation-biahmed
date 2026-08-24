import { describe, it, expect, beforeEach } from 'vitest'
import { saveCartToStorage, loadCartFromStorage, clearCartStorage } from '@shared/storage'
import type { CartState } from '@shared/types'

beforeEach(() => {
  localStorage.clear()
})

describe('storage', () => {
  it('saves and loads cart data', () => {
    const cart: CartState = { items: [{ id: 1, name: 'Widget', price: 10, quantity: 2 }] }
    saveCartToStorage(cart)
    expect(loadCartFromStorage()).toEqual(cart)
  })

  it('returns undefined for an empty/missing cart', () => {
    expect(loadCartFromStorage()).toBeUndefined()
  })

  it('updates stored cart data on subsequent saves', () => {
    saveCartToStorage({ items: [{ id: 1, name: 'Widget', price: 10, quantity: 1 }] })
    saveCartToStorage({ items: [{ id: 1, name: 'Widget', price: 10, quantity: 5 }] })
    expect(loadCartFromStorage()?.items[0].quantity).toBe(5)
  })

  it('removes cart data', () => {
    saveCartToStorage({ items: [{ id: 1, name: 'Widget', price: 10, quantity: 1 }] })
    clearCartStorage()
    expect(loadCartFromStorage()).toBeUndefined()
  })

  it('handles malformed stored JSON gracefully', () => {
    localStorage.setItem('cart', 'not-json')
    expect(loadCartFromStorage()).toBeUndefined()
  })
})
