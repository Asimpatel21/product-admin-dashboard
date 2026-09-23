import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import Loader from '../../components/Loader';
import ErrorState from '../../components/ErrorState';
import { fetchProductById } from '../../lib/api/products';
import { getOverlay } from '../../lib/localOverlay';

const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='%23e5e7eb'/><text x='50%' y='50%' font-size='11' fill='%239ca3af' text-anchor='middle' dy='.3em'>No image</text></svg>";

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    setError('');

    const overlay = getOverlay();
    const localMatch = overlay.added.find((p) => String(p.id) === String(id));
    if (localMatch) {
      setProduct(localMatch);
      setLoading(false);
      return;
    }
    if (overlay.deleted.includes(Number(id))) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    try {
      const res = await fetchProductById(id);
      setProduct({ ...res.data, ...(overlay.edited[id] || {}) });
    } catch (err) {
      if (err.response?.status === 404) setNotFound(true);
      else setError(err.message || 'Failed to load product.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link href="/products" className="text-blue-600 text-sm">
          ← Back to products
        </Link>

        {loading && <Loader />}

        {!loading && notFound && (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold mb-2">Product not found</h2>
            <p className="text-gray-500">We couldn&apos;t find a product with id &quot;{id}&quot;.</p>
          </div>
        )}

        {!loading && error && <ErrorState message={error} onRetry={load} />}

        {!loading && product && (
          <>
            <div className="grid sm:grid-cols-2 gap-6 mt-4">
              <div className="grid grid-cols-3 gap-2">
                {(product.images && product.images.length > 0 ? product.images : [product.thumbnail]).map(
                  (img, i) => (
                    <img
                      key={i}
                      src={img || PLACEHOLDER_IMG}
                      alt={product.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = PLACEHOLDER_IMG;
                      }}
                      className="w-full h-24 object-cover rounded bg-gray-100"
                    />
                  )
                )}
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{product.title}</h1>
                <p className="text-gray-500 capitalize mb-2">{product.category}</p>
                <p className="text-xl font-bold mb-2">${product.price}</p>
                <p className="mb-4 text-gray-700">{product.description}</p>
                <Link
                  href={`/products/${product.id}/edit`}
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Edit
                </Link>
              </div>
            </div>

            {product.reviews && product.reviews.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-3">Reviews</h2>
                <div className="space-y-3">
                  {product.reviews.map((r, i) => (
                    <div key={i} className="border rounded p-3 bg-white">
                      <p className="font-medium">
                        {r.reviewerName} · ⭐{r.rating}
                      </p>
                      <p className="text-sm text-gray-600">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
