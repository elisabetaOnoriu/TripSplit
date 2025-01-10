import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import logo from '../../assets/logo-black.png'; 

const Home = () => {

  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="welcome-content">
        <h1 className='title_home'>Welcome to TripSplit!</h1>
        <p className='text_home'>
          Plan, track, and share your travel expenses effortlessly with TripSplit. Whether
          you're traveling with friends, family, or solo, our app makes splitting costs
          and generating reports easier than ever.
        </p>
        <div className="feature-list">
          <h3>What can you do with TripSplit?</h3>
          <ul>
            <li>🗓️ Create and manage trips.</li>
            <li>👥 Add participants and share expenses.</li>
            <li>💰 Track and categorize all your expenses.</li>
            <li>📊 Generate detailed reports for personal and group expenses.</li>
          </ul>
        </div>
        <button className="explore-btn" onClick={() => navigate('/About')} >Explore Now</button>
      </div>
    </div>
  );
};

export default Home;