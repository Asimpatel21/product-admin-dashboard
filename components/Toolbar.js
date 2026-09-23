import Link from 'next/link';

export default function Toolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  sortBy,
  order,
  onSortChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-64"
        />
        {/* DummyJSON can't search and filter by category at the same time,
            so we disable the category dropdown while a search is active. */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          disabled={!!search}
          title={search ? 'Category filter is disabled while searching' : ''}
          className="border rounded px-3 py-2 disabled:bg-gray-100"
        >
          <option value="">All categories</option>
          {categories.map((c) => {
            const value = typeof c === 'string' ? c : c.slug;
            const label = typeof c === 'string' ? c : c.name;
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </select>
        <select
          value={`${sortBy || '-'}-${order}`}
          onChange={(e) => {
            const [sb, ord] = e.target.value.split('-');
            onSortChange(sb === '-' ? '' : sb, ord);
          }}
          className="border rounded px-3 py-2"
        >
          <option value="--asc">Sort: default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-asc">Rating: Low to High</option>
          <option value="rating-desc">Rating: High to Low</option>
          <option value="title-asc">Title: A to Z</option>
          <option value="title-desc">Title: Z to A</option>
        </select>
      </div>
      <Link
        href="/products/new"
        className="px-4 py-2 bg-blue-600 text-white rounded text-center hover:bg-blue-700"
      >
        + Add Product
      </Link>
    </div>
  );
}
