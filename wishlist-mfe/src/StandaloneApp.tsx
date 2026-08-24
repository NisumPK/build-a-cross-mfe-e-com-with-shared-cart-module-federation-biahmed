import { Link } from 'react-router-dom'
import WishlistPage from './components/WishlistPage'

export default function StandaloneApp() {
  return (
    <div style={{ padding: '1rem' }}>
      <p style={{ background: '#fffae6', padding: '0.5rem' }}>
        Standalone mode — this app normally runs embedded inside the Host via Module Federation.
        This local store only exists so it also works when opened directly. <Link to="/">Refresh</Link>
      </p>
      <WishlistPage />
    </div>
  )
}
