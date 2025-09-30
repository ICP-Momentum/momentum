import DashboardPageLayout from '@/components/dashboard/layout';
import { BracketsIcon, User, Camera } from 'lucide-react';

const Settings = () => {
  const user = {
    name: 'KRIMSON',
    avatar: '/avatars/user_krimson.png',
  };

  return (
    <DashboardPageLayout
      header={{
        title: 'Settings',
        description: 'Manage your account, wallet, and app preferences.',
        icon: BracketsIcon,
      }}
    >
      <div className='w-full max-w-5xl mx-auto mt- grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Wallet Section */}
        <section className='bg-[#162626] rounded-xl p-6 border border-[#1e2e2e] flex flex-col gap-4'>
          <h2 className='text-xl font-bold text-green-300 mb-2'>ICP Wallet</h2>
          <div className='flex flex-col gap-3'>
            <div>
              <div className='text-sm text-muted-foreground'>
                Connected Principal
              </div>
              <div className='font-mono text-white'>aaaaa-aa...xyz</div>
            </div>
            <button className='px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition'>
              Change Wallet
            </button>
          </div>
        </section>

        {/* Account Section */}
        <section className='bg-[#162626] rounded-xl p-6 border border-[#1e2e2e] flex flex-col gap-4'>
          <h2 className='text-xl font-bold text-green-300 mb-2'>Account</h2>
          <div className='flex items-center gap-4'>
            <div className='relative'>
              <span className='inline-block rounded-full bg-[#101c1c] border border-[#1e2e2e]'>
                <User className='w-16 h-16 text-green-400' />
              </span>
              <button
                className='absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white rounded-full p-1 border-2 border-[#101c1c] transition'
                title='Change Avatar'
              >
                <Camera className='w-5 h-5' />
              </button>
            </div>
            <div>
              <span className='text-sm text-muted-foreground'>Username</span>
              <div className='font-semibold text-white text-lg'>
                {user.name}
              </div>
            </div>
          </div>
          <button className='px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition w-fit'>
            Disconnect Account
          </button>
        </section>

        {/* Preferences Section */}
        <section className='bg-[#162626] rounded-xl p-6 border border-[#1e2e2e] flex flex-col gap-4'>
          <h2 className='text-xl font-bold text-green-300 mb-2'>Preferences</h2>
          <div className='flex items-center justify-between mb-3'>
            <span className='text-white'>Dark Mode</span>
            <input
              type='checkbox'
              checked
              readOnly
              className='accent-green-500 w-5 h-5'
            />
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-white'>Enable Notifications</span>
            <input
              type='checkbox'
              checked
              readOnly
              className='accent-green-500 w-5 h-5'
            />
          </div>
        </section>

        {/* Security Section */}
        <section className='bg-[#162626] rounded-xl p-6 border border-[#1e2e2e] flex flex-col gap-4'>
          <h2 className='text-xl font-bold text-green-300 mb-2'>Security</h2>
          <div className='flex items-center justify-between'>
            <span className='text-white'>Reset App Data</span>
            <button className='px-4 py-2 rounded-md bg-yellow-600 text-white font-semibold hover:bg-yellow-700 transition'>
              Reset
            </button>
          </div>
        </section>
      </div>
    </DashboardPageLayout>
  );
};

export default Settings;
