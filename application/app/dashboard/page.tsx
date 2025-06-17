'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface TrainingPlan {
  id: string;
  goal_type: string;
  goal_description: string;
  finish_date: string;
  training_days_per_week: number;
  package_type: string;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const checkSuccessMessage = () => {
      const showSuccess = localStorage.getItem('showTrainingPlanSuccess');
      if (showSuccess === 'true') {
        setShowSuccess(true);
        localStorage.removeItem('showTrainingPlanSuccess');
      }
    };

    const fetchTrainingPlan = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('training_plans')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching training plan:', error);
          return;
        }

        setTrainingPlan(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    checkSuccessMessage();
    fetchTrainingPlan();
  }, []);

  const handleCreateNewPlan = () => {
    router.push('/training-plan/new');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {showSuccess && (
          <div className="mb-8 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Your training plan has been created successfully!
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setShowSuccess(false)}
                    className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!trainingPlan ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Hey pal, your former training plan has ended.
            </h2>
            <button
              onClick={handleCreateNewPlan}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create New Training Plan
            </button>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Current Training Plan</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Goal</h3>
                <p className="text-gray-600">{trainingPlan.goal_description}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Schedule</h3>
                <p className="text-gray-600">
                  Training {trainingPlan.training_days_per_week} days per week
                  <br />
                  Target completion: {new Date(trainingPlan.finish_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Package</h3>
                <p className="text-gray-600 capitalize">{trainingPlan.package_type}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Status</h3>
                <p className="text-gray-600 capitalize">{trainingPlan.status}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 