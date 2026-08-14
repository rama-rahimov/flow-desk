import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    console.log('Logout');
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>FlowDesk</h1>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <h2>Dashboard</h2>

        <p>Welcome to FlowDesk</p>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Clients</h3>
            <p>0</p>
          </div>

          <div className="dashboard-card">
            <h3>Products</h3>
            <p>0</p>
          </div>

          <div className="dashboard-card">
            <h3>Deals</h3>
            <p>0</p>
          </div>
        </div>
      </main>
    </div>
  );
}
