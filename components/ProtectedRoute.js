import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

// Wrap any page that should require login with this component.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace('/login');
    }
  }, [ready, isAuthenticated, router]);

  if (!ready || !isAuthenticated) {
    return <Loader />;
  }

  return children;
}
