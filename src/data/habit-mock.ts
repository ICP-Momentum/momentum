import type { Habit } from '@/types/dashboard';

export const mockHabits: Habit[] = [
  {
    id: 'habit-1',
    name: 'Read 10 pages',
    description: 'Read at least 10 pages of a book daily',
    frequency: 'daily',
    target: 1,
    progress: 0,
    createdAt: new Date('2025-01-01'),
    streak: 5,
  },
  {
    id: 'habit-2',
    name: 'Exercise',
    description: 'Workout at the gym or run',
    frequency: 'weekly',
    target: 3,
    progress: 1,
    createdAt: new Date('2025-02-15'),
    streak: 2,
  },
  {
    id: 'habit-3',
    name: 'Meditation',
    description: 'Meditate for at least 10 minutes',
    frequency: 'daily',
    target: 1,
    progress: 1,
    createdAt: new Date('2025-03-10'),
    streak: 12,
  },
  {
    id: 'habit-4',
    name: 'Call family',
    frequency: 'weekly',
    target: 1,
    progress: 0,
    createdAt: new Date('2025-04-01'),
    streak: 0,
  },
];
