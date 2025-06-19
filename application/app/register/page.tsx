'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data?.user) {
        setIsVerificationSent(true);
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during registration');
    }
  };

  if (isVerificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Check your email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We've sent you a verification email. Please check your inbox and click the verification link to continue.
            </p>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              Return to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-between">
      {/* left side */}
      <div className="w-1/2 h-screen flex flex-col items-center justify-center">
        <div className='w-10/12 h-2/3 flex flex-col justify-center'>
          <div>
            <h2 className="mt-6 text-4xl font-extrabold text-gray-900">
              Maak een <span className='text-blue-500'>Account</span>
            </h2>
          </div>
          <form className="mt-8 space-y-6 max-w-lg" onSubmit={handleRegister}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            <div className='space-y-4'>
              <div>
                <label htmlFor="email-address" className="text-sm font-bold text-gray-500 mp-4">
                  Email
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full h-12 border border-gray-300 placeholder-gray-500 text-gray-900 bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm px-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-bold text-gray-500 mp-4">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-md bg-gray-100 relative block w-full h-12 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm px-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="text-sm font-bold text-gray-500 mp-4">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-md bg-gray-100 relative block w-full h-12 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm px-2"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center items-center h-12 border border-transparent text-sm font-bold rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Registreren
              </button>
              <p className="mt-2 text-center text-sm text-gray-600">
                Of{' '}
                <Link
                  href="/"
                  className="font-bold text-blue-500 hover:text-blue-400"
                >
                  meld je aan met je bestaande account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      {/* right side */}
      <div className='h-screen w-1/2 shadow-lg rounded-l-4xl bg-black'>
        <img src="/images/cyclist-glasses.jpg" alt="cyclist waiting" className='w-full h-full object-cover rounded-l-4xl opacity-75' />
      </div>
    </div>
  );
} 