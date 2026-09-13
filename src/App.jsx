import {
    BrowserRouter,
    Routes,
    Route,
    useLocation, useNavigate
} from 'react-router-dom';

import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import Dashboard from './pages/HomeComponent/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import {useEffect} from "react";
import {checkCompany} from "./api.js";
import ErrorPage from "./pages/ErrorPage.jsx";
import Home from "./pages/HomeComponent/Home.jsx";
import {PaymentSuccess} from "./pages/PaymentComponents/PaymentSuccess.jsx";
import {PaymentCancel} from "./pages/PaymentComponents/PaymentCancel.jsx";
import Products from "./pages/Products/Products.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Employees from "./pages/Employees/Employees.jsx";
import Payment from "./pages/PaymentComponents/Payment.jsx";

function AppContent() {
    const navigate = useNavigate();
    const location = useLocation();
    useEffect( () => {
        (async () => {
            const link = location.pathname.split('/')[1];
            const jsonCompany = await JSON.parse(localStorage.getItem('company'));
            if(link === (jsonCompany || {}).link && link !== "register" && link !== ''){
              const company = await checkCompany(link);
              if(company.success){
                localStorage.setItem('company', JSON.stringify(company.data));
              }else {
               navigate('/wrong_url');
              }

            }
        })()
    },[])

    return (
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/payment/success" element={<PaymentSuccess />}/>
            <Route path="/payment/cancel" element={<PaymentCancel />}/>
            <Route path="/:companyLink/payment" element={<Payment />}/>
            <Route path='/:companyLink/employees' element={<Employees />} />
            <Route path="/:companyLink/login" element={<Login />}/>
            <Route path="/:companyLink/profile" element={<Profile />}/>
            <Route path="/:companyLink/register" element={<Register />}/>
            <Route path="/:companyLink/products" element={<Products />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/:companyLink/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
            <Route path="*" element={<ErrorPage status={404} message="Page Not Found"/>}/>
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;