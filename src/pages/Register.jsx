import {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {payment, register} from '../api';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Register() {
    const navigate = useNavigate();
    const {companyLink} = useParams();
    const location = useLocation();
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', link: '', password: '', role_id: '', employmentsCount: '', companyName: ''});
    function handleChange(event) {
        const { name, value } = event.target;
        if(name === 'link') {
            setForm((prev) => ({ ...prev, [name]: value.toLowerCase().replace(/[^a-z0-9_-]/g, '') }));
        }else {
            setForm((prev) => ({ ...prev, [name]: value, }));
        }
    }
    async function handleSubmit(event) {
        event.preventDefault();
        const result = await register(form);
        if (!result.success) {
            alert(result.message);
            return;
        }
        alert('Registration successful');
        navigate(`/${form.role_id === 2 ? form.link : companyLink}/login`);
    }

    useEffect(() => {
        const path = location.pathname.split('/')[1];
        const jsonCompany = localStorage.getItem('company');
        const company = JSON.parse(jsonCompany);
        setForm((prev) => ({ ...prev, role_id: path === "register" ? 2: 1, companyId: path !== "register" ? company.id: ''}));
    },[])
    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1>FlowDesk</h1>
                <h2>Create account {Number(form.role_id) === 2 ? 'company':'client'}</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    {
                        Number(form.role_id) === 1 ? <>
                            <input type="text" name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required />
                            <input type="text" name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} required />
                            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} minLength={5} maxLength={20} required />
                            <button type="submit"> Register </button> </> : Number(form.role_id) === 2 ? <>
                            <input type="text" name="companyName" placeholder="Company name" value={form.companyName} onChange={handleChange} required />
                            <input type="text" name="link" placeholder="Company link" value={form.link} onChange={handleChange} required />
                            <input type="text" inputMode="numeric" name="employmentsCount" placeholder="Employements count" value={form.employmentsCount} onChange={handleChange} required />
                            <label>Company start work date: </label>
                            <DatePicker
                                name="startWork"
                                selected={form.startWork}
                                onChange={(date) => handleChange({
                                    target: {
                                    name: 'startWork',
                                    value: date
                                }
                                })}
                                selectsStart
                                startDate={form.startWork}
                            />
                            <input type="text" name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required />
                            <input type="text" name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} required />
                            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} minLength={5} maxLength={20} required />
                            <button type="submit"> Register </button>
                        </>:''
                    }
                </form>
                {
                    Number(form.role_id) === 1 &&  <div className="auth-link">
                        <button onClick={() => navigate(`/${companyLink}/login`)}>
                            Already have an account? Login
                        </button>
                    </div>
                }
            </div>
        </div> );
}