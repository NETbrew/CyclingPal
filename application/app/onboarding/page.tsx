'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export default function OnboardingPage() {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [weight, setWeight] = useState('');
  const [ftp, setFtp] = useState('');
  const [level, setLevel] = useState<UserLevel>('beginner');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setError('You must be logged in to complete your profile');
        return;
      }

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          date_of_birth: dateOfBirth,
          weight: parseFloat(weight),
          ftp: parseInt(ftp),
          level,
        });

      if (profileError) {
        setError(profileError.message);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-between">
      {/* left side */}
      <div className="w-1/2 h-screen flex flex-col items-center justify-center">
        <div className='w-10/12 h-2/3 flex flex-col justify-center'>
          <div>
            <h2 className="mt-6 text-4xl font-extrabold text-gray-900">
              Complete je <span className='text-blue-500'>Profiel</span>
            </h2>
            <p className="mt-2 text-sm text-gray-600">Vertel ons wat meer over jezelf</p>
          </div>
          {error && (
            <div className="rounded-md bg-red-50 p-4 mt-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <form className="mt-8 space-y-6 max-w-lg" onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <div>
                <label htmlFor="dateOfBirth" className="text-sm font-bold text-gray-500 mp-4">
                  Geboortedatum
                </label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  required
                  className="appearance-none rounded-md relative block w-full h-12 border border-gray-300 placeholder-gray-500 text-gray-900 bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm px-2"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="weight" className="text-sm font-bold text-gray-500 mp-4">
                  Gewicht (kg)
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  required
                  min="0"
                  step="0.1"
                  className="appearance-none rounded-md bg-gray-100 relative block w-full h-12 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm px-2"
                  placeholder="Voer je gewicht in"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="ftp" className="text-sm font-bold text-gray-500 mp-4">
                  FTP (watt)
                </label>
                <input
                  id="ftp"
                  name="ftp"
                  type="number"
                  required
                  min="0"
                  className="appearance-none rounded-md bg-gray-100 relative block w-full h-12 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm px-2"
                  placeholder="Voer je FTP in"
                  value={ftp}
                  onChange={(e) => setFtp(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="level" className="text-sm font-bold text-gray-500 mp-4">
                  Fietsniveau
                </label>
                <select
                  id="level"
                  name="level"
                  required
                  className="appearance-none rounded-md bg-gray-100 relative block w-full h-12 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm px-2"
                  value={level}
                  onChange={(e) => setLevel(e.target.value as UserLevel)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Gevorderd</option>
                  <option value="advanced">Expert</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center items-center h-12 border border-transparent text-sm font-bold rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Profiel Voltooien
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* right side */}
      <div className='h-screen w-1/2 shadow-lg rounded-l-4xl bg-black'>
        <img src="/images/cyclist-waiting.jpg" alt="cyclist waiting" className='w-full h-full object-cover rounded-l-4xl opacity-75' />
      </div>
    </div>
  );
} 