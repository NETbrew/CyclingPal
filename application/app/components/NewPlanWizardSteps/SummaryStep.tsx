import React from 'react';
import { usePlanWizard } from '../NewPlanWizardContext';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export default function SummaryStep() {
  const { planSummary, loading, nextStep, prevStep, error } = usePlanWizard();

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Plan Summary</h3>
      {loading ? (
        <div className="flex justify-center"><CircularProgress /></div>
      ) : planSummary ? (
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">{JSON.stringify(planSummary, null, 2)}</pre>
      ) : (
        <div className="text-gray-500">No summary available yet.</div>
      )}
      {error && <div className="text-orange-600 mt-2">{error}</div>}
      <div className="flex justify-between mt-4">
        <Button variant="outlined" onClick={prevStep} disabled={loading}>Back</Button>
        <Button variant="contained" onClick={nextStep} disabled={loading || !planSummary}>Choose Package</Button>
      </div>
    </div>
  );
} 