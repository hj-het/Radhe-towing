import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal"; // Import React Modal
import TableOne from "../Table/TableOne";
import { FaPlus } from "react-icons/fa";
import "./../Table/table.css";
import "./../Style/allcomponent.css";
// import styled from "styled-components";
import "./../Style/statusStyles.css"
import {
  FaUser,
  FaLock,
  FaPhoneAlt,
  FaEnvelope,
  FaHome,
  FaCity,
  FaEyeSlash,
  FaEye,
  FaCalendarAlt,
  FaMapPin,
} from "react-icons/fa";

// Set Modal app element
Modal.setAppElement("#root");

const Member = () => {
  const [members, setMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [cities, setCities] = useState([]); 
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [statusChange, setStatusChange] = useState({ memberId: null, memberName: null, newStatus: null }); 
  const [showConfirmModal, setShowConfirmModal] = useState(false); // For confirmation modal
  const [newMember, setNewMember] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    dob: "",
    address_1: "",
    address_2: "",
    pincode: "",
    contact: "",
    email: "",
    city: "",
    state: "",
    country: "",
    city_id: "",
    // password_confirmation: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);

// Fetch members from the API using axios
useEffect(() => {
  const fetchMembers = async () => {
    try {
      // Fetch cities first
      const citiesResponse = await axios.get("https://panel.radhetowing.com/api/cities");
      const cities = citiesResponse.data; // Store cities

      // Fetch members
      const membersResponse = await axios.get("https://panel.radhetowing.com/api/members");
      const mappedMembers = membersResponse.data.map((member) => {
        const city = cities.find((city) => city.id === member.city_id); 
        return {
          id: member.id,
          username: member.username,
          name: `${member.first_name} ${member.last_name}`,
          dob: member.dob,
          address: `${member.address_1}, `,
          pincode: member.pincode,
          phone: member.contact,
          email: member.email,
          city: city ? city.name : "Unknown", // Map city_id to city name
          status: member.is_active,
        };
      });

      setMembers(mappedMembers);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  fetchMembers();
}, []);

  // Handle status change confirmation and API call
  const handleStatusChange = async () => {
    const { memberId, newStatus } = statusChange;
    try {
      const response = await axios.put(`https://panel.radhetowing.com/api/members/${memberId}/status`, {
        status: newStatus,
      });
      if (response.status === 200) {
        setMembers(
          members.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m))
        );
        setActiveDropdown(null); 
        setShowConfirmModal(false); 
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Toggle the dropdown visibility for status change
  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Render the status with dropdown functionality
  const renderStatus = (status, id, name) => {
    const getStatusLabel = () => {
      switch (status) {
        case "Y":
          return <span className="status-label is-active" onClick={() => toggleDropdown(id)}>Active</span>;
        case "N":
          return <span className="status-label is-inactive" onClick={() => toggleDropdown(id)}>Inactive</span>;
        case "P":
        default:
          return <span className="status-label is-pending" onClick={() => toggleDropdown(id)}>Pending</span>;
      }
    };

    return (
      <div className="status-container">
        {getStatusLabel()}
        {activeDropdown === id && (
          <div className="dropdown">
            <div className="dropdown-item" onClick={() => { setStatusChange({ memberId: id, memberName: name, newStatus: "Y" }); setShowConfirmModal(true); }}>
              Active
            </div>
            <div className="dropdown-item" onClick={() => { setStatusChange({ memberId: id, memberName: name, newStatus: "N" }); setShowConfirmModal(true); }}>
              Inactive
            </div>
          </div>
        )}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with 0 if needed
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-indexed) and pad with 0
    const year = date.getFullYear(); // Get year
    return `${day}-${month}-${year}`; // Return in 'DD-MM-YYYY' format
  };

  const columns = [
    { Header: "Username", accessor: "username" },
    { Header: "Name", accessor: "name" },
    { Header: "Date of Birth",accessor: (row) => formatDate(row.dob)  },
    { Header: "Address", accessor: "address" },
    { Header: "Pincode", accessor: "pincode" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Email", accessor: "email" },
    { Header: "City", accessor: "city" },
    { Header: "Status", accessor: "status", Cell: ({ row }) => renderStatus(row.original.status, row.original.id) },
  

    // { Header: "State", accessor: "state" },
    // { Header: "Country", accessor: "country" },
  ];

// Handle Delete
const handleDelete = async (memberId) => {
  try {
    // Call the delete API
    const response = await axios.delete(`https://panel.radhetowing.com/api/members/${memberId}`);
    
    if (response.status === 200) {
      // If successful, update the state to remove the member
      setMembers(members.filter((m) => m.id !== memberId));
      console.log('Member deleted successfully.');
    } else {
      console.error('Failed to delete member:', response);
    }
  } catch (error) {
    console.error('Error deleting member:', error);
  }
};

  // Handle Edit
  // const handleEdit = (member) => {
  //   setEditingMember(member);
  //   setNewMember(member);
  //   setModalIsOpen(true); // Open modal for editing
  // };


  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("https://panel.radhetowing.com/api/cities");
        setCities(response.data); // Save cities in state
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  // Handle Edit
  const handleEdit = (member) => {
    console.log("member-->",member)
    setEditingMember(member);
    setNewMember({
      username: member.username,
      password: member.password,
      first_name: member.first_name,
      last_name: member.last_name,
      dob: member.dob,
      address_1: member.address_1,
      address_2: member.address_2,
      city_id: member.city_id, 
      pincode: member.pincode,
      contact: member.contact,
      email: member.email,
      profile_pic: member.profile_pic,
      is_active: member.is_active,
      // password_confirmation: member.password_confirmation,
    });
    setModalIsOpen(true); // Open modal for editing
  };

// Handle Save (for Add and Update)
const handleSave = async () => {
  if (editingMember) {
    // Update existing member via PUT request
    try {
      const response = await axios.put(
        `https://panel.radhetowing.com/api/members/${editingMember.id}`,
        {
          username: newMember.username,
          first_name: newMember.first_name,
          last_name: newMember.last_name,
          dob: newMember.dob,
          address_1: newMember.address_1,
          address_2: newMember.address_2,
          city_id: newMember.city_id,
          pincode: newMember.pincode,
          contact: newMember.contact,
          email: newMember.email,
          profile_pic: newMember.profile_pic,
          is_active: newMember.is_active,
          password: newMember.password,
          password_confirmation: newMember.password_confirmation, // Ensure both passwords match
        }
      );

      // Check response status and update the member in local state
      if (response.status === 200) {
        const updatedMember = response.data;
        const updatedCity = cities.find((city) => city.id === updatedMember.city_id)?.name || "Unknown";

        // Update the member in the local state with correct city name
        setMembers(
          members.map((m) =>
            m.id === editingMember.id
              ? {
                  ...updatedMember,
                  city: updatedCity,
                  name: `${updatedMember.first_name} ${updatedMember.last_name}`,
                  dob: updatedMember.dob,
                  address: `${updatedMember.address_1}`,
                  pincode: updatedMember.pincode,
                  phone: updatedMember.contact,
                  email: updatedMember.email,
                }
              : m
          )
        );
        setModalIsOpen(false); // Close modal after updating
        setEditingMember(null); // Clear editing state
      }
    } catch (error) {
      console.error("Error updating member:", error);
    }
  } else {
    // Add new member via POST request (existing functionality)
    try {
      const response = await axios.post(
        "https://panel.radhetowing.com/api/members",
        {
          username: newMember.username,
          first_name: newMember.first_name,
          last_name: newMember.last_name,
          dob: newMember.dob,
          address_1: newMember.address_1,
          address_2: newMember.address_2,
          city_id: newMember.city_id,
          pincode: newMember.pincode,
          contact: newMember.contact,
          email: newMember.email,
          profile_pic: newMember.profile_pic,
          is_active: newMember.is_active,
          password: newMember.password,
          password_confirmation: newMember.password_confirmation,
        }
      );

      const addedMember = response.data;
      const addedCity = cities.find((city) => city.id === addedMember.city_id)?.name || "Unknown";

      // Add the newly created member to the list
      setMembers([
        ...members,
        {
          ...addedMember,
          city: addedCity,
          name: `${addedMember.first_name} ${addedMember.last_name}`,
          dob: addedMember.dob,
          address: `${addedMember.address_1}`,
          pincode: addedMember.pincode,
          phone: addedMember.contact,
          email: addedMember.email,
        },
      ]);
      setModalIsOpen(false); // Close modal after adding
    } catch (error) {
      console.error("Error adding member:", error);
    }
  }

  // Reset the form after saving
  setNewMember({
    username: "",
    first_name: "",
    last_name: "",
    dob: "",
    address_1: "",
    address_2: "",
    city_id: "1",
    pincode: "",
    contact: "",
    email: "",
    profile_pic: null,
    is_active: "Y",
    password: "",
    password_confirmation: "",
  });
};

  
  return (
    <div className="mainhead">
      <h1>Members </h1>

      <div className="AddButton">
        <button className="btn-add" onClick={() => setModalIsOpen(true)}>
          <FaPlus /> Add Member
        </button>
      </div>
      {/* Members Table */}
      <TableOne
        columns={columns}
        data={members}
        handleDelete={(member) => handleDelete(member.id)}
        handleEdit={handleEdit}
      />

      {/* Modal for Adding/Editing Member */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add/Edit Member"
        className="membermodel"
        overlayClassName="modal-overlay"
      >
        <h2>{editingMember ? "Edit Member" : "Add New Member"}</h2>

        <div className="form-member">
          {/* Username Input with Icon */}
          <div className="input-with-iconm">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              value={newMember.username}
              onChange={(e) =>
                setNewMember({ ...newMember, username: e.target.value })
              }
            />
          </div>

          {/* First and Last Name Input with Icon */}
          <div className="namefield">
            <div className="input-with-iconm">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="First Name"
                value={newMember.first_name}
                onChange={(e) =>
                  setNewMember({ ...newMember, first_name: e.target.value })
                }
              />
            </div>

            <div className="input-with-iconm">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="Last Name"
                value={newMember.last_name}
                onChange={(e) =>
                  setNewMember({ ...newMember, last_name: e.target.value })
                }
              />
            </div>
          </div>

          {/* Password Input with Icon and Toggle */}
          <div className="passwordfeildm">
            <div className="input-with-iconm">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={newMember.password}
                onChange={(e) =>
                  setNewMember({ ...newMember, password: e.target.value })
                }
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password Input with Icon and Toggle */}
            <div className="input-with-iconm">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={newMember.password_confirmation}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    password_confirmation: e.target.value,
                  })
                }
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Date of Birth Input with Icon */}
          <div className="date-phone">
            <div className="input-with-iconm">
              <FaCalendarAlt className="input-icon" />
              <input
                type="text"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) =>
                  e.target.value === ""
                    ? (e.target.type = "text")
                    : (e.target.type = "date")
                }
                placeholder="Date of Birth"
                value={
                  newMember.dob
                    ? new Date(newMember.dob).toISOString().substring(0, 10)
                    : ""
                }
                onChange={(e) =>
                  setNewMember({ ...newMember, dob: e.target.value })
                }
              />
            </div>
            {/* Phone Input with Icon */}
            <div className="input-with-iconm">
              <FaPhoneAlt className="input-icon" />
              <input
                type="text"
                placeholder="Phone"
                value={newMember.contact}
                onChange={(e) =>
                  setNewMember({ ...newMember, contact: e.target.value })
                }
              />
            </div>{" "}
          </div>

          {/* Email Input with Icon */}
          <div className="input-with-iconm">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={newMember.email}
              onChange={(e) =>
                setNewMember({ ...newMember, email: e.target.value })
              }
            />
          </div>

          {/* Address 1 Input with Icon */}
          <div className="input-with-iconm">
            <FaHome className="input-icon" />
            <input
              type="text"
              placeholder="Address 1"
              value={newMember.address_1}
              onChange={(e) =>
                setNewMember({ ...newMember, address_1: e.target.value })
              }
            />
          </div>

          {/* Address 2 Input with Icon */}
          <div className="input-with-iconm">
            <FaHome className="input-icon" />
            <input
              type="text"
              placeholder="Address 2"
              value={newMember.address_2}
              onChange={(e) =>
                setNewMember({ ...newMember, address_2: e.target.value })
              }
            />
          </div>
       <div className="pincode-city">
          {/* Pincode Input */}
          <div className="input-with-iconm">
            <FaMapPin className="input-icon" />
            <input
              type="text"
              placeholder="Pincode"
              value={newMember.pincode}
              onChange={(e) =>
                setNewMember({ ...newMember, pincode: e.target.value })
              }
            />
          </div>

      {/* City Dropdown with Icon */}
      <div className="input-with-iconm" >
            <FaCity className="input-icon" />
            <select className="city-drop"
              value={newMember.city_id}
              onChange={(e) => setNewMember({ ...newMember, city_id: e.target.value })}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          </div>

          <div className="modelbutton">
            <button onClick={handleSave} className="btn-editmodel">
              {editingMember ? "Update Member" : "Add Member"}
            </button>

            <button
              className="btn-closemodel"
              onClick={() => setModalIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

       
      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
        contentLabel="Confirm Status Change"
        className="confirm-model"
        overlayClassName="modal-overlay-status"
      >
        <h2>Confirm Status Change</h2>
        <p>Are you sure you want to change the status of {statusChange.memberName}?</p>
        <div className="modelbutton-status">
          <button onClick={handleStatusChange} className="btn-confirm-status">
            Yes, Change Status
          </button>
          <button onClick={() => setShowConfirmModal(false)} className="btn-status">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Member;
