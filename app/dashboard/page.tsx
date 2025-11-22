import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Fetch upcoming events
  const { data: upcomingEvents } = await supabase
    .from('events')
    .select('*, profiles(full_name)')
    .gte('scheduled_date', new Date().toISOString())
    .order('scheduled_date', { ascending: true })
    .limit(5);

  // Fetch recent reports
  const { data: recentReports } = await supabase
    .from('visit_reports')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(5);

  // Fetch user's reports count
  const userId = session?.user.id;
  const { count: userReportsCount } = userId 
    ? await supabase
        .from('visit_reports')
        .select('*', { count: 'exact', head: true })
        .eq('volunteer_id', userId as any)
    : { count: 0 };

  const typedEvents = (upcomingEvents || []) as any[];
  const typedReports = (recentReports || []) as any[];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-4">
          <Link
            href="/dashboard/events/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Adaugă Eveniment
          </Link>
          <Link
            href="/dashboard/reports/new"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Raport Vizită
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Evenimente viitoare</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {typedEvents.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Rapoartele tale</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{userReportsCount || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Rapoarte totale</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {typedReports.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Evenimente viitoare</h2>
            <Link
              href="/dashboard/events"
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Vezi toate
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {typedEvents.length > 0 ? (
              typedEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/dashboard/events/${event.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{event.center_name}</p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(event.scheduled_date).toLocaleDateString('ro-RO')}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="px-6 py-4 text-gray-500">Nu există evenimente programate</p>
            )}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Rapoarte recente</h2>
            <Link
              href="/dashboard/reports"
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Vezi toate
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {typedReports.length > 0 ? (
              typedReports.map((report) => (
                <Link
                  key={report.id}
                  href={`/dashboard/reports/${report.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{report.center_name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {report.profiles?.full_name || report.email}
                      </p>
                      <p className="text-sm text-gray-500">{report.activity_type}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(report.visit_date).toLocaleDateString('ro-RO')}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="px-6 py-4 text-gray-500">Nu există rapoarte</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
