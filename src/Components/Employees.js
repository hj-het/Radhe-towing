// pages/Employees.js
import React, { useState } from 'react';
// import Table from '../components/Table';
import { FaPlus } from 'react-icons/fa';
import TableOne from '../Table/TableOne';

const Employees = () => {
    const [employees, setEmployees] = useState([
        { id: 1, name: 'Michael Scott', position: 'Manager' },
        { id: 2, name: 'Pam Beesly', position: 'Receptionist' }
    ]);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [newEmployee, setNewEmployee] = useState({ name: '', position: '' });

    const columns = [
        {
            Header: 'ID',
            accessor: 'id'
        },
        {
            Header: 'Name',
            accessor: 'name'
        },
        {
            Header: 'Position',
            accessor: 'position'
        }
    ];

    const handleDelete = employee => {
        setEmployees(employees.filter(e => e.id !== employee.id));
    };

    const handleEdit = employee => {
        setEditingEmployee(employee);
    };

    const handleSave = () => {
        if (editingEmployee) {
            setEmployees(employees.map(e => (e.id === editingEmployee.id ? editingEmployee : e)));
            setEditingEmployee(null);
        } else {
            const newId = employees.length ? employees[employees.length - 1].id + 1 : 1;
            setEmployees([...employees, { id: newId, ...newEmployee }]);
        }
        setNewEmployee({ name: '', position: '' });
    };

    return (
        <div>
            <h1>Employees Page</h1>

            {/* Add/Edit Form */}
            <div className="form">
                <h2>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={editingEmployee ? editingEmployee.name : newEmployee.name}
                    onChange={e => {
                        if (editingEmployee) {
                            setEditingEmployee({ ...editingEmployee, name: e.target.value });
                        } else {
                            setNewEmployee({ ...newEmployee, name: e.target.value });
                        }
                    }}
                />
                <input
                    type="text"
                    placeholder="Position"
                    value={editingEmployee ? editingEmployee.position : newEmployee.position}
                    onChange={e => {
                        if (editingEmployee) {
                            setEditingEmployee({ ...editingEmployee, position: e.target.value });
                        } else {
                            setNewEmployee({ ...newEmployee, position: e.target.value });
                        }
                    }}
                />
                <button onClick={handleSave}>
                    {editingEmployee ? 'Update' : <><FaPlus /> Add Employee</>}
                </button>
            </div>

            {/* Employees Table */}
            <TableOne columns={columns} data={employees} handleDelete={handleDelete} handleEdit={handleEdit} />
        </div>
    );
};

export default Employees;
