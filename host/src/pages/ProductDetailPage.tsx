import { lazy } from 'react'
import { useParams } from 'react-router-dom'

const ProductDetails = lazy(() => import('catalog_mfe/ProductDetails'))

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  return <ProductDetails id={id ?? ''} />
}
