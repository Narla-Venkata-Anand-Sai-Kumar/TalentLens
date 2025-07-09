import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { ToastProvider } from '../components/ui/Toast';
import '../styles/globals.css';

// Component to manage theme classes on body
function ThemeBodyManager() {
  const { isDark } = useTheme();

  useEffect(() => {
    const body = document.body;
    if (isDark) {
      body.classList.add('dark');
      body.classList.remove('light');
      body.style.backgroundColor = '#1f2937'; // gray-800
    } else {
      body.classList.add('light');
      body.classList.remove('dark');
      body.style.backgroundColor = '#ffffff'; // white
    }
  }, [isDark]);

  return null;
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Teacher UI initialized
    console.log('Teacher Dashboard initialized');
  }, []);

  return (
    <ToastProvider>
      <AuthProvider allowedRole="teacher">
        <ThemeProvider>
          <ThemeBodyManager />
          <Component {...pageProps} />
        </ThemeProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default MyApp;
