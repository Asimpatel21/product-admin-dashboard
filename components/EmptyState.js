export default function EmptyState({ message = 'No products found.' }) {
  return (
    <div className="text-center py-16 text-gray-500">
      <p>{message}</p>
    </div>
  );
}
