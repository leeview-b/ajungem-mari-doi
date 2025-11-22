import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function ReportsPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: reports } = await supabase
    .from('visit_reports')
    .select('*, profiles(full_name)')
    .order('visit_date', { ascending: false });

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', (session?.user.id || '') as any)
    .single();

  const isAdmin = (profile as any)?.role === 'admin';
  const typedReports = (reports || []) as any[];
  const userReports = typedReports.filter((r) => r.volunteer_id === session?.user.id);
  const otherReports = typedReports.filter((r) => r.volunteer_id !== session?.user.id);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Rapoarte Vizite</h1>
        <Link
          href="/dashboard/reports/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Raport Nou
        </Link>
      </div>

      {/* User's Reports */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Rapoartele tale ({userReports?.length || 0})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userReports && userReports.length > 0 ? (
            userReports.map((report) => (
              <Link
                key={report.id}
                href={`/dashboard/reports/${report.id}`}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg">{report.center_name}</h3>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {report.activity_type.split('/')[0]}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">📍</span>
                    {report.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">📅</span>
                    {new Date(report.visit_date).toLocaleDateString('ro-RO', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">⏱️</span>
                    {report.duration_hours} ore
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">👥</span>
                    {report.children_count} copii
                  </p>
                </div>
                <p className="mt-3 text-sm text-gray-500 line-clamp-2">
                  {report.activity_description}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">Nu ai raportat încă nicio vizită</p>
          )}
        </div>
      </div>

      {/* All Reports (for admins) or Other Volunteers' Reports */}
      {(isAdmin || (otherReports && otherReports.length > 0)) && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {isAdmin ? 'Toate rapoartele' : 'Rapoarte alți voluntari'} ({otherReports?.length || 0})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherReports && otherReports.length > 0 ? (
              otherReports.map((report) => (
                <Link
                  key={report.id}
                  href={`/dashboard/reports/${report.id}`}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{report.center_name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {report.activity_type.split('/')[0]}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <span className="font-medium">👤</span>
                      {report.profiles?.full_name || report.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">📍</span>
                      {report.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">📅</span>
                      {new Date(report.visit_date).toLocaleDateString('ro-RO', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">👥</span>
                      {report.children_count} copii
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 col-span-full">Nu există alte rapoarte</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
