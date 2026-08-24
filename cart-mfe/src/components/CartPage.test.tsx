import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '@shared/cartSlice'
import type { CartState } from '@shared/types'
import { CART_ITEM_ADDED } from '@shared/events'
import CartPage from './CartPage'

const preloaded: CartState = {
  items: [
    { id: 1, name: 'Wireless Headphones', price: 99, quantity: 2 },
    { id: 2, name: 'Laptop Stand', price: 49, quantity: 1 },
  ],
}

function renderCart(cart: CartState = preloaded, coupon?: string | null) {
  const store = configureStore({ reducer: { cart: cartReducer }, preloadedState: { cart } })
  render(
    <Provider store={store}>
      <CartPage coupon={coupon} />
    </Provider>,
  )
  return store
}

beforeEach(() => {
  document.cookie = 'currency=; path=/; max-age=0'
})

describe('CartPage', () => {
  it('renders preloaded cart items', () => {
    renderCart()
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument()
    expect(screen.getByText('Laptop Stand')).toBeInTheDocument()
  })

  it('shows correct totals', () => {
    renderCart()
    expect(screen.getByText('Total Items: 3')).toBeInTheDocument()
    expect(screen.getByText('Total: $247.00')).toBeInTheDocument()
  })

  it('increments quantity', async () => {
    renderCart()
    const user = userEvent.setup()
    await user.click(screen.getByLabelText('Increase Wireless Headphones'))
    expect(screen.getByText('Total Items: 4')).toBeInTheDocument()
  })

  it('decrements quantity but floors at 1', async () => {
    renderCart()
    const user = userEvent.setup()
    const decBtn = screen.getByLabelText('Decrease Laptop Stand')
    await user.click(decBtn) // quantity 1 -> stays 1
    expect(screen.getByText('Total Items: 3')).toBeInTheDocument()
  })

  it('removes an item', async () => {
    renderCart()
    const user = userEvent.setup()
    const [removeBtn] = screen.getAllByRole('button', { name: 'Remove' })
    await user.click(removeBtn)
    expect(screen.queryByText('Wireless Headphones')).not.toBeInTheDocument()
    expect(screen.getByText('Total Items: 1')).toBeInTheDocument()
  })

  it('clears the cart', async () => {
    renderCart()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Clear Cart' }))
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument()
    expect(screen.getByText('Total Items: 0')).toBeInTheDocument()
  })

  it('reads the currency cookie set elsewhere', () => {
    document.cookie = 'currency=USD; path=/'
    renderCart()
    expect(screen.getByText(/Currency \(cookie set by Host\)/)).toHaveTextContent('USD')
  })

  it('displays the coupon query param for information only', () => {
    renderCart(preloaded, 'SAVE10')
    expect(screen.getByText(/Coupon applied/)).toHaveTextContent('SAVE10')
  })

  it('shows a banner on cart:item-added CustomEvent without changing Redux totals', async () => {
    const store = renderCart({ items: [] })
    act(() => {
      window.dispatchEvent(
        new CustomEvent(CART_ITEM_ADDED, {
          detail: { id: 99, name: 'External Gadget', price: 5 },
        }),
      )
    })

    expect(await screen.findByText(/External Gadget/)).toBeInTheDocument()
    expect(store.getState().cart.items).toHaveLength(0)
  })
})
