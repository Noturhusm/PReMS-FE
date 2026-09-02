import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import api from '../../axios'
import DashboardContent from '../../features/dashboard'
import { setPageTitle } from '../../features/common/headerSlice'

function InternalPage() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        dispatch(setPageTitle({ title: "Dashboard" }))

        const token = localStorage.getItem("token")
        if (!token) {
            window.location.href = "/login"
            return
        }

        api.get("/dashboard")
            .then(() => setLoading(false))
            .catch(() => {
                localStorage.removeItem("token")
                localStorage.removeItem("name")
                window.location.href = "/login"
            })
    }, [dispatch])

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
    }

    return <DashboardContent />
}

export default InternalPage
