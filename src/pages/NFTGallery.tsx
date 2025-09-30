import DashboardPageLayout from '@/components/dashboard/layout';
import { BracketsIcon, Lock } from 'lucide-react';

// Sample NFT data with descriptions and working images
const nftList = [
  {
    id: 1,
    name: 'Momentum Genesis',
    image:
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    description: 'Sign up and start your first habit.',
  },
  {
    id: 2,
    name: '3-Day Streak',
    image:
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    description: 'Keep a streak for 3 days.',
  },
  {
    id: 3,
    name: '5-Day Streak',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    description: 'Keep a streak for 5 days.',
  },
  {
    id: 4,
    name: 'Early Riser',
    image:
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80',
    description: 'Complete a habit before 7am for 3 days.',
  },
  {
    id: 5,
    name: 'Consistency King',
    image:
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    description: 'Complete any habit 10 times.',
  },
  {
    id: 6,
    name: 'Night Owl',
    image:
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    description: 'Complete a habit after 10pm for 5 days.',
  },
  {
    id: 7,
    name: 'Streak Master',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    description: 'Keep a streak for 14 days.',
  },
  {
    id: 8,
    name: 'XP Rookie',
    image:
      'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
    description: 'Earn 100 XP.',
  },
  {
    id: 9,
    name: 'XP Pro',
    image:
      'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
    description: 'Earn 500 XP.',
  },
  {
    id: 10,
    name: 'XP Legend',
    image:
      'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
    description: 'Earn 1000 XP.',
  },
];

// Example: User owns NFTs with id 1, 2, 4
const userNFTs = [1, 2, 4, 8];

const NFTGallery = () => {
  return (
    <DashboardPageLayout
      header={{
        title: 'Streak: 2 days🔥',
        description: 'XP:250⚡',
        icon: BracketsIcon,
      }}
    >
      <div className='flex items-center justify-between mb-2'>
        <h2 className='text-xl lg:text-3xl font-display'>NFT Gallery</h2>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-6'>
        {nftList.map((nft) => {
          const owned = userNFTs.includes(nft.id);
          return (
            <div
              key={nft.id}
              className='relative rounded-xl overflow-hidden shadow-lg bg-[#162626] border border-[#1e2e2e] flex flex-col items-center'
            >
              <img
                src={nft.image}
                alt={nft.name}
                className={`w-full h-40 object-cover transition-all duration-300 ${
                  owned ? '' : 'blur-sm grayscale brightness-75'
                }`}
              />
              {!owned && (
                <div className='absolute inset-0 flex flex-col items-center justify-center bg-black/50'>
                  <Lock className='w-10 h-10 text-white mb-2' />
                  <span className='text-white font-bold text-lg'>Locked</span>
                </div>
              )}
              <div className='w-full px-3 py-2 bg-[#101c1c] text-center'>
                <span
                  className={`font-semibold text-base ${
                    owned ? 'text-green-300' : 'text-gray-400'
                  }`}
                >
                  {nft.name}
                </span>
                <div className='text-xs text-muted-foreground mt-1'>
                  {nft.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardPageLayout>
  );
};

export default NFTGallery;
