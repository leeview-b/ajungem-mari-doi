import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: messages } = await supabase
    .from('messages')
    .select('*, sender:profiles!messages_sender_id_fkey(full_name, email)')
    .or(`recipient_id.eq.${session?.user.id},is_broadcast.eq.true`)
    .order('created_at', { ascending: false });

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', (session?.user.id || '') as any)
    .single();

  const isAdmin = (profile as any)?.role === 'admin';
  const typedMessages = (messages || []) as any[];
  const unreadMessages = typedMessages.filter((m) => !m.read_at);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mesaje</h1>
          {unreadMessages && unreadMessages.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              Ai {unreadMessages.length} mesaje necitite
            </p>
          )}
        </div>
        {isAdmin && (
          <Link
            href="/dashboard/messages/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Mesaj Nou
          </Link>
        )}
      </div>

      <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
        {typedMessages && typedMessages.length > 0 ? (
          typedMessages.map((message: any) => (
            <Link
              key={message.id}
              href={`/dashboard/messages/${message.id}`}
              className={`block px-6 py-4 hover:bg-gray-50 transition-colors ${
                !message.read_at ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`font-medium ${
                        !message.read_at ? 'text-gray-900 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      {message.subject}
                    </h3>
                    {message.is_broadcast && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        Broadcast
                      </span>
                    )}
                    {!message.read_at && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    De la: {message.sender?.full_name || message.sender?.email || 'Anonim'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{message.content}</p>
                </div>
                <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">
                  {new Date(message.created_at).toLocaleDateString('ro-RO', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="px-6 py-8 text-center text-gray-500">Nu ai niciun mesaj</p>
        )}
      </div>
    </div>
  );
}
