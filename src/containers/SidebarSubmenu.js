import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';

function SidebarSubmenu({ submenu, name, icon: IconComponent }) {
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(false);

    // Keep the submenu open if the user is currently on one of its pages
    useEffect(() => {
        if (submenu.some(m => m.path === location.pathname)) {
            setIsExpanded(true);
        }
    }, [location.pathname, submenu]);

    return (
        <div className="flex flex-col">
            {/* Main Collapsible Menu Header */}
            <div className="w-full block" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex justify-between items-center cursor-pointer py-2 px-4 hover:bg-base-200 rounded-lg">
                    <span>
                        {/* Render the parent icon as a component */}
                        {IconComponent && <IconComponent className="w-5 h-5 inline mr-2" />} 
                        {name}
                    </span>
                    <ChevronDownIcon className={`w-5 h-5 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {/* Submenu Items Dropdown */}
            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
                <ul className="menu menu-compact pl-6">
                    {
                        submenu.map((m, k) => {
                            // 👇 THIS IS THE CRITICAL FIX: Treat the sub-icon as a component! 👇
                            const SubIconComponent = m.icon;

                            return (
                                <li key={k}>
                                    <NavLink
                                        end
                                        to={m.path}
                                        className={({ isActive }) => `${isActive ? 'font-semibold bg-base-200 ' : 'font-normal'}`}
                                    >
                                        {/* Render the child icon as a component safely */}
                                        {SubIconComponent && <SubIconComponent className="w-5 h-5 inline" />} {m.name}
                                    </NavLink>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        </div>
    );
}

export default SidebarSubmenu;