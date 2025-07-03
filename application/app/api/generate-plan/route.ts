import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { TrainingPlan, TrainingWorkout, TrainingPlanStatus } from '../../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const openaiApiKey = process.env.OPENAI_API_KEY!;
const openaiApiUrl = 'https://api.openai.com/v1/chat/completions';

const supabase = createClient(supabaseUrl, supabaseKey);

function weeksBetween(start: Date, end: Date) {
    return Math.ceil((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { user_id, goal, deadline, days_per_week, ftp, weight } = body;
    const startDate = new Date();
    const endDate = new Date(deadline);
    const weeks = weeksBetween(startDate, endDate);
    let warning = '';
    if (weeks < 16) {
        warning = 'Warning: Your selected deadline is less than 16 weeks away. The plan will be shorter and less optimal for peak performance.';
    }
    // Compose prompt for OpenAI
    const prompt = `You are a professional cycling coach. Create a periodized, professional-grade training plan for a cyclist with the following:
- Goal: ${goal}
- Deadline: ${deadline} (today is ${startDate.toISOString().slice(0, 10)})
- Weeks: ${weeks} (ideally 16-22, but use the deadline)
- Days per week: ${days_per_week}
- FTP: ${ftp}
- Weight: ${weight}

The plan should:
- Be tailored to the goal and athlete's profile
- Be periodized (base, build, peak, taper)
- Each week should have ${days_per_week} structured workouts
- Each workout should have: title, description, splits (zone, time)
- Output as JSON array of workouts, each with a unique workout_id, title, description, date (spread evenly from today to deadline), and splits
- Do NOT include rest days as workouts
- The plan should be un-editable except for the date of each workout
- Example output:
[
  {
    "workout_id": "uuid-1",
    "title": "FTP Test",
    "description": "Test your FTP to set a baseline.",
    "date": "2024-06-01",
    "splits": [
      { "zone": "warm-up", "time": "00:10:00" },
      { "zone": "z3", "time": "00:20:00" },
      { "zone": "cool-down", "time": "00:10:00" }
    ]
  },
  ...
]
`;
    // Call OpenAI API
    const aiRes = await fetch(openaiApiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: 'You are a professional cycling coach and training plan generator.' },
                { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 3000,
        }),
    });
    if (!aiRes.ok) {
        return NextResponse.json({ error: 'AI generation failed' }, { status: 500 });
    }
    const aiData = await aiRes.json();
    let planJson: TrainingWorkout[] = [];
    try {
        // Try to parse the JSON from the AI response
        const text = aiData.choices[0].message.content;
        const match = text.match(/\[[\s\S]*\]/);
        planJson = JSON.parse(match ? match[0] : '[]');
    } catch (e) {
        return NextResponse.json({ error: 'Failed to parse AI plan output' }, { status: 500 });
    }
    // Save plan to Supabase as draft
    const { data, error } = await supabase.from('training_plans').insert([
        {
            user_id,
            plan_json: planJson,
            start_date: startDate.toISOString().slice(0, 10),
            end_date: deadline,
            goal,
            days_per_week,
            status: 'draft',
        },
    ]).select();
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Compose summary
    const summary = {
        total_weeks: weeks,
        phases: ['base', 'build', 'peak', 'taper'],
        workouts: planJson.length,
        days_per_week,
        goal,
        considerations: [
            'Plan is periodized and tailored to your goal and profile',
            'Each workout is structured for optimal progression',
            'Dates are editable, but workout content is fixed',
            'Shorter plans (<16 weeks) may be less effective',
        ],
    };
    return NextResponse.json({ plan: data[0], summary, warning });
} 