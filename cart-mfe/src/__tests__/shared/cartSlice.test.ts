import { describe, it, expect } from 'vitest'
import cartReducer, {
  addToCart,
  removeFromCart,
  incrementQty,
  decrementQty,
  clearCart,
  setCartState,
  selectCartItems,
  selectTotalItems,
  selectTotalPrice,
} from '@shared/cartSlice'
import type { CartState, Product } from '@shared/types'

const product: Product = {
  id: 1,
  name: 'Widget',
  price: 10,
  image: 'img.png',
  description: 'A widget',
}

describe('cartSlice', () => {
  it('adds a new product with quantity 1', () => {
    const state = cartReducer(undefined, addToCart(product))
    expect(state.items).toEqual([
      { id: 1, name: 'Widget', price: 10, image: 'img.png', quantity: 1 },
    ])
  })

  it('increments quantity when adding an existing product', () => {
    let state = cartReducer(undefined, addToCart(product))
    state = cartReducer(state, addToCart(product))
    expect(state.items[0].quantity).toBe(2)
  })

  it('removes a product by id', () => {
    let state = cartReducer(undefined, addToCart(product))
    state = cartReducer(state, removeFromCart(product.id))
    expect(state.items).toHaveLength(0)
  })

  it('increments and decrements quantity, flooring at 1', () => {
    let state = cartReducer(undefined, addToCart(product))
    state = cartReducer(state, incrementQty(product.id))
    expect(state.items[0].quantity).toBe(2)
    state = cartReducer(state, decrementQty(product.id))
    expect(state.items[0].quantity).toBe(1)
    state = cartReducer(state, decrementQty(product.id))
    expect(state.items[0].quantity).toBe(1)
  })

  it('clears the cart', () => {
    let state = cartReducer(undefined, addToCart(product))
    state = cartReducer(state, clearCart())
    expect(state.items).toHaveLength(0)
  })

  it('computes selectors without storing totals', () => {
    const cart: CartState = {
      items: [
        { id: 1, name: 'A', price: 10, quantity: 2 },
        { id: 2, name: 'B', price: 5, quantity: 3 },
      ],
    }
    const rootState = { cart }
    expect(selectCartItems(rootState)).toBe(cart.items)
    expect(selectTotalItems(rootState)).toBe(5)
    expect(selectTotalPrice(rootState)).toBe(35)
  })

  it('replaces entire cart state (cross-tab sync)', () => {
    let state = cartReducer(undefined, addToCart(product))
    expect(state.items).toHaveLength(1)

    const newCart: CartState = {
      items: [
        { id: 2, name: 'Different', price: 20, quantity: 3 },
        { id: 3, name: 'Another', price: 15, quantity: 1 },
      ],
    }
    state = cartReducer(state, setCartState(newCart))
    expect(state.items).toHaveLength(2)
    expect(state.items[0].id).toBe(2)
  })
})
