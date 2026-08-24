import type { CartState } from './types'

const CART_STORAGE_KEY = 'cart'

export function saveCartToStorage(cart: CartState): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded, etc.)
  }
}

export function loadCartFromStorage(): CartState | undefined {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return undefined
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.items)) return undefined
    return parsed as CartState
  } catch {
    return undefined
  }
}

export function clearCartStorage(): void {
  try {
    localStorage.removeItem(CART_STORAGE_KEY)
  } catch {
    // ignore
  }
}
