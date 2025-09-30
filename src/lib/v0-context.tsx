import { createContext, useContext, useReducer, type ReactNode } from 'react';
import { mockHabits } from '@/data/habit-mock';
import type { Habit } from '@/types/dashboard';

type V0ContextType = {
  isV0: boolean;
  habits: Habit[];
  addHabit: (
    habit: Omit<Habit, 'id' | 'progress' | 'createdAt' | 'streak'>
  ) => void;
  completeHabit: (id: string) => void;
};

const V0Context = createContext<V0ContextType | undefined>(undefined);

type V0ProviderProps = {
  children: ReactNode;
  isV0: boolean;
};

type Action =
  | {
      type: 'ADD_HABIT';
      payload: Omit<Habit, 'id' | 'progress' | 'createdAt' | 'streak'>;
    }
  | { type: 'COMPLETE_HABIT'; payload: { id: string } };

function habitsReducer(state: Habit[], action: Action): Habit[] {
  switch (action.type) {
    case 'ADD_HABIT':
      return [
        ...state,
        {
          id: Math.random().toString(36).slice(2),
          name: action.payload.name,
          description: action.payload.description,
          frequency: action.payload.frequency,
          target: action.payload.target,
          progress: 0,
          createdAt: new Date(),
          streak: 0,
        },
      ];
    case 'COMPLETE_HABIT':
      return state.map((habit) =>
        habit.id === action.payload.id
          ? {
              ...habit,
              progress: habit.progress + 1,
              streak: habit.streak + 1,
            }
          : habit
      );
    default:
      return state;
  }
}

export const V0Provider = ({ children, isV0 }: V0ProviderProps) => {
  const [habits, dispatch] = useReducer(habitsReducer, mockHabits);

  const addHabit = (
    habit: Omit<Habit, 'id' | 'progress' | 'createdAt' | 'streak'>
  ) => {
    dispatch({ type: 'ADD_HABIT', payload: habit });
  };

  const completeHabit = (id: string) => {
    dispatch({ type: 'COMPLETE_HABIT', payload: { id } });
  };

  return (
    <V0Context.Provider value={{ isV0, habits, addHabit, completeHabit }}>
      {children}
    </V0Context.Provider>
  );
};

export const useV0 = () => {
  const context = useContext(V0Context);
  if (context === undefined) {
    throw new Error('useV0 must be used within a V0Provider');
  }
  return context;
};

export const useIsV0 = (): boolean => {
  const context = useContext(V0Context);
  if (context === undefined) {
    throw new Error('useIsV0 must be used within a V0Provider');
  }
  return context.isV0;
};
