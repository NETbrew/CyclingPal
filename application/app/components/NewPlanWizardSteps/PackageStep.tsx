import React, { useState } from 'react';
import { usePlanWizard } from '../NewPlanWizardContext';
import Button from '@mui/material/Button';

const packages = [
  { id: 'basic', name: 'Basic', price: '€9.99/month' },
  { id: 'pro', name: 'Pro', price: '€19.99/month' },
  { id: 'elite', name: 'Elite', price: '€29.99/month' },
];

export default function PackageStep() {
  const { reset } = usePlanWizard();
  const [selected, setSelected] = useState('basic');
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    // Here you would handle payment and mark plan as active/paid
    setConfirmed(true);
    // Optionally, call API to update plan status
  };

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-4">Plan Activated!</h2>
        <p className="mb-8 text-gray-600">Your plan is now active. You can view it in your dashboard and calendar.</p>
        <Button variant="contained" color="primary" onClick={reset}>
          Done
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4">Choose Your Package</h3>
      <div className="flex flex-col gap-4">
        {packages.map(pkg => (
          <Button
            key={pkg.id}
            variant={selected === pkg.id ? 'contained' : 'outlined'}
            onClick={() => setSelected(pkg.id)}
            fullWidth
          >
            {pkg.name} - {pkg.price}
          </Button>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <Button variant="contained" color="primary" onClick={handleConfirm}>
          Confirm & Pay
        </Button>
      </div>
    </div>
  );
} 