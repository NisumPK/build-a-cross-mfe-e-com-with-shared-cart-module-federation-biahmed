import { configureStore } from '@reduxjs/toolkit'
import cartReducer, { setCartState } from '@shared/cartSlice'
import { loadCartFromStorage, saveCartToStorage } from '@shared/storage'

const persistedCart = loadCartFromStorage()

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: persistedCart ? { cart: persistedCart } : undefined,
})

store.subscribe(() => {
  saveCartToStorage(store.getState().cart)
})

// Cross-tab sync: when localStorage changes in another tab, reload cart
window.addEventListener('storage', (event) => {
  if (event.key === 'cart' && event.newValue) {
    try {
      const newCart = JSON.parse(event.newValue)
      store.dispatch(setCartState(newCart))
    } catch {
      // ignore malformed data
    }
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
