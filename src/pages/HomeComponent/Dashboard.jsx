import {useNavigate} from 'react-router-dom';
import {checkPayment, currentUser, findProducts, payment} from "../../api.js";
import {useEffect, useState} from "react";

export default function Dashboard() {
  const [company, setCompany] = useState({});
  const [form, setForm] = useState({ productCount: 0, products: [] });
  const [checkPay, setCheckPay] = useState(false);
  const [user, setUser] = useState({});
  const [paymentData, setPaymentData] = useState({});
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  function handleProfile() {
    navigate(`/${company.link}/profile`);
  }

  async function handlePayment() {
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
    (async () => {
      if(result?.id){
        const payment = await checkPayment();
        const products = await findProducts(result.id);
        const user = await currentUser();
        if(payment?.id){
          setCheckPay(payment.company_id);
          setPaymentData(payment);
        }else {
          setCheckPay(true);
        }
        setUser(user);
        setForm((prev) => ({...prev,
          productCount: products.length, products }));
      }
    })()
  },[])

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>FlowDesk</h1>

        <button
            className="logout-button"
            onClick={handleProfile}
        >
          Profile
        </button>

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
          {
            user.role_id === 1 && <div className="dashboard-card" onClick={() => navigate(`/${company.link}/employees`,{
                state: {company: company.link }
              })}>
                <h3>Employees</h3>
                {/*<p>0</p>*/}
              </div>
          }
          <div className="dashboard-card" onClick={() => navigate(`/${company.link}/products`, {
            state: {products: form.products, companyId: company.id, companyName: company.link }
          })}>
            <h3>Products</h3>
            <p>{form.productCount}</p>
          </div>

          <div className="dashboard-card">
            <h3>Deals</h3>
            <p>0</p>
          </div>
        </div>
      </main>
      {checkPay ? <button
          className="logout-button"
          onClick={() => navigate(`/${company.link}/payment`,{
            state: {company: company.link, companyId: company.id}
          })}
      >
        Subscribe
      </button>:""}
    </div>
  );
}
