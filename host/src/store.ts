import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '@shared/cartSlice'
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

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
