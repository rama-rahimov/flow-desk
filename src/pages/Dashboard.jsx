import { useNavigate } from 'react-router-dom';
import {payment} from "../api.js";
import {useEffect, useState} from "react";

export default function Dashboard() {
  const [company, setCompany] = useState({});
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  function handleLogout() {
    console.log('Logout');
    localStorage.removeItem('token');
    navigate('/login');
  }

  async function handlePayment() {
    console.log('Logout');
    const result = await payment({ companyId: company.id, employeesCount: company.employments_count });
    if(result.success) {
      window.open(result.url, '_blank');
    }else {
      alert('Something went wrong!');
    }
  }

  useEffect(() => {
   const result = JSON.parse(localStorage.getItem('company'));
   setCompany(result);
    console.log({result});
  },[])

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
      <button
          className="logout-button"
          onClick={handlePayment}
      >
        Subscibe
      </button>
    </div>
  );
}
