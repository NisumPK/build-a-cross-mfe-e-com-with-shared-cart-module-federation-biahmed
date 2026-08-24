import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import cartReducer, { selectTotalItems } from '@shared/cartSlice'
import { CART_ITEM_ADDED } from '@shared/events'
import products from '../data/products.json'
import ProductList from './ProductList'

function renderWithStore() {
  const store = configureStore({ reducer: { cart: cartReducer } })
  render(
    <Provider store={store}>
      <ProductList />
    </Provider>,
  )
  return store
}

beforeEach(() => {
  localStorage.clear()
})

describe('ProductList', () => {
  it('renders at least 8 products', () => {
    renderWithStore()
    expect(products.length).toBeGreaterThanOrEqual(8)
    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument()
    })
  })

  it('dispatches addToCart when Add to Cart is clicked', async () => {
    const store = renderWithStore()
    const user = userEvent.setup()
    const [firstButton] = screen.getAllByRole('button', { name: 'Add to Cart' })

    await user.click(firstButton)

    expect(selectTotalItems(store.getState())).toBe(1)
  })

  it('dispatches a cart:item-added CustomEvent when Add to Cart is clicked', async () => {
    renderWithStore()
    const user = userEvent.setup()
    const listener = vi.fn()
    window.addEventListener(CART_ITEM_ADDED, listener)

    const [firstButton] = screen.getAllByRole('button', { name: 'Add to Cart' })
    await user.click(firstButton)

    expect(listener).toHaveBeenCalledTimes(1)
    window.removeEventListener(CART_ITEM_ADDED, listener)
  })
})
