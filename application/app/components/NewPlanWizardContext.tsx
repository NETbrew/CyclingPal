import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PlanWizardStep = 0 | 1 | 2 | 3 | 4 | 5;

export type GoalOption = 'Increase FTP' | 'Complete a Gran Fondo' | 'Lose Weight' | 'Ride Faster' | 'Other';

interface PlanWizardContextType {
  step: PlanWizardStep;
  setStep: (step: PlanWizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  goal: GoalOption;
  setGoal: (goal: GoalOption) => void;
  goalClarification: string;
  setGoalClarification: (text: string) => void;
  deadline: string;
  setDeadline: (date: string) => void;
  daysPerWeek: number;
  setDaysPerWeek: (days: number) => void;
  planSummary: any;
  setPlanSummary: (summary: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string;
  setError: (error: string) => void;
  reset: () => void;
}

const PlanWizardContext = createContext<PlanWizardContextType | undefined>(undefined);

export const usePlanWizard = () => {
  const ctx = useContext(PlanWizardContext);
  if (!ctx) throw new Error('usePlanWizard must be used within PlanWizardProvider');
  return ctx;
};

export const PlanWizardProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState<PlanWizardStep>(0);
  const [goal, setGoal] = useState<GoalOption>('Increase FTP');
  const [goalClarification, setGoalClarification] = useState('');
  const [deadline, setDeadline] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [planSummary, setPlanSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const nextStep = () => setStep((s) => (s < 5 ? ((s + 1) as PlanWizardStep) : s));
  const prevStep = () => setStep((s) => (s > 0 ? ((s - 1) as PlanWizardStep) : s));
  const reset = () => {
    setStep(0);
    setGoal('Increase FTP');
    setGoalClarification('');
    setDeadline('');
    setDaysPerWeek(3);
    setPlanSummary(null);
    setLoading(false);
    setError('');
  };

  return (
    <PlanWizardContext.Provider value={{
      step, setStep, nextStep, prevStep,
      goal, setGoal, goalClarification, setGoalClarification,
      deadline, setDeadline, daysPerWeek, setDaysPerWeek,
      planSummary, setPlanSummary, loading, setLoading, error, setError, reset
    }}>
      {children}
    </PlanWizardContext.Provider>
  );
}; 