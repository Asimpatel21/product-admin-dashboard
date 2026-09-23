import Link from 'next/link';

// Simple gray "no image" SVG, used whenever a product has no thumbnail
// or the given thumbnail URL fails to load.
const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='%23e5e7eb'/><text x='50%' y='50%' font-size='11' fill='%239ca3af' text-anchor='middle' dy='.3em'>No image</text></svg>";

// Desktop view - shown as a table (hidden below the sm breakpoint).
export default function ProductTable({ products, onDelete }) {
  return (
    <table className="hidden sm:table w-full border-collapse">
      <thead>
        <tr className="text-left border-b text-sm text-gray-500">
          <th className="py-2">Image</th>
          <th>Title</th>
          <th>Category</th>
          <th>Price</th>
          <th>Rating</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="border-b hover:bg-gray-50">
            <td className="py-2">
              <img
                src={p.thumbnail || PLACEHOLDER_IMG}
                alt={p.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PLACEHOLDER_IMG;
                }}
                className="h-12 w-12 object-cover rounded bg-gray-100"
              />
            </td>
            <td>
              <Link href={`/products/${p.id}`} className="text-blue-600 hover:underline">
                {p.title}
              </Link>
              {p.isLocal && <span className="ml-2 text-xs text-green-600">(new)</span>}
            </td>
            <td className="capitalize">{p.category}</td>
            <td>${p.price}</td>
            <td>{p.rating}</td>
            <td>{p.stock}</td>
            <td className="space-x-3">
              <Link href={`/products/${p.id}/edit`} className="text-sm text-blue-600 hover:underline">
                Edit
              </Link>
              <button onClick={() => onDelete(p)} className="text-sm text-red-600 hover:underline">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
