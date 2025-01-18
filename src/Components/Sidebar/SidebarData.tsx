import React from 'react';
import './SidebarData.css';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as CgIcons from "react-icons/cg";
import * as GiIcons from "react-icons/gi";
import * as MdIcons from "react-icons/md";
import * as HiIcons from "react-icons/hi";

export const SidebarData = [
    {
        title: 'My profile',
        path: '/MyProfile',
        icon : <CgIcons.CgProfile />,
        className: 'nav-text'
    },
    {
        title: 'Notifications',
        path: '/Notifications',
        icon: <IoIcons.IoIosNotifications />,
        className: 'nav-text'
    },
    {
        title: 'My trips',
        path: '/MyTrips',
        icon: <IoIcons.IoIosPaper />,
        className: 'nav-text'
    },
    {
        title: 'Create Trip',
        path: '/CreateTrip',
        icon: <IoIcons.IoIosCreate />,
        className: 'nav-text'
    },
    {
        title: 'Manage Users',
        path: '/AdminPage',
        icon: <MdIcons.MdOutlineAdminPanelSettings />,
        className: 'nav-text',
        roles: ['admin']
    },
];