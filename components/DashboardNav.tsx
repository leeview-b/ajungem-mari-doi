'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function DashboardNav({ profile }: { profile: any }) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">Ajungem Mari</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/events"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600"
              >
                Evenimente
              </Link>
              <Link
                href="/dashboard/reports"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600"
              >
                Rapoarte
              </Link>
              <Link
                href="/dashboard/messages"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600"
              >
                Mesaje
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              {profile?.full_name || profile?.email}
            </span>
            {profile?.role === 'admin' && (
              <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
                Admin
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              Deconectare
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
