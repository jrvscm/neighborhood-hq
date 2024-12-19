'use client';

import { useAuth } from '@/hooks/use-auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const user = await useAuth();

  if (user?.role !== 'admin') {
    return redirect('/dashboard/overview');
  } else {
    return redirect('/dashboard/tenant');
  }
}
