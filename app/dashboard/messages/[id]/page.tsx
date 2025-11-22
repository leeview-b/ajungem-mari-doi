import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import MarkAsReadButton from '@/components/MarkAsReadButton';

export default async function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: message } = await supabase
    .from('messages')
    .select('*, sender:profiles!messages_sender_id_fkey(full_name, email)')
    .eq('id', id as any)
    .single();

  const typedMessage = message as any;

  if (!typedMessage) {
    notFound();
  }

  // Check if user has access to this message
  const hasAccess =
    typedMessage.is_broadcast ||
    typedMessage.recipient_id === session?.user.id ||
    typedMessage.sender_id === session?.user.id;

  if (!hasAccess) {
    redirect('/dashboard/messages');
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link
          href="/dashboard/messages"
          className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
        >
          ← Înapoi la Mesaje
        </Link>
        {!typedMessage.read_at && typedMessage.recipient_id === session?.user.id && (
          <MarkAsReadButton messageId={typedMessage.id} />
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{typedMessage.subject}</h1>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  De la:{' '}
                  <span className="font-medium">
                    {typedMessage.sender?.full_name || typedMessage.sender?.email || 'Anonim'}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(typedMessage.created_at).toLocaleDateString('ro-RO', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            {typedMessage.is_broadcast && (
              <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                Mesaj Broadcast
              </span>
            )}
          </div>
        </div>

        <div className="px-8 py-6">
          <div className="prose max-w-none">
            <p className="text-gray-900 whitespace-pre-wrap">{typedMessage.content}</p>
          </div>
        </div>

        {typedMessage.read_at && (
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Citit la:{' '}
              {new Date(typedMessage.read_at).toLocaleDateString('ro-RO', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
