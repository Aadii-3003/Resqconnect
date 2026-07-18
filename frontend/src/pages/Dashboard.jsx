import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Droplet, ToggleLeft, ToggleRight } from 'lucide-react';

function Dashboard() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [myRequests, setMyRequests] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        API.get('/auth/me').then((res) => setProfile(res.data));
        API.get('/requests/mine').then((res) => setMyRequests(res.data));
    }, []);

    const toggleAvailability = async () => {
        try {
            const res = await API.patch('/auth/availability', {
                isAvailable: !profile.isAvailable,
            });
            setProfile(res.data);
            setMessage(res.data.isAvailable ? 'You are now marked as available.' : 'You are now marked as unavailable.');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) {
        return (
            <div className="page">
                <div className="card">
                    <h2>You're not logged in</h2>
                    <p className="card-subtitle">Please log in to view your dashboard.</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return <div className="page"><p>Loading...</p></div>;
    }

    return (
        <div className="results-page">
            <div className="card dashboard-header">
                <div>
                    <h2>Welcome, {profile.name}</h2>
                    <p className="card-subtitle">{profile.email}</p>
                </div>
                <div className="profile-meta">
                    <span className="badge"><Droplet size={13} style={{ marginRight: 4 }} />{profile.bloodGroup || 'N/A'}</span>
                    <span className="profile-city"><MapPin size={14} /> {profile.city || 'N/A'}</span>
                </div>
            </div>

            {profile.role === 'donor' && (
                <div className="card availability-card">
                    <div>
                        <strong>Donor availability</strong>
                        <p className="card-subtitle" style={{ margin: 0 }}>
                            {profile.isAvailable ? 'You are visible to people searching for donors.' : 'You are hidden from donor search results.'}
                        </p>
                    </div>
                    <button className="toggle-btn" onClick={toggleAvailability}>
                        {profile.isAvailable ? <ToggleRight size={28} color="#2F7D5E" /> : <ToggleLeft size={28} color="#94A3B8" />}
                    </button>
                </div>
            )}

            {message && <p className="message">{message}</p>}

            <h2 style={{ margin: '32px 0 12px' }}>Your requests</h2>
            {myRequests.length === 0 && <p className="card-subtitle">You haven't created any requests yet.</p>}

            <ul className="result-list">
                {myRequests.map((req) => (
                    <li key={req._id} className={`result-card urgency-${req.urgency}`}>
                        <span className="badge">{req.bloodGroup}</span>
                        <div className="result-info">
                            <strong>{req.hospitalName}</strong>
                            <span>{req.city}</span>
                        </div>
                        <div className="request-meta">
                            <span className={`status-tag status-${req.status}`}>{req.status}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;