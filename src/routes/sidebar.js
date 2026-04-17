import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon';
import FolderIcon from '@heroicons/react/24/outline/FolderIcon';
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon';
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon';
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon';
import Cog6ToothIcon from '@heroicons/react/24/outline/Cog6ToothIcon';
import UserIcon from '@heroicons/react/24/outline/UserIcon';
import CreditCardIcon from '@heroicons/react/24/outline/CreditCardIcon';
import UsersIcon from '@heroicons/react/24/outline/UsersIcon';
import WrenchScrewdriverIcon from '@heroicons/react/24/outline/WrenchScrewdriverIcon';

const routes = [
  { path: '/app/dashboard', icon: Squares2X2Icon, name: 'Dashboard' },
  { path: '/app/project', icon: FolderIcon, name: 'Project' },
  { path: '/app/transactions', icon: CurrencyDollarIcon, name: 'Transactions' },
  { path: '/app/analytics', icon: ChartBarIcon, name: 'Analytics' },
  { path: '/app/calendar', icon: CalendarDaysIcon, name: 'Calendar' },
  {
    path: '', 
    icon: Cog6ToothIcon, 
    name: 'Settings',
    submenu: [
      { path: '/app/settings/profile', icon: UserIcon, name: 'Profile' },
      { path: '/app/settings/billing', icon: CreditCardIcon, name: 'Billing' },
      { path: '/app/settings/team', icon: UsersIcon, name: 'Team Members' },
      { path: '/app/settings/general', icon: Cog6ToothIcon, name: 'General Settings' },
      { path: '/app/settings/system', icon: WrenchScrewdriverIcon, name: 'System Settings' },
    ]
  },
];

export default routes;