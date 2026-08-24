import type { Product } from '@shared/types'

interface Props {
  product: Product
  onAddToCart: (product: Product) => void
  onSelectProduct: (id: number) => void
}

export default function ProductCard({ product, onAddToCart, onSelectProduct }: Props) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 8 }}>
      <img src={product.image} alt={product.name} width={120} height={120} />
      <h3>
        <a
          href={`/product/${product.id}?ref=list`}
          onClick={(event) => {
            event.preventDefault()
            onSelectProduct(product.id)
          }}
        >
          {product.name}
        </a>
      </h3>
      <p>${product.price}</p>
      <p>{product.description}</p>
      <button onClick={() => onAddToCart(product)}>Add to Cart</button>
    </div>
  )
}
