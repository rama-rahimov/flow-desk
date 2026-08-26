import {
    BrowserRouter,
    Routes,
    Route,
    useLocation, useNavigate
} from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import {useEffect} from "react";
import {checkCompany} from "./api.js";
import ErrorPage from "./pages/ErrorPage.jsx";
import Home from "./pages/HomeComponent/Home.jsx";
import {PaymentSuccess} from "./pages/PaymentComponents/PaymentSuccess.jsx";
import {PaymentCancel} from "./pages/PaymentComponents/PaymentCancel.jsx";

function AppContent() {
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location.pathname);
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
            <Route
                path="/"
                element={<Home />}
            />
            <Route
                path="/payment/success"
                element={<PaymentSuccess />}
            />
            <Route
                path="/payment/cancel"
                element={<PaymentCancel />}
            />
            <Route
                path="/:companyLink/login"
                element={<Login />}
            />
            <Route
                path="/:companyLink/register"
                element={<Register />}
            />
            <Route
                path="/register"
                element={<Register />}
            />
            <Route
                path="/:companyLink/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="*"
                element={
                    <ErrorPage
                        status={404}
                        message="Page Not Found"
                    />
                }
            />
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