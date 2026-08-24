import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '@shared/cartSlice'
import products from '../data/products.json'
import ProductDetails from './ProductDetails'

function renderDetails(id: string) {
  const store = configureStore({ reducer: { cart: cartReducer } })
  render(
    <Provider store={store}>
      <ProductDetails id={id} />
    </Provider>,
  )
}

beforeEach(() => {
  sessionStorage.clear()
})

describe('ProductDetails', () => {
  it('renders the correct product for the given :id', () => {
    const target = products[2]
    renderDetails(String(target.id))

    expect(screen.getByText(target.name)).toBeInTheDocument()
    expect(screen.getByText(target.description)).toBeInTheDocument()
  })

  it('shows a not-found message for an unknown id', () => {
    renderDetails('does-not-exist')
    expect(screen.getByText('Product not found.')).toBeInTheDocument()
  })

  it('sets sessionStorage recentProduct on mount', () => {
    const target = products[0]
    renderDetails(String(target.id))

    const stored = JSON.parse(sessionStorage.getItem('recentProduct') ?? 'null')
    expect(stored?.id).toBe(target.id)
  })
})
