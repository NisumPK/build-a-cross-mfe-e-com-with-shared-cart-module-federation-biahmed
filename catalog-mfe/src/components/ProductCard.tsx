import type { Product } from '@shared/types'

interface Props {
  product: Product
  onAddToCart: (product: Product) => void
  onSelectProduct: (id: number) => void
  isInWishlist?: boolean
  onToggleWishlist?: (product: Product) => void
}

export default function ProductCard({
  product,
  onAddToCart,
  onSelectProduct,
  isInWishlist = false,
  onToggleWishlist,
}: Props) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 8, position: 'relative' }}>
      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
        <button
          onClick={() => onToggleWishlist?.(product)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5em',
          }}
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isInWishlist ? '❤️' : '🤍'}
        </button>
      </div>
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
