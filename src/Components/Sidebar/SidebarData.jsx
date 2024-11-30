import React from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as CgIcons from "react-icons/cg";
import * as GiIcons from "react-icons/gi";
import * as MdIcons from "react-icons/md";

export const SidebarData = [
    {
        title: 'My profile',
        path: '/',
        icon: profileImage ? (
        <img
            src={profileImage}
            alt="Profile"
            className="profile-icon"
        />
        ) : (
            <CgIcons.CgProfile />
        ),
        className: 'profile-text'
    },
    {
        title: 'Notifications',
        path: '/Notifications',
        icon: <IoIcons.IoIosNotifications />,
        className: 'notification'
    },
    {
        title: 'My trips',
        path: '/MyTrips',
        icon: <IoIcons.IoIosPaper />,
        className: 'my-trips'
    },
    {
        title: 'Create Trip',
        path: '/CreatTrip',
        icon: <IoIcons.IoIosCreate />,
        className: 'create-trip'
    },
    {
        title: 'My Contributions',
        path: '/MyContributions',
        icon: <GiIcons.GiTakeMyMoney />,
        className: 'my-contributions'
    },
    {
        title: 'Generate Report.pdf',
        path: '/GenerateReport',
        icon: <GiIcons.GiTakeMyMoney />,
        className: 'generate-report'
    },
    {
        title: 'Trip History',
        path: '/TripHistory',
        icon: <AiIcons.AiOutlineHistory />,
        className: 'trip-history'
    },
    {
        title: 'Manage Users',
        path: '/ManageUsers_admin',
        icon: <MdIcons.MdOutlineAdminPanelSettings />,
        className: 'manage-users'
    },
]