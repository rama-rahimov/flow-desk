import {useNavigate, useParams} from 'react-router-dom';
import {checkCompany, checkPayment, currentUser, findProducts, getEmployees} from "../../api.js";
import {useEffect, useState} from "react";
import './Home.css';

export default function Dashboard() {
  const [company, setCompany] = useState({});
  const [employeesCount, setEmployeesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ productCount: 0, products: [] });
  const [checkPay, setCheckPay] = useState(false);
  const [permission, setPermission] = useState(false);
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
      const company = await checkCompany(companyLink);
      if (company.success) {
        setCompany(company.data);
      }
      const payment = await checkPayment();
      const user = await currentUser();
      const employees = await getEmployees();
      setEmployeesCount((employees || []).length);
      const products = await findProducts(user.company.id);
        if((payment || {}).payment_status?.id){
          setCheckPay(payment.payment_status.id !== 1);
          setPaymentData(payment);
        }else {
          setCheckPay(true);
        }
        setPermission(user.role_id === 1);
        setForm((prev) => ({...prev,
        productCount: products.length, products }));
        setLoading(true)
    })()
  },[])

  return (
      !loading ? <div className="container"><h1>Loading...</h1></div> : <div className="container">
          <div className="sub_container">
            <h1>Flow Desk</h1>
            <div>
              {permission?<button className="nav_b" onClick={() => navigate(`/${companyLink}/payment`, {
                state: {
                  company: companyLink,
                  companyId: company.id,
                  checkPay,
                  paymentData
                }
              })}>Subscribe</button>:''}
              <button className="nav_b" onClick={handleProfile}>Profile</button>
              <button className="nav_b" onClick={handleLogout}>Logout</button>
            </div>
          </div>
          <div className="main">
            <div className="card">
              <h3>Clients</h3>
              <p>Amount 0</p>
            </div>
            {permission?<div className="card"
                  onClick={() => navigate(`/${companyLink}/employees`, {state: {company: companyLink}})}>
              <h3>Employees</h3>
              <p>Amount {employeesCount}</p>
            </div>:''}
            <div className="card" onClick={() => navigate(`/${companyLink}/products`,{state:{products: form.products, companyId: company.id, companyName: companyLink }})}>
              <h3>Products</h3>
              <p>Amount {form.productCount??0}</p>
            </div>
            <div className="card">
              <h3>Deals</h3>
              <p>Amount 0</p>
            </div>
            <div className="card" onClick={() => navigate(`/${companyLink}/chat`)}>
              <h3>Chat</h3>
              <i style={{fontSize: '24px', color: '#3b82f6'}} className="fa-solid fa-comments chat-icon"></i>
            </div>
          </div>
      </div>
  );
}
