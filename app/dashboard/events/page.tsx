import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function EventsPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from('events')
    .select('*, profiles(full_name)')
    .order('scheduled_date', { ascending: false });

  const upcomingEvents = ((events || []) as any[]).filter(
    (event) => new Date(event.scheduled_date) >= new Date()
  );
  const pastEvents = ((events || []) as any[]).filter(
    (event) => new Date(event.scheduled_date) < new Date()
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Evenimente</h1>
        <Link
          href="/dashboard/events/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Adaugă Eveniment
        </Link>
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Evenimente viitoare ({upcomingEvents?.length || 0})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents && upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <Link
                key={event.id}
                href={`/dashboard/events/${event.id}`}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
                  {event.activity_type && (
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                      {event.activity_type.split('/')[0]}
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">📍</span>
                    {event.center_name}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">📌</span>
                    {event.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">📅</span>
                    {new Date(event.scheduled_date).toLocaleDateString('ro-RO', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {event.duration_hours && (
                    <p className="flex items-center gap-2">
                      <span className="font-medium">⏱️</span>
                      {event.duration_hours} ore
                    </p>
                  )}
                </div>
                {event.description && (
                  <p className="mt-3 text-sm text-gray-500 line-clamp-2">{event.description}</p>
                )}
                <p className="mt-3 text-xs text-gray-400">
                  Organizat de: {event.profiles?.full_name || 'Anonim'}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">Nu există evenimente viitoare</p>
          )}
        </div>
      </div>

      {/* Past Events */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Evenimente trecute ({pastEvents?.length || 0})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastEvents && pastEvents.length > 0 ? (
            pastEvents.map((event) => (
              <Link
                key={event.id}
                href={`/dashboard/events/${event.id}`}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow opacity-75"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
                  {event.activity_type && (
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {event.activity_type.split('/')[0]}
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">📍</span>
                    {event.center_name}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">📌</span>
                    {event.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">📅</span>
                    {new Date(event.scheduled_date).toLocaleDateString('ro-RO', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">Nu există evenimente trecute</p>
          )}
        </div>
      </div>
    </div>
  );
}
