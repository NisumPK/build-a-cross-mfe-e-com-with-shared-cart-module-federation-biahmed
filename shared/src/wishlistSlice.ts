import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit'
import type { Product } from './types'

export interface WishlistItem extends Product {
  // inherits all Product fields
}

export interface WishlistState {
  items: WishlistItem[]
}

const initialState: WishlistState = {
  items: [],
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<Product>) {
      const product = action.payload
      const exists = state.items.find((item) => item.id === product.id)
      if (!exists) {
        state.items.push(product)
      }
    },
    removeFromWishlist(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearWishlist(state) {
      state.items = []
    },
    setWishlistState(_state, action: PayloadAction<WishlistState>) {
      return action.payload
    },
  },
})

export const { addToWishlist, removeFromWishlist, clearWishlist, setWishlistState } =
  wishlistSlice.actions

export default wishlistSlice.reducer

interface RootStateWithWishlist {
  wishlist: WishlistState
}

export const selectWishlistItems = (state: RootStateWithWishlist) => state.wishlist.items

export const selectWishlistCount = createSelector(selectWishlistItems, (items) => items.length)

export const isProductInWishlist = (state: RootStateWithWishlist, productId: number) =>
  state.wishlist.items.some((item) => item.id === productId)
