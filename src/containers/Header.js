import { themeChange } from 'theme-change'
import React, {  useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import BellIcon  from '@heroicons/react/24/outline/BellIcon'
import Bars3Icon  from '@heroicons/react/24/outline/Bars3Icon'
import MoonIcon from '@heroicons/react/24/outline/MoonIcon'
import SunIcon from '@heroicons/react/24/outline/SunIcon'
import { openRightDrawer } from '../features/common/rightDrawerSlice';
import { RIGHT_DRAWER_TYPES } from '../utils/globalConstantUtil'

import { Link, useLocation } from 'react-router-dom'
// 1. 👇 We MUST import your sidebar routes so this file knows what they are!
import routes from '../routes/sidebar' 

function Header(){
    const location = useLocation() // 2. Reads the current browser URL
    const dispatch = useDispatch()
    const {noOfNotifications} = useSelector(state => state.header)
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme"))
    
    // 3. We will handle the page title locally right here!
    const [pageTitle, setPageTitle] = useState("Dashboard")

    useEffect(() => {
        themeChange(false)
        if(currentTheme === null){
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ) {
                setCurrentTheme("dark")
            } else {
                setCurrentTheme("light")
            }
        }
        // 👆 false parameter is required for react project
    }, [])

    // 4. 👇 This scans your sidebar.js file whenever the URL changes!
    useEffect(() => {
        // Find if the current browser URL matches any path in your sidebar
        const currentRoute = routes.find(route => route.path === location.pathname);
        
        if (currentRoute) {
            setPageTitle(currentRoute.name);
        } else {
            // Fallback just in case a match isn't found
            setPageTitle("Project"); 
        }
    }, [location.pathname]); // Runs every time the user clicks a new page


    // Opening right sidebar for notification
    const openNotification = () => {
        dispatch(openRightDrawer({header : "Notifications", bodyType : RIGHT_DRAWER_TYPES.NOTIFICATION}))
    }

    function logoutUser(){
        localStorage.clear();
        window.location.href = '/'
    }

    return(
        <>
            <div className="navbar sticky top-0 bg-base-100 z-10 shadow-md">

                {/* Menu toggle for mobile view or small screen */}
                <div className="flex-1">
                    <label htmlFor="left-sidebar-drawer" className="btn btn-primary drawer-button lg:hidden">
                        <Bars3Icon className="h-5 inline-block w-5"/>
                    </label>
                    {/* 👇 This renders the calculated title! */}
                    <h1 className="text-2xl font-semibold ml-2">{pageTitle}</h1>
                </div>

                <div className="flex-none">
                    {/* Light and dark theme selection toggle */}
                    <label className="swap">
                        <input type="checkbox"/>
                        <MoonIcon data-set-theme="dark" data-act-class="ACTIVECLASS" className={"fill-current w-6 h-6 "+(currentTheme === "light" ? "swap-on" : "swap-off")} />
                        <SunIcon data-set-theme="light" data-act-class="ACTIVECLASS" className={"fill-current w-6 h-6 "+(currentTheme === "dark" ? "swap-on" : "swap-off")}/>
                    </label>

                    {/* Notification icon */}
                    <button className="btn btn-ghost ml-4 btn-circle" onClick={() => openNotification()}>
                        <div className="indicator">
                            <BellIcon className="h-6 w-6"/>
                            {noOfNotifications > 0 ? <span className="indicator-item badge badge-secondary badge-sm">{noOfNotifications}</span> : null }
                        </div>
                    </button>

                    {/* Profile icon, opening menu on click */}
                    <div className="dropdown dropdown-end ml-4">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img src="https://i.pravatar.cc/300" alt="profile" />
                            </div>
                        </label>
                        <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                            <li className="justify-between">
                                <Link to="/app/profile-settings">Profile Settings</Link>
                        
                            </li>
                            <li className=''><Link to="/app/bill-history">Bill History</Link></li>
                            <div className="divider mt-0 mb-0"></div>
                            <li><a onClick={logoutUser}>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;