import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import TableOne from "../Table/TableOne";
import "./../Table/table.css";
import "./../Style/allcomponent.css";
// import styled from "styled-components";
import "./../Style/statusStyles.css";
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
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { FaUserEdit, FaUserPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

const Member = () => {
  const [members, setMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [cities, setCities] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [deleteMemberId, setDeleteMemberId] = useState(null);
  const [deleteMemberName, setDeleteMemberName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [allUsernames, setAllUsernames] = useState([]); //for username validation
  const [usernameValid, setUsernameValid] = useState(null); //for username validation
  const [statusChange, setStatusChange] = useState({
    memberId: null,
    memberName: null,
    newStatus: null,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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

  // Fetch members and cities from API
  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true); // Show loader
      try {
        const citiesResponse = await axios.get(
          "https://panel.radhetowing.com/api/cities"
        );
        const cities = citiesResponse.data;

        const membersResponse = await axios.get(
          "https://panel.radhetowing.com/api/members"
        );
        const mappedMembers = membersResponse.data.map((member) => {
          const city = cities.find((city) => city.id === member.city_id);

          const usernames = membersResponse.data.map(
            (member) => member.username
          );
          setAllUsernames(usernames);
          return {
            id: member.id,
            username: member.username,
            first_name: member.first_name,
            last_name: member.last_name,
            dob: member.dob,
            address_1: member.address_1,
            address_2: member.address_2,
            pincode: member.pincode,
            contact: member.contact,
            email: member.email,
            city: city ? city.name : "Unknown",
            status: member.is_active,
            password: member.password,
          };
        });

        setMembers(mappedMembers);
        setFilteredMembers(mappedMembers);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false); // Hide loader
      }
    };

    fetchMembers();
  }, []);

  // Validate username uniqueness
  useEffect(() => {
    if (newMember.username) {
      setUsernameValid(!allUsernames.includes(newMember.username));
    } else {
      setUsernameValid(null);
    }
  }, [newMember.username, allUsernames]);

  // Handle input change
  const handleInputChange = (field, value) => {
    setNewMember((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  console.log("handleInputChange", handleInputChange);

  // Handle status change
  const handleStatusChange = async () => {
    const { memberId, newStatus } = statusChange;
    try {
      const response = await axios.put(
        `https://panel.radhetowing.com/api/members/${memberId}/status`,
        { status: newStatus }
      );
      if (response.status === 200) {
        setMembers(
          members.map((m) =>
            m.id === memberId ? { ...m, status: newStatus } : m
          )
        );
        setFilteredMembers(
          filteredMembers.map((m) =>
            m.id === memberId ? { ...m, status: newStatus } : m
          )
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

  // Render status dropdown
  const renderStatus = (status, id, name) => {
    const getStatusLabel = () => {
      switch (status) {
        case "Y":
          return (
            <span
              className="status-label is-active"
              onClick={() => toggleDropdown(id)}
            >
              Active
            </span>
          );
        case "N":
          return (
            <span
              className="status-label is-inactive"
              onClick={() => toggleDropdown(id)}
            >
              Inactive
            </span>
          );
        case "P":
        default:
          return (
            <span
              className="status-label is-pending"
              onClick={() => toggleDropdown(id)}
            >
              Pending
            </span>
          );
      }
    };

    return (
      <div className="status-container">
        {getStatusLabel()}
        {activeDropdown === id && (
          <div className="dropdown">
            <div
              className="dropdown-item"
              onClick={() => {
                setStatusChange({
                  memberId: id,
                  memberName: name,
                  newStatus: "Y",
                });
                setShowConfirmModal(true);
              }}
            >
              Active
            </div>
            <div
              className="dropdown-item"
              onClick={() => {
                setStatusChange({
                  memberId: id,
                  memberName: name,
                  newStatus: "N",
                });
                setShowConfirmModal(true);
              }}
            >
              Inactive
            </div>
          </div>
        )}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; //  'DD-MM-YYYY' format
  };

  const columns = [
    {
      Header: "Sr No.",
      accessor: (row, index) => index + 1,
      id: "index",
    },
    { Header: "Username", accessor: "username" },
    { Header: "First Name", accessor: "first_name" },
    { Header: "Last Name", accessor: "last_name" },
    { Header: "Date of Birth", accessor: (row) => formatDate(row.dob) },
    { Header: "Address ", accessor: "address_1" },
    // { Header: "Address 2", accessor: "address_2" },
    { Header: "Pincode", accessor: "pincode" },
    { Header: "Phone", accessor: "contact" },
    { Header: "Email", accessor: "email" },
    { Header: "City", accessor: "city" },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => renderStatus(row.original.status, row.original.id),
    },
  ];

  // Handle search
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(
        (member) =>
          (member.username && member.username.toLowerCase().includes(query)) ||
          (member.first_name &&
            member.first_name.toLowerCase().includes(query)) ||
          (member.last_name &&
            member.last_name.toLowerCase().includes(query)) ||
          (member.email && member.email.toLowerCase().includes(query)) ||
          (member.contact && member.contact.includes(query))
      );
      setFilteredMembers(filtered);
    }
  };

  // Validation for form fields
  const validateForm = () => {
    const errors = {};

    if (!newMember.username || newMember.username.length < 3) {
      errors.username =
        "*Username is required and must be at least 3 characters";
    }

    if (
      !editingMember &&
      (!newMember.password || newMember.password.length < 6)
    ) {
      errors.password =
        "*Password is required and must be at least 6 characters";
    }

    if (newMember.password !== newMember.password_confirmation) {
      errors.password_confirmation = "*Passwords do not match";
    }

    if (!newMember.first_name) {
      errors.first_name = "*First name is required";
    }

    if (!newMember.last_name) {
      errors.last_name = "*Last name is required";
    }

    const dob = new Date(newMember.dob);
    if (!newMember.dob || isNaN(dob.getTime()) || dob >= new Date()) {
      errors.dob = "*Invalid or missing date of birth";
    }

    if (!newMember.address_1) {
      errors.address_1 = "*Address 1 is required";
    }

    if (!/^\d{6}$/.test(newMember.pincode)) {
      errors.pincode = "*Pincode must be exactly 6 digits";
    }

    if (!/^\d{10}$/.test(newMember.contact)) {
      errors.contact = "*Phone number must be exactly 10 digits";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newMember.email)) {
      errors.email = "*Email is invalid";
    }

    if (!newMember.city_id) {
      errors.city_id = "*City is required";
    }

    return errors;
  };

  // Handle delete
  const handleDelete = async (memberId) => {
    try {
      const response = await axios.delete(
        `https://panel.radhetowing.com/api/members/${memberId}`
      );
      if (response.status === 200) {
        setMembers(members.filter((m) => m.id !== memberId));
        setFilteredMembers(filteredMembers.filter((m) => m.id !== memberId));
        setShowDeleteModal(false);
        toast.success("Member Deleted Successfully")
      } else {
        console.error("Failed to delete member:", response);
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Error Deleting Member")
    }
  };

  // Trigger delete confirmation modal
  const triggerDeleteModal = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setDeleteMemberId(memberId);
      setDeleteMemberName(`${member.first_name} ${member.last_name}`);
      setShowDeleteModal(true);
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          "https://panel.radhetowing.com/api/cities"
        );
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  const resetForm = () => {
    setNewMember({
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      dob: "",
      address_1: "",
      address_2: "",
      city_id: "",
      pincode: "",
      contact: "",
      email: "",
      profile_pic: null,
      is_active: "P",
      password_confirmation: "",
    });
    setErrors({}); // Clear validation errors
  };

  // Handle Add Member (reset form and open modal)
  const handleAddMember = () => {
    resetForm();
    setEditingMember(null);
    setModalIsOpen(true);
    validateForm(null);
  };

  // Handle Edit Member (populate form with member data and open modal)
  const handleEdit = (member) => {
    const selectedCity = cities.find((city) => city.name === member.city);
    setEditingMember(member); // Mark member for editing
    setNewMember({
      username: member.username || "",
      password: "", // Keep this blank unless editing password is required
      password_confirmation: "",
      first_name: member.first_name || "",
      last_name: member.last_name || "",
      dob: member.dob
        ? new Date(member.dob).toISOString().substring(0, 10)
        : "",
      address_1: member.address_1 || "",
      address_2: member.address_2 || "",
      city_id: selectedCity ? selectedCity.id : "",
      pincode: member.pincode || "",
      contact: member.contact || "",
      email: member.email || "",
      profile_pic: member.profile_pic || null,
    });
    setModalIsOpen(true); // Open modal for editing
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return; // Stop execution if there are validation errors
    }

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
            password: newMember.password,
            password_confirmation: newMember.password_confirmation,
          }
        );

        // Get updated city name from cities list
        const updatedCity =
          cities.find((city) => city.id === newMember.city_id)?.name ||
          "Unknown";

        if (response.status === 200) {
          const updatedMember = response.data;

          // Update the member in the local state with correct city name
          setMembers(
            members.map((m) =>
              m.id === editingMember.id
                ? { ...updatedMember, city: updatedCity }
                : m
            )
          );
          setFilteredMembers(
            filteredMembers.map((m) =>
              m.id === editingMember.id
                ? { ...updatedMember, city: updatedCity }
                : m
            )
          );
          setModalIsOpen(false);
          setEditingMember(null);
          toast.success("Successfully Added Member");
        }
      } catch (error) {
        console.error("Error updating member:", error);
      }
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

        const addedMemberId = response.data.id;

        // Now fetch the full data of the new member using the ID
        const addedMemberResponse = await axios.get(
          `https://panel.radhetowing.com/api/members/${addedMemberId}`
        );

        const addedMember = addedMemberResponse.data;

        const addedCity =
          cities.find((city) => city.id === addedMember.city_id)?.name ||
          "Unknown";
          toast.success("Successfully Added Member");

        // Add the newly created member to the list with the correct city name
        setMembers([
          ...members,
          {
            ...addedMember,
            city: addedCity,
          },
        ]);
        setFilteredMembers([
          ...filteredMembers,
          {
            ...addedMember,
            city: addedCity,
          },
        ]);
        setModalIsOpen(false);
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
      city_id: "", // Reset city_id
      pincode: "",
      contact: "",
      email: "",
      profile_pic: null,
      is_active: "p",
      password: "",
      password_confirmation: "",
    });
  };

  return (
    <div className="mainhead">
      <h1
        style={{
          display: "flex",
          textAlign: "center",
          gap: "6px",
          alignItems: "center",
          fontSize: "25px",
        }}
      >
        {" "}
        <FaUsers /> Members
      </h1>
      <div className="AddButton">
        <button className="btn-add" onClick={handleAddMember}>
          <FaUserPlus /> Add Member
        </button>
      </div>

      {/* Search Input */}
      <div className="search-bar">
        <div className="search-input-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search "
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Members Table */}

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <TableOne
          columns={columns}
          data={filteredMembers.slice().reverse()}
          handleDelete={(member) => triggerDeleteModal(member.id)}
          handleEdit={handleEdit}
        />
      )}
      <ToastContainer />
      {/* Modal for Adding/Editing Member */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add/Edit Member"
        className="membermodel"
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={false}
      >
        <h2>
          {editingMember ? <FaUserEdit /> : <FaUserPlus />}
          {editingMember ? " Edit Member" : " Add Member"}
        </h2>

        <div className="form-member">
          {/* Username Input with Icon */}
          <div className="input-error">
            <div className="input-with-iconm">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="Username"
                value={newMember.username}
                onChange={(e) =>
                  setNewMember({ ...newMember, username: e.target.value })
                }
                disabled={!!editingMember}
              />
              {usernameValid === true && (
                <FaCheckCircle className="validation-icon valid" />
              )}
              {usernameValid === false && (
                <FaTimesCircle className="validation-icon invalid" />
              )}
            </div>
            <div className="error">
              {errors.username && (
                <span className="error-text">{errors.username}</span>
              )}
            </div>
          </div>

          {/* First and Last Name Input with Icon */}

          <div className="namefield">
            <div className="input-error">
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
              <div className="error">
                {errors.first_name && (
                  <span className="error-text">{errors.first_name}</span>
                )}
              </div>
            </div>

            <div className="input-error">
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
              <div className="error">
                {errors.last_name && (
                  <span className="error-text">{errors.last_name}</span>
                )}
              </div>
            </div>
          </div>

          {/* Password Input with Icon and Toggle */}
          {!editingMember && (
            <div className="passwordfeildm">
              <div className="input-error">
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
                <div className="error">
                  {errors.password && (
                    <span className="error-text">{errors.password}</span>
                  )}
                </div>
              </div>

              {/* Confirm Password Input with Icon and Toggle */}
              <div className="input-error">
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
                <div className="error">
                  {errors.password_confirmation && (
                    <span className="error-text">
                      {errors.password_confirmation}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Date of Birth Input with Icon */}
          <div className="date-phone">
            <div className="input-error">
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
              <div className="error">
                {errors.dob && <span className="error-text">{errors.dob}</span>}
              </div>
            </div>

            {/* Phone Input with Icon */}
            <div className="input-error">
              <div className="input-with-iconm">
                <FaPhoneAlt className="input-icon" />
                <input
                  type="number"
                  placeholder="Phone"
                  value={newMember.contact}
                  onChange={(e) => {
                    // Ensure only numeric input and restrict to 10 digits
                    const input = e.target.value;
                    if (/^\d*$/.test(input) && input.length <= 10) {
                      setNewMember({ ...newMember, contact: input });
                    }
                  }}
                  maxLength="10"
                />
              </div>{" "}
              <div className="error">
                {errors.contact && (
                  <span className="error-text">{errors.contact}</span>
                )}
              </div>
            </div>
          </div>

          {/* Email Input with Icon */}
          <div className="input-error">
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
            <div className="error">
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>
          </div>

          {/* Address 1 Input with Icon */}
          <div className="input-error">
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
            <div className="error">
              {errors.address_1 && (
                <span className="error-text">{errors.address_1}</span>
              )}
            </div>
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
            <div className="input-error">
              <div className="input-with-iconm">
                <FaMapPin className="input-icon" />
                <input
                  type="number"
                  placeholder="Pincode"
                  value={newMember.pincode}
                  onChange={(e) =>
                    setNewMember({ ...newMember, pincode: e.target.value })
                  }
                />
              </div>
              <div className="error">
                {errors.pincode && (
                  <span className="error-text">{errors.pincode}</span>
                )}
              </div>
            </div>

            {/* City Dropdown with Icon */}
            <div className="input-error">
              <div className="input-with-iconm">
                <FaCity className="input-icon" />
                <select
                  className="city-drop"
                  value={newMember.city_id} // Correctly bind the selected value
                  onChange={(e) =>
                    setNewMember({ ...newMember, city_id: e.target.value })
                  } // Handle change correctly
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="error">
                {errors.city_id && (
                  <span className="error-text">{errors.city_id}</span>
                )}
              </div>
            </div>
          </div>

          <div className="modelbutton">
            <button onClick={handleSave} className="btn-editmodel">
              {editingMember ? <FaUserEdit /> : <FaUserPlus />}
              {editingMember ? "Edit Member" : "Add Member"}
            </button>
            <button
              className="btn-closemodel"
              onClick={() => {
                setModalIsOpen(false); // Close modal
                resetForm(); // Reset form and clear errors
              }}
            >
              <MdCancel />
              Cancel
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
        shouldCloseOnOverlayClick={false}
      >
        <h2>Confirm Status Change</h2>
        <p>
          Are you sure you want to change the status of{" "}
          {statusChange.memberName}?
        </p>
        <div className="modelbutton-status">
          <button onClick={handleStatusChange} className="btn-confirm-status">
            Yes, Change Status
          </button>
          <button
            onClick={() => setShowConfirmModal(false)}
            className="btn-status"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <IoWarningOutline /> Confirm Delete
            </h3>

            <p>
              Are you sure you want to permanent delete{" "}
              <span style={{ fontWeight: 700, color: "#ee5757" }}>
                {deleteMemberName}
              </span>
              ?
            </p>

            <div className="modal-buttons">
              <button
                className="btn-confirm"
                onClick={() => handleDelete(deleteMemberId)} // Use the stored member ID for deletion
              >
                Yes, Delete
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteModal(false)} // Close the modal
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Member;
