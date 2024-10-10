import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal"; // Import React Modal
import TableOne from "../Table/TableOne";
import { FaPlus } from "react-icons/fa";
import "./../Table/table.css";
import "./../Style/allcomponent.css";
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
          address: `${member.address_1}, ${member.address_2}`,
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


  const columns = [
    { Header: "Username", accessor: "username" },
    { Header: "Name", accessor: "name" },
    { Header: "Date of Birth", accessor: "dob" },
    { Header: "Address", accessor: "address" },
    { Header: "Pincode", accessor: "pincode" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Email", accessor: "email" },
    { Header: "City", accessor: "city" },
    { Header: "Status", accessor: "status" },

    // { Header: "State", accessor: "state" },
    // { Header: "Country", accessor: "country" },
  ];

  // Handle Delete
  const handleDelete = (member) => {
    setMembers(members.filter((m) => m.id !== member.id));
  };

  // // Handle Edit
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
            city_id: newMember.city_id, // Assuming a static value or provided by the form
            pincode: newMember.pincode,
            contact: newMember.contact,
            email: newMember.email,
            profile_pic: newMember.profile_pic,
            is_active: newMember.is_active,
            password: newMember.password, // Required field
            // password_confirmation: newMember.password_confirmation,
          }
        );

        // Update the member in the local state
        setMembers(
          members.map((m) =>
            m.id === editingMember.id
              ? {
                  id: response.data.id,
                  username: response.data.username,
                  name: `${response.data.first_name} ${response.data.last_name}`,
                  dob: response.data.dob,
                  address: `${response.data.address_1}, ${response.data.address_2}`,
                  pincode: response.data.pincode,
                  contact: response.data.contact,
                  email: response.data.email,
                }
              : m
          )
        );
        if (newMember.password !== newMember.password_confirmation) {
          alert("Password and confirmation do not match");
          return;
        }
      } catch (error) {
        console.error("Error updating member:", error);
      }

      setEditingMember(null);
    } else {
      // Add new member via POST request
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
            city_id: newMember.city_id, // Assuming a static value or provided by the form
            pincode: newMember.pincode,
            contact: newMember.contact,
            email: newMember.email,
            profile_pic: newMember.profile_pic,
            is_active: newMember.is_active,
            password: newMember.password, // Required field
          }
        );

        const addedMember = response.data;

        // Add the newly created member to the list
        setMembers([
          ...members,
          {
            id: addedMember.id,
            first_name: addedMember.first_name,
            last_name: addedMember.last_name,
            username: addedMember.username,
            // name: `${addedMember.first_name} ${addedMember.last_name}`,
            dob: addedMember.dob,
            address_1: addedMember.address_1,
            address_2: addedMember.address_2,
            // address: `${addedMember.address_1}, ${addedMember.address_2}`,
            pincode: addedMember.pincode,
            contact: addedMember.contact,
            email: addedMember.email,
            password: addedMember.password,
          },
        ]);
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
      city_id: "1", // Static value, modify if needed
      pincode: "",
      contact: "",
      email: "",
      profile_pic: null,
      is_active: "Y",
      password: "", // Required field
    });
    setModalIsOpen(false);
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
        handleDelete={handleDelete}
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
    </div>
  );
};

export default Member;
