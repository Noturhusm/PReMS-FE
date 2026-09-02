import { useDispatch } from 'react-redux'
import UserPlusIcon from '@heroicons/react/24/outline/UserPlusIcon'
import BanknotesIcon from '@heroicons/react/24/outline/BanknotesIcon'
import ClipboardDocumentCheckIcon from '@heroicons/react/24/outline/ClipboardDocumentCheckIcon'
import UsersIcon from '@heroicons/react/24/outline/UsersIcon'
import DashboardStats from './components/DashboardStats'
import DashboardTopBar from './components/DashboardTopBar'
import LineChart from './components/LineChart'
import BarChart from './components/BarChart'
import { showNotification } from '../common/headerSlice'

function Dashboard() {
    const dispatch = useDispatch()

    const statsData = [
        {
            title: "New Users",
            value: "34.7k",
            trend: "+12.8%",
            description: "from last month",
            accent: "blue",
            icon: <UserPlusIcon className="h-6 w-6" />
        },
        {
            title: "Total Sales",
            value: "$34,545",
            trend: "+8.4%",
            description: "current month",
            accent: "indigo",
            icon: <BanknotesIcon className="h-6 w-6" />
        },
        {
            title: "Pending Project",
            value: "450",
            trend: "18 urgent",
            description: "awaiting completion",
            accent: "amber",
            icon: <ClipboardDocumentCheckIcon className="h-6 w-6" />
        },
        {
            title: "Active Users",
            value: "5.6k",
            trend: "+6.1%",
            description: "engaged this week",
            accent: "emerald",
            icon: <UsersIcon className="h-6 w-6" />
        }
    ]

    const updateDashboardPeriod = (newRange) => {
        if (!newRange?.startDate || !newRange?.endDate) {
            return
        }

        dispatch(showNotification({
            message: `Dashboard updated for ${newRange.startDate} to ${newRange.endDate}`,
            status: 1
        }))
    }

    return (
        <div className="space-y-6 pb-4">
            <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {statsData.map((item) => (
                    <DashboardStats key={item.title} {...item} />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <LineChart />
                <BarChart />
            </div>
        </div>
    )
}

export default Dashboard
