import DashboardPageLayout from '@/components/dashboard/layout';
import BracketsIcon from '@/components/icons/brackets';
import { HabitModal } from '@/components/habits/HabitModal';
import { NewHabitModal } from '@/components/habits/NewHabitModal';
import { useState } from 'react';
import { useV0 } from '@/lib/v0-context';
import type { Habit } from '@/types/dashboard';

const Habits = () => {
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [showNewHabit, setShowNewHabit] = useState(false);
  const { habits } = useV0();

  return (
    <DashboardPageLayout
      header={{
        title: 'Streak: 2 days🔥',
        description: 'XP:250⚡',
        icon: BracketsIcon,
      }}
    >
      <div className='flex items-center justify-between mb-2'>
        <h2 className='text-xl lg:text-3xl font-display'>Habits List</h2>
        <button
          className='px-4 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition'
          onClick={() => setShowNewHabit(true)}
        >
          + Add Habit
        </button>
      </div>
      <div className='grid gap-4 -mt-4'>
        {habits.map((habit) => (
          <div
            key={habit.id}
            className='p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors'
          >
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-semibold'>{habit.name}</h3>
                <p className='text-muted-foreground'>{habit.description}</p>
              </div>
              <div className='flex items-center gap-4'>
                <span className='text-sm text-muted-foreground'>
                  Current streak: {habit.streak} days
                </span>
                <button
                  onClick={() => setSelectedHabit(habit)}
                  className='px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-primary/30'
                >
                  View
                </button>
                {/* <button
                  className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90'
                  onClick={() => completeHabit(habit.id)}
                >
                  Complete
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedHabit && (
        <HabitModal
          habit={selectedHabit}
          isOpen={!!selectedHabit}
          onClose={() => setSelectedHabit(null)}
        />
      )}

      <NewHabitModal
        isOpen={showNewHabit}
        onClose={() => setShowNewHabit(false)}
      />
    </DashboardPageLayout>
  );
};

export default Habits;
