import React, { useState } from "react";
import Modal from "react-modal"; // Import React Modal
import TableOne from "../Table/TableOne";
import { FaPlus } from "react-icons/fa";
import "./../Table/table.css";
import "./../Style/allcomponent.css";

// Set Modal app element
Modal.setAppElement("#root");

const Member = () => {
  const [members, setMembers] = useState([
    {
      id: 1,
      username: "johndoe",
      name: "John Doe",
      dob: "1990-01-01",
      address: "123 Main St, Cityville",
      pincode: "12345",
      phone: "555-1234",
      email: "johndoe@example.com",
      city: "Cityville",
      state: "Stateland",
      country: "Countryland",
    },
    {
      id: 2,
      username: "janesmith",
      name: "Jane Smith",
      dob: "1985-05-15",
      address: "456 Oak St, Townsville",
      pincode: "67890",
      phone: "555-5678",
      email: "janesmith@example.com",
      city: "Townsville",
      state: "Stateburg",
      country: "Countryland",
    },  {
        id: 2,
        username: "janesmith",
        name: "Jane Smith",
        dob: "1985-05-15",
        address: "456 Oak St, Townsville",
        pincode: "67890",
        phone: "555-5678",
        email: "janesmith@example.com",
        city: "Townsville",
        state: "Stateburg",
        country: "Countryland",
      },  {
        id: 2,
        username: "janesmith",
        name: "Jane Smith",
        dob: "1985-05-15",
        address: "456 Oak St, Townsville",
        pincode: "67890",
        phone: "555-5678",
        email: "janesmith@example.com",
        city: "Townsville",
        state: "Stateburg",
        country: "Countryland",
      },  {
        id: 2,
        username: "janesmith",
        name: "Jane Smith",
        dob: "1985-05-15",
        address: "456 Oak St, Townsville",
        pincode: "67890",
        phone: "555-5678",
        email: "janesmith@example.com",
        city: "Townsville",
        state: "Stateburg",
        country: "Countryland",
      },  {
        id: 2,
        username: "janesmith",
        name: "Jane Smith",
        dob: "1985-05-15",
        address: "456 Oak St, Townsville",
        pincode: "67890",
        phone: "555-5678",
        email: "janesmith@example.com",
        city: "Townsville",
        state: "Stateburg",
        country: "Countryland",
      },  {
        id: 2,
        username: "janesmith",
        name: "Jane Smith",
        dob: "1985-05-15",
        address: "456 Oak St, Townsville",
        pincode: "67890",
        phone: "555-5678",
        email: "janesmith@example.com",
        city: "Townsville",
        state: "Stateburg",
        country: "Countryland",
      },  {
        id: 2,
        username: "janesmith",
        name: "Jane Smith",
        dob: "1985-05-15",
        address: "456 Oak St, Townsville",
        pincode: "67890",
        phone: "555-5678",
        email: "janesmith@example.com",
        city: "Townsville",
        state: "Stateburg",
        country: "Countryland",
      },  {
        id: 2,
        username: "janesmith",
        name: "Jane Smith",
        dob: "1985-05-15",
        address: "456 Oak St, Townsville",
        pincode: "67890",
        phone: "555-5678",
        email: "janesmith@example.com",
        city: "Townsville",
        state: "Stateburg",
        country: "Countryland",
      },
  ]);

  const [editingMember, setEditingMember] = useState(null);
  const [newMember, setNewMember] = useState({
    username: "",
    name: "",
    dob: "",
    address: "",
    pincode: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    country: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const columns = [
    { Header: "Username", accessor: "username" },
    { Header: "Name", accessor: "name" },
    { Header: "Date of Birth", accessor: "dob" },
    { Header: "Address", accessor: "address" },
    { Header: "Pincode", accessor: "pincode" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Email", accessor: "email" },
    { Header: "City", accessor: "city" },
    { Header: "State", accessor: "state" },
    { Header: "Country", accessor: "country" },
  ];

  // Handle Delete
  const handleDelete = (member) => {
    setMembers(members.filter((m) => m.id !== member.id));
  };

  // Handle Edit
  const handleEdit = (member) => {
    setEditingMember(member);
    setNewMember(member);
    setModalIsOpen(true); // Open modal for editing
  };

  // Handle Save (for Add and Update)
  const handleSave = () => {
    if (editingMember) {
      setMembers(
        members.map((m) => (m.id === editingMember.id ? newMember : m))
      );
      setEditingMember(null);
    } else {
      const newId = members.length ? members[members.length - 1].id + 1 : 1;
      setMembers([...members, { id: newId, ...newMember }]);
    }
    setNewMember({
      username: "",
      name: "",
      dob: "",
      address: "",
      pincode: "",
      phone: "",
      email: "",
      city: "",
      state: "",
      country: "",
    });
    setModalIsOpen(false);
  };

  return (
    <div className="mainhead">
      <h1>Members Page</h1>

      <div className="AddButton">
        <button className="btn-add" onClick={() => setModalIsOpen(true)}>
          <FaPlus /> Add Member
        </button>
      </div>
      {/* Members Table */}
      <TableOne
        columns={columns}
        data={members}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />

      {/* Modal for Adding/Editing Member */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add/Edit Member"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>{editingMember ? "Edit Member" : "Add New Member"}</h2>
        <div className="form">
          <input
            type="text"
            placeholder="Username"
            value={newMember.username}
            onChange={(e) =>
              setNewMember({ ...newMember, username: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Name"
            value={newMember.name}
            onChange={(e) =>
              setNewMember({ ...newMember, name: e.target.value })
            }
          />
          <input
            type="date"
            placeholder="Date of Birth"
            value={newMember.dob}
            onChange={(e) =>
              setNewMember({ ...newMember, dob: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Address"
            value={newMember.address}
            onChange={(e) =>
              setNewMember({ ...newMember, address: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Pincode"
            value={newMember.pincode}
            onChange={(e) =>
              setNewMember({ ...newMember, pincode: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Phone"
            value={newMember.phone}
            onChange={(e) =>
              setNewMember({ ...newMember, phone: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            value={newMember.email}
            onChange={(e) =>
              setNewMember({ ...newMember, email: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="City"
            value={newMember.city}
            onChange={(e) =>
              setNewMember({ ...newMember, city: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="State"
            value={newMember.state}
            onChange={(e) =>
              setNewMember({ ...newMember, state: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Country"
            value={newMember.country}
            onChange={(e) =>
              setNewMember({ ...newMember, country: e.target.value })
            }
          />
          <div className="modelbutton">
            <button onClick={handleSave} className="btn-editmodel" >
              {editingMember ? "Update Member" : "Add Member"}
            </button>
         
          <button className="btn-closemodel" onClick={() => setModalIsOpen(false)}>
            Close
          </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Member;
