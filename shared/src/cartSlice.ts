import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit'
import type { CartState, Product } from './types'

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const product = action.payload
      const existing = state.items.find((item) => item.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        })
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    incrementQty(state, action: PayloadAction<number>) {
      const item = state.items.find((item) => item.id === action.payload)
      if (item) item.quantity += 1
    },
    decrementQty(state, action: PayloadAction<number>) {
      const item = state.items.find((item) => item.id === action.payload)
      if (item) item.quantity = Math.max(1, item.quantity - 1)
    },
    clearCart(state) {
      state.items = []
    },
    setCartState(_state, action: PayloadAction<CartState>) {
      return action.payload
    },
  },
})

export const { addToCart, removeFromCart, incrementQty, decrementQty, clearCart, setCartState } =
  cartSlice.actions

export default cartSlice.reducer

interface RootStateWithCart {
  cart: CartState
}

export const selectCartItems = (state: RootStateWithCart) => state.cart.items

export const selectTotalItems = createSelector(selectCartItems, (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
)

export const selectTotalPrice = createSelector(selectCartItems, (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0),
)
