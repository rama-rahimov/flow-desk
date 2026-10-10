import {useNavigate, useParams} from 'react-router-dom';
import {checkPayment, currentUser, findProducts} from "../../api.js";
import {useEffect, useState} from "react";

export default function Dashboard() {
  const [company, setCompany] = useState({});
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ productCount: 0, products: [] });
  const [checkPay, setCheckPay] = useState(false);
  const [user, setUser] = useState({});
  const [paymentData, setPaymentData] = useState({});
  const navigate = useNavigate();
  const {companyLink} = useParams();
  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  function handleProfile() {
    navigate(`/${companyLink}/profile`);
  }

  useEffect(() => {
    (async () => {
        const payment = await checkPayment();
        const user = await currentUser();
      const products = await findProducts(user.company.id);
        if((payment || {}).payment_status?.id){
          setCheckPay(payment.payment_status.id !== 1);
          setPaymentData(payment);
        }else {
          setCheckPay(true);
        }
        setUser(user);
        setForm((prev) => ({...prev,
        productCount: products.length, products }));
        setLoading(true)
    })()
  },[])

  return (
        !loading ? <h1>Loading...</h1> : <div className="dashboard">
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
                  user.role_id === 1 && <div className="dashboard-card" onClick={() => navigate(`/${companyLink}/employees`,{
                    state: {company: companyLink }
                  })}>
                    <h3>Employees</h3>
                    {/*<p>0</p>*/}
                  </div>
              }
              <div className="dashboard-card" onClick={() => navigate(`/${companyLink}/products`, {
                state: {products: form.products, companyId: company.id, companyName: companyLink }
              })}>
                <h3>Products</h3>
                <p>{form.productCount}</p>
              </div>

              <div className="dashboard-card">
                <h3>Deals</h3>
                <p>0</p>
              </div>
              <div className="dashboard-card" onClick={() => navigate(`/${companyLink}/chat`)}>
                <h3>Chat</h3>
              </div>
            </div>
          </main>
          <button
              className="logout-button"
              onClick={() => navigate(`/${companyLink}/payment`,{
                state: {company: companyLink, companyId: company.id, checkPay, paymentData},
              })}
          >
            Subscribe
          </button>
        </div>
  );
}
