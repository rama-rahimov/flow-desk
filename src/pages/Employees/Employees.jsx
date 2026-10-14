import { useEffect, useState } from 'react';
import './Employees.css';
import {getEmployees, addEmployees, deleteEmployee} from '../../api.js';
import {useNavigate, useParams} from "react-router-dom";
import {EmployeeModal} from "./EmployeeModal.jsx";

function Employees() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChange, setIsChange] = useState(false);
    const {companyLink} = useParams();
    const [form, setForm] = useState({firstName: '', lastName: '', email: '', password: '', td_check: ''});
    useEffect(() => {
        getAllEmployees();
    }, [isChange]);
    async function delEmployee(userId) {
        const result = confirm('Are you sure, delete employee ?');
        if (result) {
            const res = await deleteEmployee(userId);
            if(res.error){
                alert(res.message);
                return;
            }else {
                alert('Employee deleted successfully.');
                setIsChange((prev) => !prev);
            }
        }
    }
    async function getAllEmployees() {
        const response = await getEmployees()
        setEmployees(response);
    }
    function handleChange(event) {
        const name = event.target.id;
        if(name.includes('td_check')){
            const value = name.split('-')[1];
            setForm({
                ...form,
                td_check: Number(value),
            });
        }else {
            setForm({
                ...form,
                [event.target.id]: event.target.value,
            });
        }
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
        setForm({firstName: '', lastName: '', email: '', password: '', td_check: ''});
        setIsModalOpen(false);
    }

    console.log({form});
    return (
        <div className="employees-page">
            <div className="employees-header">
                <h1>Employees</h1>
                <div>
                    {
                        form.td_check?<button className="nav_b" onClick={() => delEmployee(form.td_check)}>Back Dashboard</button>:''
                    }
                    <button className="nav_b" onClick={() => navigate(`/${companyLink}/dashboard`)}>Back Dashboard</button>
                    <button className="nav_b"  onClick={() => setIsModalOpen(true)}>+ Add employee</button>
                </div>
            </div>
                <div className="container_table">
                    <table>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Select</th>
                        </tr>
                        </thead>
                        <tbody>
                        {employees.map((employee, index) => (
                         <tr key={index}>
                           <td>{employee.id}</td>
                           <td>{employee.firstName}</td>
                           <td>{employee.lastName}</td>
                           <td>{employee.email}</td>
                           <td>{employee.role_id === 1 ? 'Admin':'Employee'}</td>
                           <td>
                             <input className="td_check" onChange={handleChange} id={"td_check-"+employee.id} type="checkbox" checked={form.td_check === employee.id} />
                           </td>
                         </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {isModalOpen && <EmployeeModal addOneEmployee={addOneEmployee} handleChange={handleChange} form={form} setIsModalOpen={setIsModalOpen}/>}
        </div>
    );
}

export default Employees;