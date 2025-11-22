'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function NewReportPage() {
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

      const { error: insertError } = await supabase.from('visit_reports').insert({
        volunteer_id: user.id,
        email: formData.get('email') as string,
        visit_date: formData.get('visit_date') as string,
        duration_hours: parseFloat(formData.get('duration_hours') as string),
        center_name: formData.get('center_name') as string,
        location: formData.get('location') as string,
        activity_type: formData.get('activity_type') as string,
        children_count: parseInt(formData.get('children_count') as string),
        children_names: formData.get('children_names') as string,
        activity_description: formData.get('activity_description') as string,
        testimonials: formData.get('testimonials') as string || null,
        child_observations: formData.get('child_observations') as string || null,
      } as any);

      if (insertError) throw insertError;

      router.push('/dashboard/reports');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
        >
          ← Înapoi la Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Raport Vizită Asociația Ajungem Mari</h1>
          <p className="text-gray-600 mt-2">
            Formular pentru înregistrarea detaliilor și feedback-ului privind o vizită la un centru de
            plasament sau orfelinat în cadrul programului Ajungem Mari.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Adresă de e-mail *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="email@exemplu.ro"
            />
          </div>

          <div>
            <label htmlFor="visit_date" className="block text-sm font-medium text-gray-700 mb-2">
              Data în care s-a desfășurat activitatea *
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Te rugăm să NU scrii de mână data. Dă click pe butonul de calendar sau pe săgeată și
              selectează de acolo ziua.
            </p>
            <input
              type="date"
              id="visit_date"
              name="visit_date"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="duration_hours" className="block text-sm font-medium text-gray-700 mb-2">
              Durata activității (ore) *
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Te rugăm să menționezi DOAR numărul de ore petrecute la activitate. Ex.: 2 / 1.5
            </p>
            <input
              type="number"
              step="0.5"
              id="duration_hours"
              name="duration_hours"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="2"
            />
          </div>

          <div>
            <label htmlFor="center_name" className="block text-sm font-medium text-gray-700 mb-2">
              Numele centrului / orfelinatului vizitat *
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
              Localitatea (oraș/sector) unde a avut loc vizita *
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
            <label htmlFor="activity_type" className="block text-sm font-medium text-gray-700 mb-2">
              Tipul activității desfășurate *
            </label>
            <select
              id="activity_type"
              name="activity_type"
              required
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

          <div>
            <label htmlFor="children_count" className="block text-sm font-medium text-gray-700 mb-2">
              Câți copii au participat la activitate? *
            </label>
            <input
              type="number"
              id="children_count"
              name="children_count"
              required
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="children_names" className="block text-sm font-medium text-gray-700 mb-2">
              Numele copiilor care au participat la activitate *
            </label>
            <textarea
              id="children_names"
              name="children_names"
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Nume prenume, Nume prenume, ..."
            />
          </div>

          <div>
            <label htmlFor="activity_description" className="block text-sm font-medium text-gray-700 mb-2">
              Cum s-a desfășurat activitatea? *
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Descrie ce ați făcut, cum au reacționat copiii, ce au învățat, dacă au existat conflicte sau
              alte incidente, dacă ai întâmpinat dificultăți, orice alte observații sau lucruri care crezi
              că trebuie menționate. Poți da copy paste la postarea din raportul de pe grupul de Facebook.
            </p>
            <textarea
              id="activity_description"
              name="activity_description"
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="testimonials" className="block text-sm font-medium text-gray-700 mb-2">
              Optional - Testimoniale copii (replici amuzante, emoționante)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Dacă în cadrul întâlnirii unul din copii a făcut o remarcă emoționantă, de impact sau
              amuzantă, te rugăm să treci aici replica, numele copilului și vârsta lui. Ne va ajuta pentru
              postări drăguțe pe paginile locale și în campania de recrutare.
            </p>
            <textarea
              id="testimonials"
              name="testimonials"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="child_observations" className="block text-sm font-medium text-gray-700 mb-2">
              Ai dori să ne transmiți observații sau recomandări esențiale despre evoluția unui copil cu
              care lucrezi?
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Ex.: un copil care era foarte vesel și cooperativ până acum, de ceva timp este foarte violent
              și nu mai participă la activități sau ai observat că a intrat într-un anturaj nepotrivit,
              despre o anumită situație pe care ar trebui să o cunoaștem, ex.: într-o discuție cu un copil
              ai aflat că o educatoare i-a spus că nu îl lasă să se înscrie la liceul pe care și-l dorește
              sau orice altă observație/recomandare care ți se pare relevantă.
            </p>
            <textarea
              id="child_observations"
              name="child_observations"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Se trimite...' : 'Trimite Raportul'}
            </button>
            <Link
              href="/dashboard"
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-center font-medium"
            >
              Anulează
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
