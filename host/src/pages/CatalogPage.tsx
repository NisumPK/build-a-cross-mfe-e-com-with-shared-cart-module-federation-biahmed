import { lazy } from 'react'
import { useNavigate } from 'react-router-dom'

const ProductList = lazy(() => import('catalog_mfe/ProductList'))

export default function CatalogPage() {
  const navigate = useNavigate()
  return <ProductList onSelectProduct={(id) => navigate(`/product/${id}?ref=list`)} />
}
