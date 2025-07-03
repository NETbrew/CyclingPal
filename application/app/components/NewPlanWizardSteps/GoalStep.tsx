import React, { useEffect, useState } from 'react';
import { usePlanWizard } from '../NewPlanWizardContext';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

const goalOptions = [
  'Increase FTP',
  'Complete a Gran Fondo',
  'Lose Weight',
  'Ride Faster',
  'Other',
];

export default function GoalStep() {
  const {
    goal, setGoal, goalClarification, setGoalClarification,
    nextStep, prevStep, loading, setLoading, setPlanSummary, deadline, daysPerWeek, error, setError
  } = usePlanWizard();
  const [localClarification, setLocalClarification] = useState(goalClarification);

  // Debounce plan regeneration
  useEffect(() => {
    const handler = setTimeout(() => {
      if (goal && deadline && daysPerWeek) {
        setLoading(true);
        fetch('/api/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ goal, goalClarification: localClarification, deadline, days_per_week: daysPerWeek }),
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
  }, [goal, localClarification, deadline, daysPerWeek]);

  return (
    <div className="space-y-6">
      <TextField
        select
        label="Select your main goal"
        value={goal}
        onChange={e => setGoal(e.target.value as any)}
        fullWidth
      >
        {goalOptions.map(option => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Clarify your goal"
        value={localClarification}
        onChange={e => {
          setLocalClarification(e.target.value);
          setGoalClarification(e.target.value);
        }}
        fullWidth
      />
      <div className="flex justify-between mt-4">
        <Button variant="outlined" onClick={prevStep} disabled={loading}>Back</Button>
        <Button variant="contained" onClick={nextStep} disabled={loading || !goal}>Next</Button>
      </div>
      {error && <div className="text-orange-600 mt-2">{error}</div>}
    </div>
  );
} 