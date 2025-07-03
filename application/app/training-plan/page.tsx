'use client';

import { useState, useEffect } from 'react';

// Types
interface TrainingResult {
  duration: string;
  distance: string;
  avgSpeed: string;
  calories: string;
  elevation: string;
  TSS: string;
  IF: string;
  normalized: string;
  work: string;
  heartRateMin: string;
  heartRateMax: string;
  powerMin: string;
  powerMax: string;
}

interface TrainingSplit {
  zone: string;
  tijd: string;
}

interface Training {
  id: number;
  day: string; // ISO date string
  title: string;
  description: string;
  splits: TrainingSplit[];
  note: string;
  result: TrainingResult;
}

const staticTrainings: Training[] = [
  {
    id: 1,
    day: '2024-06-10T00:00:00Z',
    title: 'Endurance Ride',
    description: 'Long steady ride in zone 2.',
    splits: [
      { zone: 'Z2', tijd: '2:00:00' },
      { zone: 'Z3', tijd: '0:30:00' }
    ],
    note: 'Focus on steady cadence.',
    result: {
      duration: '',
      distance: '',
      avgSpeed: '',
      calories: '',
      elevation: '',
      TSS: '',
      IF: '',
      normalized: '',
      work: '',
      heartRateMin: '',
      heartRateMax: '',
      powerMin: '',
      powerMax: '',
    }
  },
  {
    id: 2,
    day: '2024-06-11T00:00:00Z',
    title: 'Interval Session',
    description: 'Intervals in zone 4 and 5.',
    splits: [
      { zone: 'Z4', tijd: '0:20:00' },
      { zone: 'Z5', tijd: '0:10:00' }
    ],
    note: 'Push hard on the intervals.',
    result: {
      duration: '',
      distance: '',
      avgSpeed: '',
      calories: '',
      elevation: '',
      TSS: '',
      IF: '',
      normalized: '',
      work: '',
      heartRateMin: '',
      heartRateMax: '',
      powerMin: '',
      powerMax: '',
    }
  },
  // Add more trainings for the week as needed
];

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[350px] max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
}

export default function WeeklyOverview() {
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [showDoneModal, setShowDoneModal] = useState<boolean>(false);
  const [trainings, setTrainings] = useState<Training[]>(staticTrainings);
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [doneForm, setDoneForm] = useState<Partial<TrainingResult>>({});
  const [startOfWeek, setStartOfWeek] = useState<Date | null>(null);
  const [weekDays, setWeekDays] = useState<Date[]>([]);

  useEffect(() => {
    // Calculate start of week (Monday) on client only
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);
    setStartOfWeek(start);
    // Calculate all days in the current week
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
    setWeekDays(days);
  }, [weekOffset]);

  if (!startOfWeek || weekDays.length !== 7) return null;

  // Filter trainings for the current week
  const weekTrainings = weekDays.map(day => {
    const t = trainings.find(tg => {
      const tgDate = new Date(tg.day);
      return tgDate.toDateString() === day.toDateString();
    });
    return t || null;
  });

  const handleDoneClick = (training: Training) => {
    setSelectedTraining(training);
    setDoneForm(training.result || {});
    setShowDoneModal(true);
  };

  const handleDoneSubmit = () => {
    if (!selectedTraining) return;
    setTrainings(ts =>
      ts.map(tg =>
        tg.id === selectedTraining.id ? { ...tg, result: { ...doneForm } as TrainingResult } : tg
      )
    );
    setShowDoneModal(false);
    setSelectedTraining(null);
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Weekly Overview</h1>
        <div>
          <button className="px-3 py-1 bg-gray-200 rounded-l" onClick={() => setWeekOffset(w => w - 1)}>&lt;</button>
          <span className="px-4">Week of {weekDays[0].toLocaleDateString('en-GB')}</span>
          <button className="px-3 py-1 bg-gray-200 rounded-r" onClick={() => setWeekOffset(w => w + 1)}>&gt;</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, idx) => (
          <div key={day.toISOString()} className="bg-white rounded-lg shadow p-2 min-h-[180px] flex flex-col">
            <div className="font-semibold mb-2">{daysOfWeek[idx]}</div>
            {weekTrainings[idx] ? (
              <div className="flex-1 flex flex-col">
                <div
                  className="cursor-pointer p-2 rounded bg-blue-50 hover:bg-blue-100 mb-2"
                  onClick={() => setSelectedTraining(weekTrainings[idx])}
                >
                  <div className="font-bold">{weekTrainings[idx]?.title}</div>
                  <div className="text-xs text-gray-600 mb-1">{weekTrainings[idx]?.description}</div>
                  <div className="text-xs mb-1">
                    {weekTrainings[idx]?.splits.map((s, i) => (
                      <span key={i} className="inline-block mr-2">{s.zone}: {s.tijd}</span>
                    ))}
                  </div>
                  <div className="text-xs italic text-gray-500">{weekTrainings[idx]?.note}</div>
                </div>
                <button
                  className="mt-auto px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => handleDoneClick(weekTrainings[idx] as Training)}
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">No training</div>
            )}
          </div>
        ))}
      </div>

      {/* Training Details Modal */}
      <Modal open={!!selectedTraining && !showDoneModal} onClose={() => setSelectedTraining(null)}>
        {selectedTraining && (
          <div>
            <h2 className="text-xl font-bold mb-2">{selectedTraining.title}</h2>
            <div className="mb-2 text-gray-700">{selectedTraining.description}</div>
            <div className="mb-2">
              {selectedTraining.splits.map((s, i) => (
                <div key={i} className="text-sm">Zone: {s.zone}, Tijd: {s.tijd}</div>
              ))}
            </div>
            <div className="mb-2 italic text-gray-500">{selectedTraining.note}</div>
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => handleDoneClick(selectedTraining)}
            >
              Done
            </button>
          </div>
        )}
      </Modal>

      {/* Done Modal */}
      <Modal open={showDoneModal} onClose={() => setShowDoneModal(false)}>
        <h2 className="text-lg font-bold mb-4">Mark as Done</h2>
        <form
          className="space-y-2"
          onSubmit={e => {
            e.preventDefault();
            handleDoneSubmit();
          }}
        >
          {Object.entries(staticTrainings[0].result).map(([key, _]) => (
            <div key={key}>
              <label className="block text-xs font-semibold mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={doneForm[key as keyof TrainingResult] || ''}
                onChange={e => setDoneForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={`Enter ${key}`}
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </form>
      </Modal>
    </div>
  );
} 