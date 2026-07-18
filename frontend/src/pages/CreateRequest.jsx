import { useState } from 'react';
import API from '../api/axios';

function CreateRequest() {
    const [formData, setFormData] = useState({
        bloodGroup: '',
        hospitalName: '',
        city: '',
        urgency: 'medium',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/requests', formData);
            setMessage('Request created successfully!');
            console.log(res.data);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Something went wrong. Are you logged in?');
        }
    };

    return (
        <div className="page">
            <div className="card">
                <h2>Create emergency request</h2>
                <p className="card-subtitle">Notify nearby donors instantly</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Blood group needed</label>
                        <input name="bloodGroup" placeholder="e.g. O+" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Hospital name</label>
                        <input name="hospitalName" placeholder="e.g. City Hospital" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>City</label>
                        <input name="city" placeholder="e.g. Nashik" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Urgency</label>
                        <select name="urgency" onChange={handleChange}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <button type="submit">Submit request</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}

export default CreateRequest;