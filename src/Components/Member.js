// pages/Members.js
import React, { useState } from 'react';
import TableOne from '../Table/TableOne';
import { FaPlus } from 'react-icons/fa';
import './../Table/table.css'
import './../Style/allcomponent.css'

const Member = () => {
    const [members, setMembers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]);
    const [editingMember, setEditingMember] = useState(null);
    const [newMember, setNewMember] = useState({ name: '', email: '' });

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
            Header: 'Email',
            accessor: 'email'
        }
    ];

    // Handle Delete
    const handleDelete = member => {
        setMembers(members.filter(m => m.id !== member.id));
    };

    // Handle Edit
    const handleEdit = member => {
        setEditingMember(member);
    };

    // Handle Save (for Add and Update)
    const handleSave = () => {
        if (editingMember) {
            setMembers(members.map(m => (m.id === editingMember.id ? editingMember : m)));
            setEditingMember(null);
        } else {
            const newId = members.length ? members[members.length - 1].id + 1 : 1;
            setMembers([...members, { id: newId, ...newMember }]);
        }
        setNewMember({ name: '', email: '' });
    };

    return (
        <div style={{ marginLeft: '20%' }} className='mainhead' >
            <h1>Members Page</h1>

            {/* Add/Edit Form */}
            <div className="form">
                <h2>{editingMember ? 'Edit Member' : 'Add New Member'}</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={editingMember ? editingMember.name : newMember.name}
                    onChange={e => {
                        if (editingMember) {
                            setEditingMember({ ...editingMember, name: e.target.value });
                        } else {
                            setNewMember({ ...newMember, name: e.target.value });
                        }
                    }}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={editingMember ? editingMember.email : newMember.email}
                    onChange={e => {
                        if (editingMember) {
                            setEditingMember({ ...editingMember, email: e.target.value });
                        } else {
                            setNewMember({ ...newMember, email: e.target.value });
                        }
                    }}
                />
                <button onClick={handleSave}>
                    {editingMember ? 'Update' : <><FaPlus /> Add Member</>}
                </button>
            </div>

            {/* Members Table */}
            <TableOne columns={columns} data={members} handleDelete={handleDelete} handleEdit={handleEdit} />
        </div>
    );
};

export default Member;
