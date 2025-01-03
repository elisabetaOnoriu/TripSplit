import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from '../Sidebar/SidebarData';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

import logo_light from '../../assets/logo-white.png';
import logo_dark from '../../assets/logo-black.png';
import search_icon_light from '../../assets/search-w.png';
import search_icon_dark from '../../assets/search-b.png';
import toggle_light from '../../assets/day.png';
import toggle_dark from '../../assets/night.png';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth';
import { useAppSelector } from '../../features/store';
import { toggleTheme } from '../../features/theme';

const Navbar = () => {
  const theme = useAppSelector(state => state.theme.theme);
  const [sidebar, setSidebar] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showSidebar = () => setSidebar(!sidebar);

  const hideSidebar = () => {console.log('Hiding sidebar'); setSidebar(false)};

  return (
    <>
      <IconContext.Provider value={{ color: theme === 'light' ? 'black' : 'white' }}>
        <div className='navbar'>
          {!sidebar && (
            <Link to='#' className='menu-bars'>
              <FaIcons.FaBars className='menu-img' onClick={showSidebar} />
            </Link>
          )}
          <img src={theme === 'light' ? logo_dark : logo_light} alt='' className='logo' />
          <ul>
            <li onClick={() => navigate('/home')}>Home</li>
            <li onClick={() => navigate('../About')}>About</li>
            <li>Contact</li>
          </ul>
          <div className='search-box'>
            <input type='text' placeholder='Search' />
            <img src={theme === 'light' ? search_icon_light : search_icon_dark} alt='' className='search-icon' />
          </div>
          <img
            onClick={() => dispatch(toggleTheme())}
            src={theme === 'light' ? toggle_dark : toggle_light}
            alt=''
            className='toggle-icon'
          />
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' >
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
              <AiIcons.AiOutlineClose onClick={hideSidebar} className="close-icon" />
              </Link>
            </li>
            {SidebarData.map((item, index) => (
              <li key={index} className={item.className}>
                <Link to={item.path}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
            <li className='nav-text'>
              <button className='btn' onClick={() => dispatch(logout())}>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
};

export default Navbar;
