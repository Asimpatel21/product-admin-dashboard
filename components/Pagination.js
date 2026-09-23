export default function Pagination({ page, totalPages, total, limit, skip, onPageChange, onLimitChange }) {
  const from = total === 0 ? 0 : skip + 1;
  const to = Math.min(skip + limit, total);

  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
      <p className="text-sm text-gray-600">
        Showing {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 border rounded disabled:opacity-40"
        >
          Previous
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 border rounded ${p === page ? 'bg-blue-600 text-white' : ''}`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
      <select
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        className="border rounded px-2 py-1.5 text-sm"
      >
        {[10, 20, 50].map((n) => (
          <option key={n} value={n}>
            {n} / page
          </option>
        ))}
      </select>
    </div>
  );
}
