import { useEffect, useState } from 'react';
import api from '../../axios';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return window.location.href = "/login";

        api.get("/dashboard")
            .then(resp => {
                setMessage(resp.data.message);
                setUser({ name: localStorage.getItem("name")?.replace(/"/g, "") });
                setLoading(false);
            })
            .catch(err => {
                localStorage.removeItem("token");
                localStorage.removeItem("name");
                window.location.href = "/login";
            });
    }, []);

    const handleLogout = async () => {
        try { await api.post("/logout"); } catch(e){ }
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        window.location.href = "/login";
    }

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center py-10">
            <div className="card w-full max-w-3xl shadow-xl p-6 bg-base-100">
                <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
                <p className="mb-2">Welcome, <strong>{user?.name}</strong></p>
                <p className="mb-4">{message}</p>
                <button onClick={handleLogout} className="btn btn-error">Logout</button>
            </div>
        </div>
    );
}

export default Dashboard;