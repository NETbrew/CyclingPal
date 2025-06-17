'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ScheduleSelection() {
  const router = useRouter();
  const [finishDate, setFinishDate] = useState('');
  const [trainingDays, setTrainingDays] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store the schedule data in localStorage
    localStorage.setItem('trainingPlanSchedule', JSON.stringify({
      finishDate,
      trainingDays,
    }));
    router.push('/training-plan/new/packages');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Training Schedule
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="finish-date" className="block text-sm font-medium text-gray-700">
                When is your ideal finish date?
              </label>
              <input
                type="date"
                id="finish-date"
                value={finishDate}
                onChange={(e) => setFinishDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="training-days" className="block text-sm font-medium text-gray-700">
                How many days per week can you train?
              </label>
              <input
                type="number"
                id="training-days"
                min="1"
                max="7"
                value={trainingDays}
                onChange={(e) => setTrainingDays(parseInt(e.target.value))}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next Step
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 