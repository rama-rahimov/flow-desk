import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login_employment } from '../api';
export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    function handleChange(event) {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value, })); }
    async function handleSubmit(event) {
        event.preventDefault();
        const result = await login_employment({ email: form.email, password: form.password });
        if (!result.success) {
            alert(result.message);
            return;
        }
        localStorage.setItem('token', result.data); navigate('/dashboard'); }
    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1>FlowDesk</h1>
                <h2>Login</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                    <button type="submit"> Login </button> </form>
                <div className="auth-link"> <button onClick={() => navigate('/register')}> Create account </button>
                </div> </div>
        </div> );
}