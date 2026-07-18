import { Link } from 'react-router-dom';
import { Search, Bell, HeartPulse, Users, MapPin, ShieldCheck } from 'lucide-react';

function Home() {
    return (
        <div>
            <section className="hero">
                <div className="hero-text">
                    <h1>Every drop counts.<br />Every minute matters.</h1>
                    <p>
                        ResQConnect connects blood donors with patients in real time —
                        because in an emergency, finding the right donor shouldn't take hours.
                    </p>
                    <div className="hero-actions">
                        <Link to="/register" className="btn-primary">Become a donor</Link>
                        <Link to="/requests" className="btn-secondary">View active requests</Link>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="/images/hero.jpg" alt="Blood donation" />
                </div>
            </section>

            <section className="stats-bar">
                <div className="stat">
                    <Users size={22} />
                    <span className="stat-num">500+</span>
                    <span className="stat-label">Registered donors</span>
                </div>
                <div className="stat">
                    <HeartPulse size={22} />
                    <span className="stat-num">120+</span>
                    <span className="stat-label">Lives helped</span>
                </div>
                <div className="stat">
                    <MapPin size={22} />
                    <span className="stat-num">15+</span>
                    <span className="stat-label">Cities covered</span>
                </div>
            </section>

            <section className="how-it-works">
                <h2>How it works</h2>
                <div className="steps">
                    <div className="step">
                        <div className="step-icon"><Search size={20} /></div>
                        <h3>Search</h3>
                        <p>Find available donors nearby by blood group and city, instantly.</p>
                    </div>
                    <div className="step">
                        <div className="step-icon"><Bell size={20} /></div>
                        <h3>Alert</h3>
                        <p>Post an emergency request and notify matching donors in real time.</p>
                    </div>
                    <div className="step">
                        <div className="step-icon"><ShieldCheck size={20} /></div>
                        <h3>Connect</h3>
                        <p>Donors respond, requests get fulfilled, and lives are saved.</p>
                    </div>
                </div>
            </section>

            <section className="about-section">
                <img src="/images/about.jpg" alt="Volunteers" />
                <div>
                    <h2>Built for real emergencies</h2>
                    <p>
                        Every year, delays in finding compatible blood donors cost lives.
                        ResQConnect exists to close that gap — a single place where
                        hospitals, patients, and donors can find each other in minutes,
                        not hours.
                    </p>
                </div>
            </section>

            <footer className="footer">
                <p>ResQConnect — built to save time when it matters most.</p>
            </footer>
        </div>
    );
}

export default Home;