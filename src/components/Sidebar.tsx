import { Link, NavLink } from 'react-router';
import logo from '/momentum-logo.png';
import {
  ChartColumn,
  House,
  Images,
  Settings,
  SquareCheckBig,
} from 'lucide-react';

const navLinks = [
  {
    name: 'Dashboard',
    link: '/dashboard',
    icon: <House strokeWidth={1.5} />,
  },
  {
    name: 'Habits',
    link: '/dashboard/habits',
    icon: <SquareCheckBig strokeWidth={1.5} />,
  },
  {
    name: 'Gallery',
    link: '/dashboard/gallery',
    icon: <Images strokeWidth={1.5} />,
  },
  {
    name: 'Leaderboard',
    link: '/dashboard/leaderboard',
    icon: <ChartColumn strokeWidth={1.5} />,
  },
  {
    name: 'Settings',
    link: '/dashboard/settings',
    icon: <Settings strokeWidth={1.5} />,
  },
];

const Sidebar = () => {
  return (
    <aside className='flex flex-col gap-6 py-6 px-5 bg-primary w-60'>
      <Link to='/'>
        <img src={logo} alt='Logo' className='mx-auto w-2/3' />
      </Link>
      <nav className='w-full flex flex-col gap-5'>
        {navLinks.map(({ icon, link, name }) => (
          <NavLink
            end={link == '/dashboard' ? true : false}
            to={link}
            className={({ isActive }) =>
              `border border-secondary py-1 pl-1.25 pr-2 text-2xl rounded-lg flex gap-2.5 items-center ${
                isActive
                  ? 'bg-secondary text-white font-semibold'
                  : 'bg-transparent text-secondary'
              }`
            }
          >
            {icon}
            <span className='!text-xl'>{name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
