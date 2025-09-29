const ConnectWallet = () => {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <main className='flex flex-col gap-10 sm:w-2/3 w-5/6 lg:w-auto'>
        <img
          src='/momentum-logo.png'
          alt='Logo'
          className='w-3/5 md:w-1/2 mx-auto -mt-10'
        />
        <h1 className='text-2xl md:text-3xl font-medium text-white -mt-14 sm:-mt-20 text-center'>
          Track Habits. Build Consistency. Win Trades
        </h1>
        <button className='w-full bg-secondary text-white py-2.5 text-2xl md:text-3xl rounded-xl mt-5 sm:mt-10 cursor-pointer'>
          Connect Wallet
        </button>
      </main>
    </div>
  );
};

export default ConnectWallet;
