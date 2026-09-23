import { useState } from 'react';

const emptyForm = {
  title: '',
  category: '',
  price: '',
  stock: '',
  rating: '',
  description: '',
  thumbnail: '',
};

// Used for both "add" and "edit" - pass initialData to prefill for edit.
export default function ProductForm({ initialData, onSubmit, submitting }) {
  const [form, setForm] = useState({ ...emptyForm, ...initialData });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title || form.title.trim().length < 3) e.title = 'Title must be at least 3 characters.';
    if (!form.category) e.category = 'Category is required.';
    if (form.price === '' || Number(form.price) <= 0) e.price = 'Price must be greater than 0.';
    if (form.stock === '' || Number(form.stock) < 0) e.stock = 'Stock cannot be negative.';
    if (form.rating !== '' && (Number(form.rating) < 0 || Number(form.rating) > 5)) {
      e.rating = 'Rating must be between 0 and 5.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return; // guards against double-click sending two requests
    if (!validate()) return;
    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      rating: form.rating === '' ? 0 : Number(form.rating),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input value={form.title} onChange={handleChange('title')} className="border rounded w-full px-3 py-2" />
        {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <input
          value={form.category}
          onChange={handleChange('category')}
          className="border rounded w-full px-3 py-2"
        />
        {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            value={form.price}
            onChange={handleChange('price')}
            className="border rounded w-full px-3 py-2"
          />
          {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            type="number"
            value={form.stock}
            onChange={handleChange('stock')}
            className="border rounded w-full px-3 py-2"
          />
          {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Rating (0-5)</label>
        <input
          type="number"
          step="0.1"
          value={form.rating}
          onChange={handleChange('rating')}
          className="border rounded w-full px-3 py-2"
        />
        {errors.rating && <p className="text-red-600 text-sm mt-1">{errors.rating}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
        <input
          value={form.thumbnail}
          onChange={handleChange('thumbnail')}
          placeholder="https://cdn.dummyjson.com/products/images/..."
          className="border rounded w-full px-3 py-2"
        />
        <p className="text-xs text-gray-400 mt-1">
          Leave blank to use a placeholder image, or paste a direct image URL.
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={handleChange('description')}
          rows={4}
          className="border rounded w-full px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
