'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function NewEventPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activityTypes = [
    'Atelier educațional/de dezvoltare personală',
    'Activitate recreativă/de socializare',
    'Tutorat/Meditații (materie specifică)',
    'Donație/Distribuire de materiale',
    'Discuție informală/Consiliere',
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Nu ești autentificat');
      }

      const { error: insertError } = await supabase.from('events').insert({
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        center_name: formData.get('center_name') as string,
        location: formData.get('location') as string,
        scheduled_date: formData.get('scheduled_date') as string,
        duration_hours: parseFloat(formData.get('duration_hours') as string),
        activity_type: formData.get('activity_type') as string,
        created_by: user.id,
      } as any);

      if (insertError) throw insertError;

      router.push('/dashboard/events');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
        >
          ← Înapoi la Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Adaugă Eveniment Nou</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Titlu eveniment *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descriere
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="center_name" className="block text-sm font-medium text-gray-700 mb-2">
              Numele centrului / orfelinatului *
            </label>
            <input
              type="text"
              id="center_name"
              name="center_name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Localitatea (oraș/sector) *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700 mb-2">
              Data programată *
            </label>
            <input
              type="datetime-local"
              id="scheduled_date"
              name="scheduled_date"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="duration_hours" className="block text-sm font-medium text-gray-700 mb-2">
              Durata (ore)
            </label>
            <input
              type="number"
              step="0.5"
              id="duration_hours"
              name="duration_hours"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="2"
            />
          </div>

          <div>
            <label htmlFor="activity_type" className="block text-sm font-medium text-gray-700 mb-2">
              Tipul activității
            </label>
            <select
              id="activity_type"
              name="activity_type"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Selectează tipul</option>
              {activityTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Se salvează...' : 'Salvează Evenimentul'}
            </button>
            <Link
              href="/dashboard"
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-center"
            >
              Anulează
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
