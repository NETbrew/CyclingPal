'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const GOAL_TYPES = [
  { id: 'climbing', label: 'Improve Climbing Performance' },
  { id: 'ftp', label: 'Increase FTP (Functional Threshold Power)' },
  { id: 'endurance', label: 'Build Endurance' },
  { id: 'sprint', label: 'Enhance Sprint Power' },
  { id: 'recovery', label: 'Recovery and Maintenance' },
];

export default function GoalSelection() {
  const router = useRouter();
  const [goalType, setGoalType] = useState('');
  const [goalDescription, setGoalDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store the goal data in localStorage for now (we'll implement proper state management later)
    localStorage.setItem('trainingPlanGoal', JSON.stringify({
      type: goalType,
      description: goalDescription,
    }));
    router.push('/training-plan/new/schedule');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            What's Your Goal?
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="goal-type" className="block text-sm font-medium text-gray-700">
                Select Your Primary Goal
              </label>
              <select
                id="goal-type"
                value={goalType}
                onChange={(e) => setGoalType(e.target.value)}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select a goal</option>
                {GOAL_TYPES.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="goal-description" className="block text-sm font-medium text-gray-700">
                Tell us more about your goal
              </label>
              <textarea
                id="goal-description"
                rows={4}
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Describe your specific goals, any events you're training for, or particular aspects you want to focus on..."
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