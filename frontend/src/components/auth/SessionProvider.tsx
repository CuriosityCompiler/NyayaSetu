'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, checkAuth } = useAuth();
  const requiresAccount = pathname === '/profile' || pathname.startsWith('/admin');

  useEffect(() => {
    try {
      window.sessionStorage.removeItem('nyayasetu:chunk-load-recovery');
    } catch {
      // Storage may be unavailable in restricted browsing contexts.
    }
    void checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleUnauthorized = () => {
      void checkAuth();
    };

    window.addEventListener('nyaya:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('nyaya:unauthorized', handleUnauthorized);
  }, [checkAuth]);

  useEffect(() => {
    if (isLoading) return;

    if (!user && requiresAccount) {
      router.replace('/');
    }
  }, [isLoading, requiresAccount, router, user]);

  if (requiresAccount && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-text-sub">
        Checking your session...
      </div>
    );
  }

  if (requiresAccount && !user) return null;

  return children;
}
