import { Routes, Route, useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import ProductList from './components/ProductList'
import ProductDetails from './components/ProductDetails'

function ListRoute() {
  const navigate = useNavigate()
  return <ProductList onSelectProduct={(id) => navigate(`/product/${id}?ref=list`)} />
}

function DetailsRoute() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  return <ProductDetails id={id ?? ''} refParam={searchParams.get('ref')} />
}

export default function StandaloneApp() {
  return (
    <div style={{ padding: '1rem' }}>
      <p style={{ background: '#fffae6', padding: '0.5rem' }}>
        Standalone mode — this app normally runs embedded inside the Host via Module
        Federation. This local store/router only exists so it also works when opened
        directly. <Link to="/">Back to list</Link>
      </p>
      <Routes>
        <Route path="/" element={<ListRoute />} />
        <Route path="/product/:id" element={<DetailsRoute />} />
      </Routes>
    </div>
  )
}
