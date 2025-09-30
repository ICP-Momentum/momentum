import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import AtomIcon from '../../icons/atom';
import BracketsIcon from '../../icons/brackets';
import ProcessorIcon from '../../icons/proccesor';
import CuteRobotIcon from '../../icons/cute-robot';
import EmailIcon from '../../icons/email';
import GearIcon from '../../icons/gear';
import MonkeyIcon from '../../icons/monkey';
import DotsVerticalIcon from '../../icons/dots-vertical';
import { Bullet } from '@/components/ui/bullet';
import LockIcon from '../../icons/lock';
import { useIsV0 } from '@/lib/ui-context';
import { useAuth } from '@/contexts/auth-context';
import { LogOut, User, Settings } from 'lucide-react';

// Momentum platform navigation data
const data = {
  navMain: [
    {
      title: 'Trading Discipline',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: BracketsIcon,
          isActive: true,
        },
        {
          title: 'Habits',
          url: '/habits',
          icon: AtomIcon,
          isActive: false,
        },
        {
          title: 'NFT Gallery',
          url: '/nft-gallery',
          icon: ProcessorIcon,
          isActive: false,
        },
        {
          title: 'Leaderboard',
          url: '/leaderboard',
          icon: CuteRobotIcon,
          isActive: false,
        },
        {
          title: 'AI Coach',
          url: '/ai-coach',
          icon: EmailIcon,
          isActive: false,
        },
        {
          title: 'Settings',
          url: '/settings',
          icon: GearIcon,
          isActive: false,
        },
      ],
    },
  ],
  desktop: {
    title: 'Trader (Online)',
    status: 'online',
  },
  user: {
    name: 'KRIMSON',
    email: 'krimson@joyco.studio',
    avatar: '/avatars/user_krimson.png',
  },
};

export function DashboardSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const isV0 = useIsV0();
  const { user, disconnect } = useAuth();

  const handleLogout = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Use real user data if available, fallback to mock data
  const displayUser = user ? {
    name: user.username,
    email: user.email,
    avatar: user.profilePicture ? URL.createObjectURL(new Blob([user.profilePicture])) : data.user.avatar,
  } : data.user;

  return (
    <Sidebar {...props} className={cn('py-sides', className)}>
      <SidebarHeader className="rounded-t-lg flex gap-3 flex-row rounded-b-none">
        <div className="flex overflow-clip size-12 shrink-0 items-center justify-center rounded transition-colors">
          <img src="/momentum-logo.png" alt="Momentum" className="size-10 object-contain" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="text-2xl font-display">MOMENTUM</span>
          <span className="text-xs uppercase">On-Chain Habit Tracker</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group, i) => (
          <SidebarGroup className={cn(i === 0 && 'rounded-t-none')} key={group.title}>
            <SidebarGroupLabel>
              <Bullet className="mr-2" />
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title} className={cn(isV0 && 'pointer-events-none')}>
                    <SidebarMenuButton
                      asChild={true}
                      isActive={item.isActive}
                      disabled={false}
                      className={cn(
                        'disabled:cursor-not-allowed',
                        (item as any).locked && 'pointer-events-none'
                      )}
                    >
                      {(item as any).locked ? (
                        <div className="flex items-center gap-3 w-full">
                          <item.icon className="size-5" />
                          <span>{item.title}</span>
                        </div>
                      ) : (
                        <a href={item.url}>
                          <item.icon className="size-5" />
                          <span>{item.title}</span>
                        </a>
                      )}
                    </SidebarMenuButton>
                    {(item as any).locked && (
                      <SidebarMenuBadge>
                        <LockIcon className="size-5 block" />
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-0">
        <SidebarGroup>
          <SidebarGroupLabel>
            <Bullet className="mr-2" />
            Trader
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Popover>
                  <PopoverTrigger className="flex gap-0.5 w-full group cursor-pointer">
                    <div className="shrink-0 flex size-14 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground overflow-clip">
                      <img src={displayUser.avatar} alt={displayUser.name} width={120} height={120} />
                    </div>
                    <div className="group/item pl-3 pr-1.5 pt-2 pb-1.5 flex-1 flex bg-sidebar-accent hover:bg-sidebar-accent-active/75 items-center rounded group-data-[state=open]:bg-sidebar-accent-active group-data-[state=open]:hover:bg-sidebar-accent-active group-data-[state=open]:text-sidebar-accent-foreground">
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate text-xl font-display">{displayUser.name}</span>
                        <span className="truncate text-xs uppercase opacity-50 group-hover/item:opacity-100">
                          {displayUser.email}
                        </span>
                      </div>
                      <DotsVerticalIcon className="ml-auto size-4" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-0" side="bottom" align="end" sideOffset={4}>
                    <div className="flex flex-col py-1">
                      <button
                        className="flex items-center px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                        onClick={() => window.location.href = '/settings'}
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Account</span>
                      </button>
                      <button
                        className="flex items-center px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                        onClick={() => window.location.href = '/settings'}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </button>
                      <div className="my-1 h-px bg-border" />
                      <button
                        className="flex items-center px-4 py-2.5 text-sm hover:bg-accent transition-colors text-destructive hover:text-destructive"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
