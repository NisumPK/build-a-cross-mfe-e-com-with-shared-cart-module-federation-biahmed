import { describe, it, expect, vi } from 'vitest'
import { CART_ITEM_ADDED, dispatchCartItemAdded, listenCartItemAdded } from '@shared/events'
import type { Product } from '@shared/types'

const product: Product = {
  id: 1,
  name: 'Widget',
  price: 10,
  image: 'img.png',
  description: 'A widget',
}

describe('events', () => {
  it('dispatches a CustomEvent with the product as detail', () => {
    const listener = vi.fn()
    window.addEventListener(CART_ITEM_ADDED, listener)

    dispatchCartItemAdded(product)

    expect(listener).toHaveBeenCalledTimes(1)
    const event = listener.mock.calls[0][0] as CustomEvent<Product>
    expect(event.detail).toEqual(product)
    window.removeEventListener(CART_ITEM_ADDED, listener)
  })

  it('listenCartItemAdded invokes the handler with the product', () => {
    const handler = vi.fn()
    const stop = listenCartItemAdded(handler)

    dispatchCartItemAdded(product)
    expect(handler).toHaveBeenCalledWith(product)

    stop()
    dispatchCartItemAdded(product)
    expect(handler).toHaveBeenCalledTimes(1)
  })
})
