import React from 'react';
import MainNews from '../components/MainNews';
import OtherNews from '../components/OtherNews';

// import { useAppContext } from './AppContext';

const Home = React.memo(() => {
  // const { isAuth } = useAppContext();

  return (
    <div className='home'>
      <h1>THE BLOG</h1>
      <div className="cardContainer">
        <MainNews  />
        <OtherNews  />
      </div>
    </div>
  );
});

export default Home;
