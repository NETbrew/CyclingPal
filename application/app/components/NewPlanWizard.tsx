import React, { useEffect } from 'react';
import { PlanWizardProvider, usePlanWizard } from './NewPlanWizardContext';
import WelcomeStep from './NewPlanWizardSteps/WelcomeStep';
import GoalStep from './NewPlanWizardSteps/GoalStep';
import DeadlineStep from './NewPlanWizardSteps/DeadlineStep';
import DaysStep from './NewPlanWizardSteps/DaysStep';
import SummaryStep from './NewPlanWizardSteps/SummaryStep';
import PackageStep from './NewPlanWizardSteps/PackageStep';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = [
  'Welcome',
  'Goal',
  'Deadline',
  'Days/Week',
  'Summary',
  'Package',
];

function StepContent() {
  const { step } = usePlanWizard();
  switch (step) {
    case 0: return <WelcomeStep />;
    case 1: return <GoalStep />;
    case 2: return <DeadlineStep />;
    case 3: return <DaysStep />;
    case 4: return <SummaryStep />;
    case 5: return <PackageStep />;
    default: return null;
  }
}

export default function NewPlanWizard() {
  return (
    <PlanWizardProvider>
      <div className="max-w-xl mx-auto py-8">
        <Stepper activeStep={usePlanWizard().step} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className="mt-8">
          <StepContent />
        </div>
      </div>
    </PlanWizardProvider>
  );
} 