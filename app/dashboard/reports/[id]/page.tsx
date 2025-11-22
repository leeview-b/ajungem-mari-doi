import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: report } = await supabase
    .from('visit_reports')
    .select('*, profiles(full_name, email)')
    .eq('id', id as any)
    .single();

  const typedReport = report as any;

  if (!typedReport) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/reports"
          className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
        >
          ← Înapoi la Rapoarte
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-8 py-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">{typedReport.center_name}</h1>
          <p className="text-gray-600 mt-2">Raport Vizită</p>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Voluntar</h3>
              <p className="text-gray-900">{typedReport.profiles?.full_name || typedReport.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
              <p className="text-gray-900">{typedReport.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Data vizitei</h3>
              <p className="text-gray-900">
                {new Date(typedReport.visit_date).toLocaleDateString('ro-RO', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Durata</h3>
              <p className="text-gray-900">{typedReport.duration_hours} ore</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Locație</h3>
              <p className="text-gray-900">{typedReport.location}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Tip activitate</h3>
              <p className="text-gray-900">{typedReport.activity_type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Număr copii</h3>
              <p className="text-gray-900">{typedReport.children_count}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Copiii care au participat</h3>
            <p className="text-gray-900 whitespace-pre-wrap">{typedReport.children_names}</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Descrierea activității
            </h3>
            <p className="text-gray-900 whitespace-pre-wrap">{typedReport.activity_description}</p>
          </div>

          {typedReport.testimonials && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Testimoniale copii</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">{typedReport.testimonials}</p>
              </div>
            </div>
          )}

          {typedReport.child_observations && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Observații despre evoluția copiilor
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">{typedReport.child_observations}</p>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <p className="text-xs text-gray-500">
              Creat la: {new Date(typedReport.created_at).toLocaleDateString('ro-RO', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
