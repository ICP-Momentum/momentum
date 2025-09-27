import { Link } from 'react-router';

const Home = () => {
  return (
    <div>
      <h1 className='text-2xl'>Home</h1>
      <Link to='/connect'>Connect page</Link>
    </div>
  );
};

export default Home;
