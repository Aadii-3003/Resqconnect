import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import API from '../api/axios';

// Fix default marker icon paths (a common Leaflet + bundler quirk)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function SearchDonors() {
    const [bloodGroup, setBloodGroup] = useState('');
    const [city, setCity] = useState('');
    const [donors, setDonors] = useState([]);
    const [message, setMessage] = useState('');
    const [myLocation, setMyLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState('');

    const useMyLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus('Geolocation not supported by your browser.');
            return;
        }
        setLocationStatus('Requesting location...');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setMyLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                setLocationStatus('Using your current location ✓');
            },
            () => setLocationStatus('Location permission denied.')
        );
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const params = { bloodGroup, city };
            if (myLocation) {
                params.latitude = myLocation.latitude;
                params.longitude = myLocation.longitude;
            }
            const res = await API.get('/donors', { params });
            setDonors(res.data);
            setMessage(res.data.length === 0 ? 'No donors found.' : '');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Something went wrong');
        }
    };

    const donorsWithLocation = donors.filter(
        (d) => d.location?.coordinates && (d.location.coordinates[0] !== 0 || d.location.coordinates[1] !== 0)
    );

    const mapCenter = myLocation
        ? [myLocation.latitude, myLocation.longitude]
        : donorsWithLocation[0]
            ? [donorsWithLocation[0].location.coordinates[1], donorsWithLocation[0].location.coordinates[0]]
            : [20.5937, 78.9629]; // fallback: center of India

    return (
        <div className="results-page">
            <div className="card">
                <h2>Find donors</h2>
                <p className="card-subtitle">Search by blood group and city, or use your location for nearest matches</p>
                <form onSubmit={handleSearch}>
                    <div className="form-group">
                        <label>Blood group</label>
                        <input
                            placeholder="e.g. O+"
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>City</label>
                        <input
                            placeholder="e.g. Nashik"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn-secondary-full" onClick={useMyLocation}>
                            📍 Use my location for nearest matches
                        </button>
                        {locationStatus && <p className="card-subtitle" style={{ marginTop: 8 }}>{locationStatus}</p>}
                    </div>
                    <button type="submit">Search</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>

            {donorsWithLocation.length > 0 && (
                <div className="map-wrapper">
                    <MapContainer center={mapCenter} zoom={11} style={{ height: '350px', width: '100%', borderRadius: '12px' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap contributors'
                        />
                        {myLocation && (
                            <Marker position={[myLocation.latitude, myLocation.longitude]}>
                                <Popup>Your location</Popup>
                            </Marker>
                        )}
                        {donorsWithLocation.map((donor) => (
                            <Marker
                                key={donor._id}
                                position={[donor.location.coordinates[1], donor.location.coordinates[0]]}
                            >
                                <Popup>
                                    <strong>{donor.name}</strong><br />
                                    {donor.bloodGroup} · {donor.city}
                                    {donor.distanceKm && <><br />{donor.distanceKm} km away</>}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            )}

            <ul className="result-list">
                {donors.map((donor) => (
                    <li key={donor._id} className="result-card">
                        <span className="badge">{donor.bloodGroup}</span>
                        <div className="result-info">
                            <strong>{donor.name}</strong>
                            <span>
                                {donor.city}
                                {donor.distanceKm && ` · ${donor.distanceKm} km away`}
                            </span>
                        </div>
                        <div className="request-meta">
                            <a href={`mailto:${donor.email}`} className="small-btn contact-btn">Email</a>
                            {donor.phone && (
                                <a href={`tel:${donor.phone}`} className="small-btn contact-btn">Call</a>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SearchDonors;