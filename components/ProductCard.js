import Link from 'next/link';

const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='%23e5e7eb'/><text x='50%' y='50%' font-size='11' fill='%239ca3af' text-anchor='middle' dy='.3em'>No image</text></svg>";

// Mobile view - shown as stacked cards (hidden at sm and above).
export default function ProductCard({ products, onDelete }) {
  return (
    <div className="sm:hidden space-y-3">
      {products.map((p) => (
        <div key={p.id} className="border rounded-lg p-3 flex gap-3 bg-white">
          <img
            src={p.thumbnail || PLACEHOLDER_IMG}
            alt={p.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER_IMG;
            }}
            className="h-16 w-16 object-cover rounded flex-shrink-0 bg-gray-100"
          />
          <div className="flex-1 min-w-0">
            <Link href={`/products/${p.id}`} className="font-medium text-blue-600 hover:underline">
              {p.title}
            </Link>
            {p.isLocal && <span className="ml-2 text-xs text-green-600">(new)</span>}
            <p className="text-sm text-gray-500 capitalize">{p.category}</p>
            <p className="text-sm">
              ${p.price} · ⭐{p.rating} · Stock: {p.stock}
            </p>
            <div className="flex gap-3 mt-2">
              <Link href={`/products/${p.id}/edit`} className="text-sm text-blue-600">
                Edit
              </Link>
              <button onClick={() => onDelete(p)} className="text-sm text-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
