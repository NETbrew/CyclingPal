'use client';

import { useRouter } from 'next/navigation';

export default function NewTrainingPlan() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            New Training Plan
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Let's create a personalized training plan that will help you achieve your cycling goals.
            We'll guide you through a few simple steps to understand your needs and create the perfect plan for you.
          </p>
          <button
            onClick={() => router.push('/training-plan/new/goal')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Start Creating Your Plan
          </button>
        </div>
      </div>
    </div>
  );
} 