'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // 👇 Clear auth data (adjust as needed for your auth system)
    localStorage.removeItem('token');
    sessionStorage.clear();

    // 👉 Optional: if using cookies or server-side logout
    // await fetch('/api/logout', { method: 'POST' });

    // ✅ Redirect to login or home page
    router.push('/'); // or '/' if you prefer
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-lg font-semibold">Logging you out...</h1>
    </div>
  );
}
