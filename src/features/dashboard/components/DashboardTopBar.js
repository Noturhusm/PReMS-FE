import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import Datepicker from "react-tailwindcss-datepicker"
import { useState } from "react"

function DashboardTopBar({ updateDashboardPeriod }) {
    const [dateValue, setDateValue] = useState({
        startDate: new Date(),
        endDate: new Date()
    })

    const handleDatePickerValueChange = (newValue) => {
        setDateValue(newValue)
        updateDashboardPeriod(newValue)
    }

    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">Choose date</p>
                <div className="relative w-full sm:w-80">
                    <CalendarDaysIcon className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Datepicker
                        containerClassName="w-full"
                        value={dateValue}
                        theme={"light"}
                        inputClassName="input input-bordered w-full rounded-2xl border-slate-200 bg-base-100 pl-11 pr-4 text-sm font-medium text-slate-600 shadow-sm"
                        popoverDirection={"down"}
                        toggleClassName="hidden"
                        onChange={handleDatePickerValueChange}
                        showShortcuts={true}
                        primaryColor={"blue"}
                    />
                </div>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-100 lg:self-auto">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                Live analytics snapshot
            </div>
        </div>
    )
}

export default DashboardTopBar
