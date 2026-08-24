import type { CartItem } from '@shared/types'

interface Props {
  item: CartItem
  onIncrement: (id: number) => void
  onDecrement: (id: number) => void
  onRemove: (id: number) => void
}

export default function CartItemRow({ item, onIncrement, onDecrement, onRemove }: Props) {
  return (
    <tr>
      <td>{item.name}</td>
      <td>${item.price}</td>
      <td>
        <button onClick={() => onDecrement(item.id)} aria-label={`Decrease ${item.name}`}>
          −
        </button>{' '}
        {item.quantity}{' '}
        <button onClick={() => onIncrement(item.id)} aria-label={`Increase ${item.name}`}>
          +
        </button>
      </td>
      <td>${(item.price * item.quantity).toFixed(2)}</td>
      <td>
        <button onClick={() => onRemove(item.id)}>Remove</button>
      </td>
    </tr>
  )
}
