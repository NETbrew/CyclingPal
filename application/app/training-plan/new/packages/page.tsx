'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function PackageSelection() {
  const router = useRouter();
  const supabase = createClient();

  const handleSelectPackage = async (packageType: string) => {
    try {
      // Get the stored data from localStorage
      const goalData = JSON.parse(localStorage.getItem('trainingPlanGoal') || '{}');
      const scheduleData = JSON.parse(localStorage.getItem('trainingPlanSchedule') || '{}');

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Create the training plan in the database
      const { error } = await supabase
        .from('training_plans')
        .insert({
          user_id: user.id,
          goal_type: goalData.type,
          goal_description: goalData.description,
          finish_date: scheduleData.finishDate,
          training_days_per_week: scheduleData.trainingDays,
          package_type: packageType,
          status: 'active',
        });

      if (error) throw error;

      // Clear the localStorage
      localStorage.removeItem('trainingPlanGoal');
      localStorage.removeItem('trainingPlanSchedule');

      // Set a flag in localStorage to show the success message
      localStorage.setItem('showTrainingPlanSuccess', 'true');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating training plan:', error);
      // Handle error appropriately
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Choose Your Training Plan Package
          </h1>
          <p className="mt-2 text-gray-600">
            Select the package that best fits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Basic Package */}
          <div className="bg-white shadow rounded-lg p-6 border-2 border-indigo-500">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic</h2>
            <p className="text-3xl font-bold text-gray-900 mb-4">€99</p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                AI-Powered Training Plan
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Weekly Workouts
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Progress Tracking
              </li>
            </ul>
            <button
              onClick={() => handleSelectPackage('basic')}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Select Basic
            </button>
          </div>

          {/* Premium Package */}
          <div className="bg-white shadow rounded-lg p-6 border-2 border-gray-200 opacity-75">
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Coming Soon
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Premium</h2>
            <p className="text-3xl font-bold text-gray-900 mb-4">€149</p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Everything in Basic
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Personalized Coaching
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Advanced Analytics
              </li>
            </ul>
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 px-6 py-3 rounded-md cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 