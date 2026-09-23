export default function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center py-16">
      <p className="text-red-600 mb-4">{message || 'Something went wrong.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Retry
        </button>
      )}
    </div>
  );
}
