import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { setCookie } from '@shared/cookies'
import { store } from './store'
import App from './App'

// Set a cookie at startup so Cart MFE can read it later.
// Shows the Host setting a value that an independent remote reads.
if (!document.cookie.includes('currency=')) {
  setCookie('currency', 'USD')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
