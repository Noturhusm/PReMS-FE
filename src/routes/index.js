// All components mapping with path for internal routes

import { lazy } from 'react'

//Protected pages 
const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const Welcome = lazy(() => import('../pages/protected/Welcome'))
const Page404 = lazy(() => import('../pages/protected/404'))
const Blank = lazy(() => import('../pages/protected/Blank'))
const Charts = lazy(() => import('../pages/protected/Charts'))
const Leads = lazy(() => import('../pages/protected/Leads'))
const ProjectLists = lazy(() => import('../pages/protected/ProjectList'))
const ProjectDetails = lazy(() => import('../pages/protected/ProjectDetails'))
const Integration = lazy(() => import('../pages/protected/Integration'))
const Calendar = lazy(() => import('../pages/protected/Calendar'))
const Team = lazy(() => import('../pages/protected/Team'))
const Transactions = lazy(() => import('../pages/protected/Transactions'))
const Bills = lazy(() => import('../pages/protected/Bills'))
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'))
const Settings = lazy(() => import('../pages/protected/Settings'))
const SystemSettings = lazy(() => import('../pages/protected/SystemSettings'))

//Open pages
const GettingStarted = lazy(() => import('../pages/GettingStarted'))
const DocFeatures = lazy(() => import('../pages/DocFeatures'))
const DocComponents = lazy(() => import('../pages/DocComponents'))


const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/welcome', // the url
    component: Welcome, // view rendered
  },
  {
   path: '/project-details/:id', // This pairs with "/app" to become "/app/project-details"
    component: ProjectDetails,},
  {
    path: '/project', // 
    component: ProjectLists,
  },
  {
    path: '/calendar',
    component: Calendar,
  },
  {
    path: '/analytics', // 👈 This makes clicking "Analytics" in the sidebar work!
    component: Charts,
  },
  {
    path: '/transactions',
    component: Transactions,
  },
  {
    path: '/integration',
    component: Integration,
  },
  {
    path: '/charts',
    component: Charts,
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/blank',
    component: Blank,
  },
  
  // --------------------------------------------------------------------------
  // Settings Submenu Routes (Aligned with your sidebar links)
  // --------------------------------------------------------------------------
  {
    path: '/settings/profile', //  Matches your sidebar link
    component: ProfileSettings,
  },
  {
    path: '/settings/billing', //  Matches your sidebar link
    component: Bills,
  },
  {
    path: '/settings/team', //  Changed from /settings-team to match sidebar
    component: Team,
  },
  {
    path: '/settings/general', //  Matches your sidebar link
    component: Settings,
  },
  {
    path: '/settings/system', //  Changed from /system/settings to /settings/system
    component: SystemSettings,
  },


  // --------------------------------------------------------------------------
  // Settings & Profile Routes
  // --------------------------------------------------------------------------
 // Fix for Profile Settings dropdown
  {
    path: '/profile-settings', 
    component: ProfileSettings,
  },

  // Fix for Bill History dropdown
  {
    path: '/bill-history', 
    component: Bills,
  },

  // Open pages
  {
    path: '/getting-started',
    component: GettingStarted,
  },
  {
    path: '/features',
    component: DocFeatures,
  },
  {
    path: '/components',
    component: DocComponents,
  },
]

export default routes