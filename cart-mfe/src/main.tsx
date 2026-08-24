import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '@shared/cartSlice'
import { loadCartFromStorage } from '@shared/storage'
import StandaloneApp from './StandaloneApp'

// Standalone mode: this app normally runs inside the Host, but we create a
// local store here so it also works when opened directly on port 5002.
const store = configureStore({
  reducer: { cart: cartReducer },
  preloadedState: (() => {
    const cart = loadCartFromStorage()
    return cart ? { cart } : undefined
  })(),
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
