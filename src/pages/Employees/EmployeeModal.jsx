export function EmployeeModal({addOneEmployee, handleChange, form, setIsModalOpen}){
    return (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation() }>
                <h2>Add employee</h2>
                <form onSubmit={addOneEmployee}>
                    <input
                        id="firstName"
                        placeholder="First name"
                        value={form.firstName}
                        onChange={handleChange}
                    />
                    <input
                        id="lastName"
                        placeholder="Last name"
                        value={form.lastName}
                        onChange={handleChange}
                    />
                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    <input
                        id="password"
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
    )
}