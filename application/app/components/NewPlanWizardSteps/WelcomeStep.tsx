import React from 'react';
import { usePlanWizard } from '../NewPlanWizardContext';
import Button from '@mui/material/Button';

export default function WelcomeStep() {
  const { nextStep } = usePlanWizard();
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-3xl font-bold mb-4">Welcome to Your New Training Plan</h2>
      <p className="mb-8 text-gray-600">Let's set your goal and get you started on your cycling journey.</p>
      <Button variant="contained" color="primary" onClick={nextStep}>
        Start
      </Button>
    </div>
  );
} 