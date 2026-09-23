import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';
import Toolbar from '../../components/Toolbar';
import ProductTable from '../../components/ProductTable';
import ProductCard from '../../components/ProductCard';
import Pagination from '../../components/Pagination';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import ConfirmModal from '../../components/ConfirmModal';
import useDebounce from '../../hooks/useDebounce';
import {
  fetchProducts,
  searchProducts,
  fetchByCategory,
  fetchCategories,
  deleteProduct,
} from '../../lib/api/products';
import { applyOverlay, deleteLocalProduct } from '../../lib/localOverlay';

// Turns a raw query value into a safe positive integer, falling back
// when someone types ?page=abc or ?page=-3 by hand.
function parsePositiveInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export default function ProductsPage() {
  const router = useRouter();
  const { query, isReady } = router;

  // Everything the app needs to reproduce the current view lives in the URL.
  const page = parsePositiveInt(query.page, 1);
  const limit = [10, 20, 50].includes(Number(query.limit)) ? Number(query.limit) : 10;
  const search = typeof query.q === 'string' ? query.q : '';
  const category = typeof query.category === 'string' ? query.category : '';
  const sortBy = typeof query.sortBy === 'string' ? query.sortBy : '';
  const order = query.order === 'desc' ? 'desc' : 'asc';

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 500);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Bumped on every fetch. If a response comes back and this has moved on,
  // it means a newer request has already started, so we drop the old one.
  // This is what stops slow/old search results from overwriting new ones.
  const requestIdRef = useRef(0);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    if (!isReady) return;
    if (debouncedSearch === search) return;
    // Search and category can't be applied together on this API, so a new
    // search clears any active category filter.
    updateQuery({ q: debouncedSearch || undefined, page: 1, category: undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, isReady]);

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const updateQuery = (patch) => {
    const nextQuery = { ...router.query, ...patch };
    Object.keys(nextQuery).forEach((key) => {
      if (nextQuery[key] === undefined || nextQuery[key] === '') delete nextQuery[key];
    });
    router.push({ pathname: '/products', query: nextQuery }, undefined, { shallow: true });
  };

  const loadProducts = async () => {
    const myRequestId = ++requestIdRef.current;
    setLoading(true);
    setError('');
    try {
      const skip = (page - 1) * limit;
      let res;
      if (search) {
        res = await searchProducts({ q: search, limit, skip });
      } else if (category) {
        res = await fetchByCategory({ category, limit, skip, sortBy, order });
      } else {
        res = await fetchProducts({ limit, skip, sortBy, order });
      }

      if (myRequestId !== requestIdRef.current) return; // a newer request already won

      const totalPages = Math.max(1, Math.ceil(res.data.total / limit));
      if (page > totalPages) {
        // e.g. ?page=999 on a small result set - snap back to the last real page.
        updateQuery({ page: totalPages });
        return;
      }

      setProducts(applyOverlay(res.data.products));
      setTotal(res.data.total);
    } catch (err) {
      if (myRequestId !== requestIdRef.current) return;
      setError(err.message || 'Failed to load products.');
    } finally {
      if (myRequestId === requestIdRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    if (!isReady) return;
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, page, limit, search, category, sortBy, order]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleDelete = (product) => {
    // Always ask for confirmation first, whether the product came from the
    // API or was added locally - the assignment asks for a confirm popup
    // before every delete, no exceptions.
    setDeleteTarget(product);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    if (deleteTarget.isLocal) {
      // Never hit the API for a product we made up locally - it doesn't exist there.
      deleteLocalProduct(deleteTarget.id);
    } else {
      try {
        await deleteProduct(deleteTarget.id);
      } catch {
        // DummyJSON doesn't really delete anything server-side; we still
        // remove it from the UI below so the action feels real.
      }
      deleteLocalProduct(deleteTarget.id);
    }
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
    setDeleting(false);
  };

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Products</h1>
        <Toolbar
          search={searchInput}
          onSearchChange={setSearchInput}
          category={category}
          onCategoryChange={(c) => updateQuery({ category: c || undefined, page: 1 })}
          categories={categories}
          sortBy={sortBy}
          order={order}
          onSortChange={(sb, ord) =>
            updateQuery({ sortBy: sb || undefined, order: ord === 'asc' ? undefined : ord })
          }
        />

        {loading && <Loader />}
        {!loading && error && <ErrorState message={error} onRetry={loadProducts} />}
        {!loading && !error && products.length === 0 && <EmptyState />}
        {!loading && !error && products.length > 0 && (
          <>
            <ProductTable products={products} onDelete={handleDelete} />
            <ProductCard products={products} onDelete={handleDelete} />
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={limit}
              skip={(page - 1) * limit}
              onPageChange={(p) => updateQuery({ page: Math.min(Math.max(1, p), totalPages) })}
              onLimitChange={(l) => updateQuery({ limit: l, page: 1 })}
            />
          </>
        )}

        <ConfirmModal
          open={!!deleteTarget}
          title="Delete product"
          message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      </div>
    </ProtectedRoute>
  );
}
