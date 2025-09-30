import { useState } from 'react';
import { useV0 } from '@/lib/v0-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

interface NewHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewHabitModal({ isOpen, onClose }: NewHabitModalProps) {
  const { addHabit } = useV0();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>(
    'daily'
  );
  const [target, setTarget] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addHabit({ name, description, frequency, target });
    setName('');
    setDescription('');
    setFrequency('daily');
    setTarget(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[400px] bg-[#101c1c] border border-[#1e2e2e] rounded-xl shadow-2xl'>
        <DialogHeader>
          <DialogTitle className='text-green-300'>Add New Habit</DialogTitle>
        </DialogHeader>
        <form className='grid gap-4 py-2' onSubmit={handleSubmit}>
          <div>
            <label className='block text-sm mb-1 text-white'>Name</label>
            <input
              className='w-full rounded-md px-3 py-2 bg-[#162626] text-white border border-[#1e2e2e] focus:outline-none'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className='block text-sm mb-1 text-white'>Description</label>
            <textarea
              className='w-full rounded-md px-3 py-2 bg-[#162626] text-white border border-[#1e2e2e] focus:outline-none'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className='flex gap-2'>
            <div className='flex-1'>
              <label className='block text-sm mb-1 text-white'>Frequency</label>
              <select
                className='w-full rounded-md px-2 py-2 bg-[#162626] text-white border border-[#1e2e2e]'
                value={frequency}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e) => setFrequency(e.target.value as any)}
              >
                <option value='daily'>Daily</option>
                <option value='weekly'>Weekly</option>
                <option value='monthly'>Monthly</option>
              </select>
            </div>
            <div className='flex-1'>
              <label className='block text-sm mb-1 text-white'>Target</label>
              <input
                type='number'
                min={1}
                className='w-full rounded-md px-2 py-2 bg-[#162626] text-white border border-[#1e2e2e]'
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                required
              />
            </div>
          </div>
          <div className='flex justify-end gap-2 mt-2'>
            <DialogClose asChild>
              <button
                type='button'
                className='px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600'
                onClick={onClose}
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type='submit'
              className='px-4 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700'
            >
              Create
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
