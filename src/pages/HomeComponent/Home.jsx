import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
    const navigate = useNavigate();
    return (
        <div className="home-page">
            <div className="home-card">
                <h1 className="home-title">
                    Welcome to FlowDesk :)
                </h1>
                <p className="home-description">
                    Manage your business in one place.
                </p>
                <div className="home-actions">
                    <button
                        className="home-button home-button-secondary"
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}