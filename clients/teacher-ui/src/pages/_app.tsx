import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../components/ui/Toast';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Teacher UI initialized
    console.log('Teacher Dashboard initialized');
  }, []);

  return (
    <ToastProvider>
      <AuthProvider allowedRole="teacher">
        <Component {...pageProps} />
      </AuthProvider>
    </ToastProvider>
  );
}

export default MyApp;
