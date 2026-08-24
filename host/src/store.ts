import { configureStore } from '@reduxjs/toolkit'
import cartReducer, { setCartState } from '@shared/cartSlice'
import wishlistReducer, { setWishlistState } from '@shared/wishlistSlice'
import authReducer from '@shared/authSlice'
import { loadCartFromStorage, saveCartToStorage } from '@shared/storage'

const persistedCart = loadCartFromStorage()

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
  },
  preloadedState: persistedCart ? { cart: persistedCart } : undefined,
})

store.subscribe(() => {
  saveCartToStorage(store.getState().cart)
})

// Cross-tab sync: when localStorage changes in another tab, reload cart and wishlist
window.addEventListener('storage', (event) => {
  if (event.key === 'cart' && event.newValue) {
    try {
      const newCart = JSON.parse(event.newValue)
      store.dispatch(setCartState(newCart))
    } catch {
      // ignore malformed data
    }
  }
  if (event.key === 'wishlist' && event.newValue) {
    try {
      const newWishlist = JSON.parse(event.newValue)
      store.dispatch(setWishlistState(newWishlist))
    } catch {
      // ignore malformed data
    }
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
