import type { Habit } from '@/types/dashboard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { useV0 } from '@/lib/v0-context';
import { Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface HabitModalProps {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
}

export function HabitModal({ habit, isOpen, onClose }: HabitModalProps) {
  const { completeHabit } = useV0();

  const handleComplete = () => {
    completeHabit(habit.id);
    toast.success('Habit Completed!');
    //   title: 'Habit Completed!',
    //   description: `You completed "${habit.name}" for today. Keep it up!`,
    //   variant: 'success',
    onClose();
  };

  // Placeholder for delete logic
  const handleDelete = () => {
    toast.success('Delete not implemented');
    //     {
    //   title: 'Delete not implemented',
    //   description: 'Habit deletion will be available soon.',
    //   variant: 'destructive',
    // }
    // onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px] bg-[#101c1c] border border-[#1e2e2e] rounded-xl shadow-2xl p-0'>
        <DialogHeader className='bg-[#142626] rounded-t-xl px-6 py-4 border-b border-[#1e2e2e]'>
          <DialogTitle className='flex items-center gap-3 text-2xl font-bold text-green-300'>
            {habit.name}
          </DialogTitle>
        </DialogHeader>
        <div className='px-6 py-5 grid gap-6'>
          <div>
            <p className='text-base text-muted-foreground mb-2 font-semibold'>
              Description
            </p>
            <p className='text-lg text-white'>
              {habit.description || (
                <span className='italic text-gray-400'>No description</span>
              )}
            </p>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <div className='text-xs text-muted-foreground'>Frequency</div>
              <div className='text-base font-semibold capitalize text-white'>
                {habit.frequency}
              </div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground'>Streak</div>
              <div className='text-base font-semibold text-white'>
                {habit.streak} days
              </div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground'>Progress</div>
              <div className='text-base font-semibold text-white'>
                {habit.progress} / {habit.target}
              </div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground'>Created</div>
              <div className='text-base font-semibold text-white'>
                {new Date(habit.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-end gap-2 px-6 pb-5'>
          <button
            className='flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition'
            onClick={handleComplete}
          >
            <CheckCircle2 className='w-4 h-4' /> Complete
          </button>
          <button
            className='flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition'
            onClick={handleDelete}
          >
            <Trash2 className='w-4 h-4' /> Delete
          </button>
          <DialogClose asChild>
            <button
              className='px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600'
              onClick={onClose}
            >
              Close
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
