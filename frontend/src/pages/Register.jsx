import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'donor',
        bloodGroup: '',
        city: '',
        phone: '',
    });
    const [message, setMessage] = useState('');
    const [locationStatus, setLocationStatus] = useState('');
    const [coords, setCoords] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const captureLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus('Geolocation not supported by your browser.');
            return;
        }
        setLocationStatus('Requesting location...');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                setLocationStatus('Location captured ✓');
            },
            () => {
                setLocationStatus('Location permission denied. You can still register without it.');
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, ...(coords || {}) };
            const res = await API.post('/auth/register', payload);
            login(res.data.user, res.data.token);
            setMessage('Registered successfully!');
            setTimeout(() => navigate('/'), 800);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="page">
            <div className="card">
                <h2>Create an account</h2>
                <p className="card-subtitle">Register as a donor or someone in need</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input name="name" placeholder="Your full name" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" type="email" placeholder="you@example.com" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>I am a</label>
                        <select name="role" onChange={handleChange}>
                            <option value="donor">Donor</option>
                            <option value="requester">Requester</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Blood group</label>
                        <input name="bloodGroup" placeholder="e.g. O+" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>City</label>
                        <input name="city" placeholder="e.g. Nashik" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Phone number</label>
                        <input name="phone" placeholder="e.g. 9876543210" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn-secondary-full" onClick={captureLocation}>
                            📍 Share my location (helps donors find you)
                        </button>
                        {locationStatus && <p className="card-subtitle" style={{ marginTop: 8 }}>{locationStatus}</p>}
                    </div>
                    <button type="submit">Register</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}

export default Register;