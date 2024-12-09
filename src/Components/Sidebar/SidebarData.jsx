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
        // icon: profileImage ? (
        // <img
        //     src={profileImage}
        //     alt="Profile"
        //     className="profile-icon"
        // />
        // ) : (
        //     <CgIcons.CgProfile />
        // ),
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
        path: '/CreatTrip',
        icon: <IoIcons.IoIosCreate />,
        className: 'nav-text'
    },
    {
        title: 'My Contributions',
        path: '/MyContributions',
        icon: <GiIcons.GiTakeMyMoney />,
        className: 'nav-text'
    },
    {
        title: 'Generate Report.pdf',
        path: '/GenerateReport',
        icon: <HiIcons.HiOutlineDocumentReport />,
        className: 'nav-text'
    },
    {
        title: 'Trip History',
        path: '/TripHistory',
        icon: <AiIcons.AiOutlineHistory />,
        className: 'nav-text'
    },
    {
        title: 'Manage Users',
        path: '/ManageUsers_admin',
        icon: <MdIcons.MdOutlineAdminPanelSettings />,
        className: 'nav-text'
    },
    {
        title: 'Settings',
        path: '/Settings',
        icon: <IoIcons.IoIosSettings />,
        className: 'nav-text'
    }
];