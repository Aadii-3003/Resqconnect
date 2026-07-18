import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';

function AdminPanel() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [tab, setTab] = useState('users');

    useEffect(() => {
        if (user?.role === 'admin') {
            API.get('/admin/users').then((res) => setUsers(res.data));
            API.get('/requests').then((res) => setRequests(res.data));
        }
    }, [user]);

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete this user permanently?')) return;
        try {
            await API.delete(`/admin/users/${id}`);
            setUsers((prev) => prev.filter((u) => u._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteRequest = async (id) => {
        if (!window.confirm('Delete this request permanently?')) return;
        try {
            await API.delete(`/admin/requests/${id}`);
            setRequests((prev) => prev.filter((r) => r._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) {
        return (
            <div className="page">
                <div className="card">
                    <h2>Not logged in</h2>
                    <p className="card-subtitle">Please log in to continue.</p>
                </div>
            </div>
        );
    }

    if (user.role !== 'admin') {
        return (
            <div className="page">
                <div className="card">
                    <h2>Access denied</h2>
                    <p className="card-subtitle">This page is for administrators only.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="results-page">
            <div className="card">
                <h2>Admin panel</h2>
                <p className="card-subtitle">Manage users and requests</p>
                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${tab === 'users' ? 'tab-active' : ''}`}
                        onClick={() => setTab('users')}
                    >
                        Users ({users.length})
                    </button>
                    <button
                        className={`tab-btn ${tab === 'requests' ? 'tab-active' : ''}`}
                        onClick={() => setTab('requests')}
                    >
                        Requests ({requests.length})
                    </button>
                </div>
            </div>

            {tab === 'users' && (
                <ul className="result-list">
                    {users.map((u) => (
                        <li key={u._id} className="result-card">
                            <span className="badge">{u.bloodGroup || u.role}</span>
                            <div className="result-info">
                                <strong>{u.name} {u.role === 'admin' && '(admin)'}</strong>
                                <span>{u.email} · {u.city || 'No city'}</span>
                            </div>
                            <div className="request-meta">
                                <button className="icon-btn-danger" onClick={() => handleDeleteUser(u._id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {tab === 'requests' && (
                <ul className="result-list">
                    {requests.map((r) => (
                        <li key={r._id} className="result-card">
                            <span className="badge">{r.bloodGroup}</span>
                            <div className="result-info">
                                <strong>{r.hospitalName}</strong>
                                <span>{r.city} · {r.status}</span>
                            </div>
                            <div className="request-meta">
                                <button className="icon-btn-danger" onClick={() => handleDeleteRequest(r._id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AdminPanel;