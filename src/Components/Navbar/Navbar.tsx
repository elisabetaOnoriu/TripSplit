import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from '../Sidebar/SidebarData';
import './Navbar.css';

import logo_light from '../../assets/logo-white.png';
import logo_dark from '../../assets/logo-black.png';
import search_icon_light from '../../assets/search-w.png';
import search_icon_dark from '../../assets/search-b.png';
import toggle_light from '../../assets/day.png';
import toggle_dark from '../../assets/night.png';

const Navbar = ({ theme, setTheme }) => {
  const [sidebar, setSidebar] = useState(false);

  const toggle_mode = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light');
  };

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{color: theme == 'light' ? 'black' : 'white' }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
          <img
            src={theme === 'light' ? logo_dark : logo_light}
            alt=""
            className="logo"
          />
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
            <li>Help</li>
          </ul>
          <div className="search-box">
            <input type="text" placeholder="Search" />
            <img
              src={theme === 'light' ? search_icon_light : search_icon_dark}
              alt=""
              className="search-icon"
            />
          </div>
          <img
            onClick={toggle_mode}
            src={theme === 'light' ? toggle_dark : toggle_light}
            alt=""
            className="toggle-icon"
          />
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose onClick={showSidebar} />
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
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
};

export default Navbar;