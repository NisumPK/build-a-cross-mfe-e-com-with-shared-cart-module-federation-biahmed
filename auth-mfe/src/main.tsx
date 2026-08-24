import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@shared/authSlice'
import StandaloneApp from './StandaloneApp'

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <StandaloneApp />
    </Provider>
  </StrictMode>
)
