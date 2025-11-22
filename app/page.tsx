import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Ajungem Mari</h1>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              >
                Autentificare
              </Link>
              <Link
                href="/signup"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Înregistrare
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Portal Voluntari
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Platforma pentru gestionarea vizitelor și comunicarea între voluntarii Asociației Ajungem Mari
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Gestionare Evenimente
            </h3>
            <p className="text-gray-600">
              Creează și gestionează evenimente pentru vizitele la centrele de plasament și orfelinate
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Rapoarte Vizite
            </h3>
            <p className="text-gray-600">
              Completează rapoarte detaliate după fiecare vizită pentru a urmări progresul copiilor
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Comunicare Organizație
            </h3>
            <p className="text-gray-600">
              Rămâi conectat cu echipa prin sistemul de mesagerie intern
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Gata să începi?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Înregistrează-te acum pentru a începe să contribui la dezvoltarea copiilor instituționalizați
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
            >
              Creează Cont
            </Link>
            <Link
              href="/login"
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium text-lg"
            >
              Am deja cont
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm mt-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Asociația Ajungem Mari. Toate drepturile rezervate.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
