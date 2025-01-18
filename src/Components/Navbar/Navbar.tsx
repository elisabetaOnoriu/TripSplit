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
import toggle_light from '../../assets/day.png';
import toggle_dark from '../../assets/night.png';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth';
import { useAppSelector } from '../../features/store';
import { useIsUserAdminQuery } from '../../features/api';
import { toggleTheme } from '../../features/theme';

const Navbar = () => {
  const theme = useAppSelector(state => state.theme.theme);
  const userId = useAppSelector(state => state.auth.userId);
  const { data: isAdminResponse, isLoading, isError } = useIsUserAdminQuery(userId!);
  const [sidebar, setSidebar] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showSidebar = () => setSidebar(!sidebar);

  const hideSidebar = () => {console.log('Hiding sidebar'); setSidebar(false)};

  const visibleSidebarItems = !isLoading && isAdminResponse !== undefined
  ? SidebarData.filter((item) => {
      if (!item.roles) return true;

      const isAdminItemVisible = isAdminResponse.isAdmin && item.roles.includes('admin');

      return isAdminItemVisible;
    })
  : [];
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading user data.</div>;
  }

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
          <ul className="nav-elements">
            <li onClick={() => navigate('/home')}>Home</li>
            <li onClick={() => navigate('../About')}>About</li>
            <li onClick={() => navigate('../Contact')}>Contact</li>
          </ul>
          
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
            {visibleSidebarItems.map((item, index) => (
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
