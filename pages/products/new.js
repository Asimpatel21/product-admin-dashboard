import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';
import ProductForm from '../../components/ProductForm';
import { addProduct } from '../../lib/api/products';
import { addLocalProduct } from '../../lib/localOverlay';

export default function NewProduct() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const handleSubmit = async (data) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const res = await addProduct(data);
      // DummyJSON returns a fake new product but doesn't persist it, so we
      // also save it in our local overlay to keep it visible after a refresh.
      addLocalProduct({ ...data, thumbnail: data.thumbnail || res.data.thumbnail || '' });
    } catch {
      addLocalProduct(data);
    } finally {
      setSubmitting(false);
      submittingRef.current = false;
      router.push('/products');
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Add Product</h1>
        <ProductForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </ProtectedRoute>
  );
}
