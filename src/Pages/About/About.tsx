import React from 'react';
import './About.css';
import { useAppSelector } from '../../features/store';
import { useNavigate } from 'react-router-dom';
import logo_light from '../../assets/logo-white.png';
import logo_dark from '../../assets/logo-black.png';
import trip from '../../assets/bck2.jpg';

const About: React.FC = () => {
    const theme = useAppSelector((state: any) => state.theme.theme);

    const navigate = useNavigate();

    return (
        <div className="about-page">
            <header className="header-about">
                
            </header>

            <main className="main-content">
                <section className="hero">
                    <h1>Effortless Trip Management</h1>
                    <p>
                        TripSplit helps you plan, manage, and track trip expenses easily. Whether you're traveling with friends, family, or solo, our app ensures everyone shares the costs fairly.
                    </p>
                    <button className="cta-button-large" onClick={() => navigate('/CreateTrip')}>Start Now</button>
                </section>

                <section id="features" className="features-section">
                    <h2>Core Features</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>Trip Management</h3>
                            <p>Organize trips, manage participants, and keep everyone on the same page.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Expense Tracking</h3>
                            <p>Track and split expenses fairly among all members.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Notifications</h3>
                            <p>Get updates on changes to trips or expenses via email notifications.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Reports</h3>
                            <p>Generate detailed reports and share them with trip members.</p>
                        </div>
                    </div>
                </section>

                <section id="trips" className="trips-section">
                    <h2>Plan Your Next Trip</h2>
                    <p>Create your trip and invite friends to collaborate.</p>
                    <div className="trip-examples">
                        <div className="trip-card">Beach Getaway</div>
                        <div className="trip-card">Mountain Adventure</div>
                        <div className="trip-card">City Break</div>
                    </div>
                </section>

                <section id="reports" className="reports-section">
                    <h2>Detailed Expense Reports</h2>
                    <p>Export trip expenses as PDFs and keep everyone informed.</p>
                </section>
            </main>

            <footer className="footer">
                <p>&copy; 2024 TripSplit. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default About;
