'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('token');
    sessionStorage.clear();

    router.push('/'); 
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-lg font-semibold">Logging you out...</h1>
    </div>
  );
}
