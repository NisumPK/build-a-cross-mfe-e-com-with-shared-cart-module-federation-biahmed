import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import wishlistReducer from '@shared/wishlistSlice'
import cartReducer from '@shared/cartSlice'
import StandaloneApp from './StandaloneApp'

// Standalone mode: local store for when this app runs on its own
const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    cart: cartReducer,
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <StandaloneApp />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
