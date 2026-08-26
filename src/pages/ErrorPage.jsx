import { useNavigate } from 'react-router-dom';

export default function ErrorPage({status = 500, message = 'Something went wrong'}) {
    const navigate = useNavigate();
    return (
        <div className="error-page">
            <div className="error-container">
                <div className="error-status">
                    {status}
                </div>
                <h1>{message}</h1>
                <p>The page you are looking for could not be found.</p>
                <button onClick={() => navigate('/')}>
                    Go home
                </button>
            </div>
        </div>
    );
}