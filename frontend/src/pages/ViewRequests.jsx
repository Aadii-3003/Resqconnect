import { useState, useEffect } from 'react';
import API from '../api/axios';
import socket from '../api/socket';

const urgencyClass = {
    high: 'urgency-high',
    medium: 'urgency-medium',
    low: 'urgency-low',
};

function ViewRequests() {
    const [requests, setRequests] = useState([]);
    const [toast, setToast] = useState('');
    const [filterUrgency, setFilterUrgency] = useState('all');
    const [filterCity, setFilterCity] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        API.get('/requests').then((res) => setRequests(res.data));

        socket.on('newRequest', (newReq) => {
            setRequests((prev) => [newReq, ...prev]);
            setToast(`New ${newReq.bloodGroup} request at ${newReq.hospitalName}`);
            setTimeout(() => setToast(''), 4000);
        });

        return () => {
            socket.off('newRequest');
        };
    }, []);

    const handleFulfill = async (id) => {
        try {
            const res = await API.patch(`/requests/${id}`, { status: 'fulfilled' });
            setRequests((prev) => prev.map((r) => (r._id === id ? res.data : r)));
        } catch (err) {
            console.error(err);
        }
    };

    const visibleRequests = requests
        .filter((req) => filterUrgency === 'all' || req.urgency === filterUrgency)
        .filter((req) => req.city.toLowerCase().includes(filterCity.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortBy === 'urgency') {
                const order = { high: 0, medium: 1, low: 2 };
                return order[a.urgency] - order[b.urgency];
            }
            return 0;
        });

    return (
        <div className="results-page">
            {toast && <div className="toast">{toast}</div>}
            <div className="card">
                <h2>Active requests</h2>
                <p className="card-subtitle">Live emergency blood requests</p>
            </div>

            <div className="card filter-bar">
                <div className="form-group" style={{ margin: 0 }}>
                    <label>Urgency</label>
                    <select value={filterUrgency} onChange={(e) => setFilterUrgency(e.target.value)}>
                        <option value="all">All</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                    <label>City</label>
                    <input
                        placeholder="Filter by city"
                        value={filterCity}
                        onChange={(e) => setFilterCity(e.target.value)}
                    />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                    <label>Sort by</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="urgency">Urgency (high first)</option>
                    </select>
                </div>
            </div>

            <ul className="result-list">
                {visibleRequests.map((req) => (
                    <li key={req._id} className={`result-card ${urgencyClass[req.urgency]}`}>
                        <span className="badge">{req.bloodGroup}</span>
                        <div className="result-info">
                            <strong>{req.hospitalName}</strong>
                            <span>{req.city} · requested by {req.requestedBy?.name || 'Unknown'}</span>
                        </div>
                        <div className="request-meta">
                            <span className={`urgency-tag ${urgencyClass[req.urgency]}`}>{req.urgency}</span>
                            <span className={`status-tag status-${req.status}`}>{req.status}</span>
                            {req.status !== 'fulfilled' && (
                                <button className="small-btn" onClick={() => handleFulfill(req._id)}>Mark fulfilled</button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ViewRequests;