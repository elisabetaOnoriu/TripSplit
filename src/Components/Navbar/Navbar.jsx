import React from 'react'
import './Navbar.css'
import logo_light from '../../assets/logo-black.png'
import logo_dark from '../../assets/logo-white.png'
import search_icon_light from '../../assets/search-w.png'
import search_icon_dark from '../../assets/search-b.png'
import toggle_light from '../../assets/night.png'
import toggle_dark from '../../assets/day.png'

const Navbar = () => {
  return (
    <div className ='navbar'>
        <img src={logo_light} alt="" className = 'logo'/>

        <ul>
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
            <li>Help</li>
        </ul>

        <div className = 'search-box'>
            <input type="text" placeholder='Search'/>
            <img src={search_icon_light} alt="" />
        </div>

        <img src={toggle_light} alt="" className ='toggle-icon' />
    </div>
  )
}

export default Navbar