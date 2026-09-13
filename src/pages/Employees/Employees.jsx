import { useEffect, useState } from 'react';
import './Employees.css';
import {getEmployees, addEmployees, deleteEmployee} from '../../api.js';
import {useLocation, useNavigate} from "react-router-dom";

function Employees() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChange, setIsChange] = useState(false);
    const location = useLocation();
    const [link] = useState(location.state.company);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        getAllEmployees();
    }, [isChange]);

    async function delEmployee(userId) {
        const res = await deleteEmployee(userId);
        if(res.error){
            alert(res.message);
            return;
        }else {
            alert('Employee deleted successfully.');
            setIsChange((prev) => !prev);
        }
    }
    async function getAllEmployees() {
        const response = await getEmployees()
        setEmployees(response);
    }

    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    }

    async function addOneEmployee(event) {
        event.preventDefault();

        const employee = await addEmployees(form);
        console.log({ employee });
        if(employee.error){
            alert(employee.message);
            setIsModalOpen(false);
            return;
        }
        setEmployees([...employees, employee]);

        setForm({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        });

        setIsModalOpen(false);
    }

    return (
        <div className="employees-page">
            <div className="employees-header">
                <h1>Employees</h1>
                <button onClick={() => navigate(`/${link}/dashboard`)}>Back Dashboard
                </button>
                <button onClick={() => setIsModalOpen(true)}>
                    + Add employee
                </button>
            </div>
            <div className="employees-list">
                {employees.map((employee) => (
                    <div className="employee-card" key={employee.id}>
                        <div>
                            <h3>
                                {employee.firstName} {employee.lastName}
                            </h3>
                            <p>{employee.email}</p>
                        </div>
                        <span>{employee.role_id === 1 ? 'Admin':'Employee'}</span>
                        {employee.role_id !== 1 && <button onClick={() => delEmployee(employee.id)}>Delete</button>}
                    </div>
                ))}
            </div>
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Add employee</h2>
                        <form onSubmit={addOneEmployee}>
                            <input
                                name="firstName"
                                placeholder="First name"
                                value={form.firstName}
                                onChange={handleChange}
                            />
                            <input
                                name="lastName"
                                placeholder="Last name"
                                value={form.lastName}
                                onChange={handleChange}
                            />
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                            />
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                            />
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>

                                <button type="submit">
                                    Add employee
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Employees;