import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../../components/ProtectedRoute';
import ProductForm from '../../../components/ProductForm';
import Loader from '../../../components/Loader';
import { fetchProductById, editProduct } from '../../../lib/api/products';
import { editLocalProduct, getOverlay } from '../../../lib/localOverlay';

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!id) return;
    const overlay = getOverlay();
    const localMatch = overlay.added.find((p) => String(p.id) === String(id));
    if (localMatch) {
      setInitialData(localMatch);
      setLoading(false);
      return;
    }
    fetchProductById(id)
      .then((res) => setInitialData({ ...res.data, ...(overlay.edited[id] || {}) }))
      .catch(() => setInitialData(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await editProduct(id, data);
    } catch {
      // DummyJSON doesn't persist edits either - we still save it locally below.
    }
    editLocalProduct(id, data);
    setSubmitting(false);
    submittingRef.current = false;
    router.push(`/products/${id}`);
  };

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>
        {loading && <Loader />}
        {!loading && initialData && (
          <ProductForm initialData={initialData} onSubmit={handleSubmit} submitting={submitting} />
        )}
        {!loading && !initialData && <p className="text-red-600">Product not found.</p>}
      </div>
    </ProtectedRoute>
  );
}
