import type { Product } from './types'

export const CART_ITEM_ADDED = 'cart:item-added'

export function dispatchCartItemAdded(product: Product): void {
  window.dispatchEvent(new CustomEvent<Product>(CART_ITEM_ADDED, { detail: product }))
}

export function listenCartItemAdded(handler: (product: Product) => void): () => void {
  const listener = (event: Event) => {
    const customEvent = event as CustomEvent<Product>
    handler(customEvent.detail)
  }
  window.addEventListener(CART_ITEM_ADDED, listener)
  return () => window.removeEventListener(CART_ITEM_ADDED, listener)
}
