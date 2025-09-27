import Sidebar from './Sidebar';
import { Outlet } from 'react-router';

const DashboardLayout = () => {
  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <main className='w-full p-5 pl-8'>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
