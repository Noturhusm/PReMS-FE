const ACCENT_STYLES = {
    blue: {
        icon: "bg-sky-50 text-sky-600",
        value: "text-sky-600",
        badge: "bg-sky-50 text-sky-700"
    },
    indigo: {
        icon: "bg-indigo-50 text-indigo-600",
        value: "text-indigo-600",
        badge: "bg-indigo-50 text-indigo-700"
    },
    amber: {
        icon: "bg-amber-50 text-amber-600",
        value: "text-amber-600",
        badge: "bg-amber-50 text-amber-700"
    },
    emerald: {
        icon: "bg-emerald-50 text-emerald-600",
        value: "text-emerald-600",
        badge: "bg-emerald-50 text-emerald-700"
    }
}

function DashboardStats({ title, icon, value, trend, description, accent = "blue" }) {
    const styles = ACCENT_STYLES[accent] || ACCENT_STYLES.blue

    return (
        <div className="rounded-2xl border border-slate-100 bg-base-100 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {title}
                    </p>
                    <p className={`mt-3 text-3xl font-bold ${styles.value}`}>
                        {value}
                    </p>
                </div>

                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${styles.icon}`}>
                    {icon}
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badge}`}>
                    {trend}
                </span>
                <span className="text-slate-500">{description}</span>
            </div>
        </div>
    )
}

export default DashboardStats
