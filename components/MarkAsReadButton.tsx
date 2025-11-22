'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

export default function MarkAsReadButton({ messageId }: { messageId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleMarkAsRead = async () => {
    setLoading(true);
    try {
      const updateData: any = { read_at: new Date().toISOString() };
      await (supabase.from('messages') as any)
        .update(updateData)
        .eq('id', messageId);

      router.refresh();
    } catch (error) {
      console.error('Error marking message as read:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMarkAsRead}
      disabled={loading}
      className="text-sm text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
    >
      {loading ? 'Se marchează...' : 'Marchează ca citit'}
    </button>
  );
}
