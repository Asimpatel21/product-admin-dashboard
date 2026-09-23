import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;

  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-4 bg-white shadow">
      <Link href="/products" className="font-bold text-lg text-blue-600">
        Product Admin
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 hidden sm:inline">{user?.username}</span>
        <button onClick={logout} className="text-sm px-3 py-1.5 rounded border hover:bg-gray-50">
          Logout
        </button>
      </div>
    </nav>
  );
}
