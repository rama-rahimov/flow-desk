import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role_id: '', employments_count: '', companyName: '', companyDirector: ''});
    function handleChange(event) {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value, }));
    }
    async function handleSubmit(event) {
        event.preventDefault();
        const result = await register({
          firstName: form.firstName,
          employments_count: form.employments_count,
          lastName: form.lastName, email: form.email,
          startWork: form.startWork, employmentsCount: form.employmentsCount,
          companyName: form.companyName,
          password: form.password, ...(form.role_id && { role_id: Number(form.role_id), }),
        });
        if (!result.success) {
            alert(result.message);
            return;
        }
        alert('Registration successful');
        navigate('/login');
    }
    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1>FlowDesk</h1>
                <h2>Create account</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <label className="select-label">
                        Role:
                        <select
                            className="role-select"
                            name="role_id"
                            value={form.role_id}
                            onChange={handleChange}
                        >
                            <option value="">Select</option>
                            <option value={1}>Client</option>
                            <option value={2}>Company</option>
                        </select>
                    </label>
                    {
                        Number(form.role_id) === 1 ? <>
                            <input type="text" name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required />
                            <input type="text" name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} required />
                            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} minLength={5} maxLength={20} required />
                            <button type="submit"> Register </button> </> : Number(form.role_id) === 2 ? <>
                            <input type="text" name="companyName" placeholder="Company name" value={form.companyName} onChange={handleChange} required />
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
                <div className="auth-link">
                  <button onClick={() => navigate('/login')}> Already have an account? Login </button>
                </div>
            </div>
        </div> );
}