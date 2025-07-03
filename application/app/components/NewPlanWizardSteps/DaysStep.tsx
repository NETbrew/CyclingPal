import React, { useEffect, useState } from 'react';
import { usePlanWizard } from '../NewPlanWizardContext';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function DaysStep() {
  const {
    daysPerWeek, setDaysPerWeek, nextStep, prevStep, loading, setLoading, setPlanSummary, goal, goalClarification, deadline, error, setError
  } = usePlanWizard();
  const [localDays, setLocalDays] = useState(daysPerWeek);

  // Debounce plan regeneration
  useEffect(() => {
    const handler = setTimeout(() => {
      if (goal && deadline && localDays) {
        setLoading(true);
        fetch('/api/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ goal, goalClarification, deadline, days_per_week: localDays }),
        })
          .then(res => res.json())
          .then(data => {
            setPlanSummary(data.summary);
            setError(data.warning || '');
          })
          .catch(() => setError('Failed to generate plan'))
          .finally(() => setLoading(false));
      }
    }, 500);
    return () => clearTimeout(handler);
    // eslint-disable-next-line
  }, [goal, goalClarification, deadline, localDays]);

  return (
    <div className="space-y-6">
      <TextField
        label="Days per week you can train"
        type="number"
        inputProps={{ min: 1, max: 7 }}
        value={localDays}
        onChange={e => {
          const val = Math.max(1, Math.min(7, Number(e.target.value)));
          setLocalDays(val);
          setDaysPerWeek(val);
        }}
        fullWidth
      />
      <div className="flex justify-between mt-4">
        <Button variant="outlined" onClick={prevStep} disabled={loading}>Back</Button>
        <Button variant="contained" onClick={nextStep} disabled={loading || !localDays}>Next</Button>
      </div>
      {error && <div className="text-orange-600 mt-2">{error}</div>}
    </div>
  );
} 