import React, { useEffect, useState } from 'react';
import { usePlanWizard } from '../NewPlanWizardContext';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function DeadlineStep() {
  const {
    deadline, setDeadline, nextStep, prevStep, loading, setLoading, setPlanSummary, goal, goalClarification, daysPerWeek, error, setError
  } = usePlanWizard();
  const [localDeadline, setLocalDeadline] = useState(deadline);

  // Debounce plan regeneration
  useEffect(() => {
    const handler = setTimeout(() => {
      if (goal && localDeadline && daysPerWeek) {
        setLoading(true);
        fetch('/api/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ goal, goalClarification, deadline: localDeadline, days_per_week: daysPerWeek }),
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
  }, [goal, goalClarification, localDeadline, daysPerWeek]);

  return (
    <div className="space-y-6">
      <TextField
        label="Goal Deadline"
        type="date"
        value={localDeadline}
        onChange={e => {
          setLocalDeadline(e.target.value);
          setDeadline(e.target.value);
        }}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      <div className="flex justify-between mt-4">
        <Button variant="outlined" onClick={prevStep} disabled={loading}>Back</Button>
        <Button variant="contained" onClick={nextStep} disabled={loading || !localDeadline}>Next</Button>
      </div>
      {error && <div className="text-orange-600 mt-2">{error}</div>}
    </div>
  );
} 