import { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', formData);
            login(res.data.user, res.data.token);
            setMessage(`Welcome back, ${res.data.user.name}!`);
            setTimeout(() => navigate('/'), 800);
            console.log(res.data);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="page">
            <div className="card">
                <h2>Welcome back</h2>
                <p className="card-subtitle">Log in to your account</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" type="email" placeholder="you@example.com" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
                    </div>
                    <button type="submit">Login</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}

export default Login;