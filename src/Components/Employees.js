import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { FaPlus } from "react-icons/fa";
import TableOne from "../Table/TableOne";
import "./../Style/employees.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import emailjs from "emailjs-com";

import {
  FaUser,
  FaLock,
  FaCalendarAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaSearch,
  FaUserTie
} from "react-icons/fa";

Modal.setAppElement("#root");

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);
  const [deleteEmployeeName, setDeleteEmployeeName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetEmployeeId, setResetEmployeeId] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null); // For status change confirmation
  const [newEmployee, setNewEmployee] = useState({
    Username: "",
    Password: "",
    FirstName: "",
    LastName: "",
    DOB: "",
    DOJ: "",
    Contact: "",
    Email: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Fetch employees data from the API
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://panel.radhetowing.com/api/employees");
      const employeeData = response.data.data.map((emp) => ({
        id: emp.id,
        Username: emp.Username,
        Password: emp.Password,
        FirstName: emp.FirstName,
        LastName: emp.LastName,
        DOB: emp.DOB,
        DOJ: emp.DOJ,
        Contact: emp.Contact,
        Email: emp.Email,
        IsActive: emp.IsActive,
      }));
      setEmployees(employeeData);
      setFilteredEmployees(employeeData);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

 // Open the confirmation modal for status change
 const openStatusModal = (employee) => {
  setCurrentEmployee(employee);
  setShowStatusModal(true);
};

// Confirm the status change
const confirmStatusChange = async () => {
  const newStatus = !currentEmployee.IsActive;
  try {
    const response = await axios.put(
      `https://panel.radhetowing.com/api/employee/update-status/${currentEmployee.id}`,
      { IsActive: newStatus }
    );

    if (response.data.success) {
      toast.success(
        `Employee status updated to ${newStatus ? "Active" : "Inactive"}`
      );
      setShowStatusModal(false); // Close the modal
      fetchEmployees(); // Refetch the employees to get the latest status
    } else {
      toast.error("Failed to update status.");
    }
  } catch (error) {
    console.error("Error updating status:", error);
    toast.error("Error updating employee status.");
  }
};

  const validateForm = () => {
    const newErrors = {};

    if (!newEmployee.Username) newErrors.Username = "Username is required";
    if (!newEmployee.Password) newErrors.Password = "Password is required";
    if (!newEmployee.FirstName) newErrors.FirstName = "First Name is required";
    if (!newEmployee.LastName) newErrors.LastName = "Last Name is required";
    if (!newEmployee.DOB) newErrors.DOB = "Date of Birth is required";
    if (!newEmployee.DOJ) newErrors.DOJ = "Date of Joining is required";
    // if (!newEmployee.Contact) newErrors.Contact = "Contact number is required";
    // else if (!/^\d+$/.test(newEmployee.Contact))
    //   newErrors.Contact = "Contact should only contain numbers";
    // else if (newEmployee.Contact.length = 10 )
    //   newErrors.Contact = "Contact should be between 10 digits";
    if (!newEmployee.Email) newErrors.Email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.Email))
      newErrors.Email = "Email is invalid";

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Function to Handle Delete Operation
  const handleDelete = async (employeeId) => {
    try {
      const response = await axios.delete(
        `https://panel.radhetowing.com/api/employee/delete/${employeeId}`
      );

      if (response.data.success) {
        const updatedEmployees = employees.filter((e) => e.id !== employeeId);
        setEmployees(updatedEmployees);
        setFilteredEmployees(updatedEmployees);
        setShowDeleteModal(false);
        toast.success(response.data.message || "Employee Deleted Successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };
  // Trigger delete confirmation modal
  const triggerDeleteModal = (employeeId, employeeName) => {
    setDeleteEmployeeId(employeeId);
    setDeleteEmployeeName(employeeName);
    setShowDeleteModal(true);
  };

  // Handle edit operation
  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setNewEmployee(employee);
    setModalIsOpen(true);
  };

  // Handle opening the "Add Employee" modal
  const handleOpenAddModal = () => {
    // Reset the form for adding a new employee
    setNewEmployee({
      Username: "",
      Password: "",
      FirstName: "",
      LastName: "",
      DOB: "",
      DOJ: "",
      Contact: "",
      Email: "",
    });
    setEditingEmployee(null);
    setModalIsOpen(true);
    setErrors({});
  };

  // Function to Add a New Employee
  const addEmployee = async () => {
    const payload = {
      Username: newEmployee.Username,
      Password: newEmployee.Password,
      FirstName: newEmployee.FirstName,
      LastName: newEmployee.LastName,
      DOB: newEmployee.DOB,
      DOJ: newEmployee.DOJ,
      Contact: newEmployee.Contact,
      Email: newEmployee.Email,
    };

    try {
      const response = await axios.post(
        "https://panel.radhetowing.com/api/employee/add",
        payload
      );

      if (response.data.success) {
        // Add the new employee to the list
        const newId = response.data.data.id;
        toast.success(response.data.message);
        const updatedEmployees = [...employees, { id: newId, ...newEmployee }];
        setEmployees(updatedEmployees);
        setFilteredEmployees(updatedEmployees);

        // Reset the form
        setNewEmployee({
          Username: "",
          Password: "",
          FirstName: "",
          LastName: "",
          DOB: "",
          DOJ: "",
          Contact: "",
          Email: "",
        });

        setModalIsOpen(false);
      } else {
        console.error("Error adding employee:", response.data.message);
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  // Function to Edit/Update an Employee
  const editEmployee = async () => {
    const payload = {
      Username: newEmployee.Username,
      Password: newEmployee.Password,
      FirstName: newEmployee.FirstName,
      LastName: newEmployee.LastName,
      DOB: newEmployee.DOB,
      DOJ: newEmployee.DOJ,
      Contact: newEmployee.Contact,
      Email: newEmployee.Email,
    };

    try {
      const response = await axios.put(
        `https://panel.radhetowing.com/api/employee/update/${editingEmployee.id}`,
        payload
      );

      if (response.data.success) {
        const updatedEmployees = employees.map((e) =>
          e.id === editingEmployee.id ? { id: e.id, ...payload } : e
        );
        setEmployees(updatedEmployees);
        setFilteredEmployees(updatedEmployees);

        toast.success(response.data.message || "Employee Updated Successfully");
        setEditingEmployee(null);
        setModalIsOpen(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      if (editingEmployee) {
        editEmployee();
      } else {
        addEmployee();
      }
    }
  };

  // Function to format date in 'DD-MM-YYYY' format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; //'DD-MM-YYYY' format
  };

  // Simple Custom Password Generator
  const generatePassword = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password;
  };

  // Auto-generate password and set it in the input field
  const generateAutoPassword = () => {
    const password = generatePassword();
    setNewPassword(password);
  };

  const sendResetPasswordEmail = (email, newPassword, Username) => {
    console.log("username-->", Username);
    const templateParams = {
      to_email: email,
      message: newPassword,
      reply_to: "radhetowing@gmail.com",
      to_name: Username,
    };

    emailjs
      .send(
        "service_pxbou0m", // Service ID from EmailJS
        "template_xb4f88j", // Template ID from EmailJS
        templateParams,
        "mukVylKGf9712x24Z" // User ID from EmailJS
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          toast.success("Password reset email sent successfully!");
        },
        (err) => {
          console.error("FAILED...", err);
          toast.error("Failed to send password reset email.");
        }
      );
  };

  const saveNewPassword = async () => {
    try {
      const response = await axios.put(
        `https://panel.radhetowing.com/api/employee/reset-password/${resetEmployeeId}`,
        { New_Password: newPassword }
      );

      if (response.data.success) {
        toast.success("Password reset successfully!");
        sendResetPasswordEmail(
          response.data.data.Email,
          response.data.data.New_Password,
          response.data.data.Username
        );
        setShowResetPasswordModal(false);
        setNewPassword("");
      } else {
        toast.error("Error resetting password");
      }
    } catch (error) {
      toast.error("An error occurred while resetting the password.");
    }
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = employees.filter(
      (employee) =>
        employee.FirstName.toLowerCase().includes(query) ||
        employee.LastName.toLowerCase().includes(query) ||
        employee.Email.toLowerCase().includes(query)
    );

    setFilteredEmployees(filtered);
  };


  
  

  // Table columns
  const columns = [
    {
      Header: "ID",
      accessor: (row, index) => index + 1,
      id: "index",
    },
    { Header: "Username", accessor: "Username" },
    // { Header: "Password", accessor: "Password" },
    { Header: "First Name", accessor: "FirstName" },
    { Header: "Last Name", accessor: "LastName" },
    { Header: "DOB", accessor: (row) => formatDate(row.DOB) }, // Format DOB
    { Header: "DOJ", accessor: (row) => formatDate(row.DOJ) }, // Format DOJ
    { Header: "Contact", accessor: "Contact" },
    { Header: "Email", accessor: "Email" },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => {
        const isActive = row.original.IsActive;
        return (
          <button
          onClick={() => openStatusModal(row.original)}
            style={{
              color: isActive ? "green" : "red",
              fontWeight: "bold",
              cursor: "pointer",
              border: "transparent",
              background:"transparent",
            }}
          >
            {isActive ? "Active" : "Inactive"}
          </button>
        );
      },
    },
  ];

  return (
    <div className="employees-page">
      <h1 style={{display:"flex",textAlign:'center',gap:'6px'}}>  <FaUserTie/> Employees </h1>

      {/* Add Employee Button */}
      <div className="AddButton">
        <button onClick={handleOpenAddModal} className="add-btn">
          <FaPlus /> Add Employee
        </button>
      </div>

      {/* Search Input */}
      <div className="search-bar">
        <div className="search-input-container">
          <FaSearch className="search-icon" /> {/* Search Icon */}
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add/Edit Employee"
        className="modal"
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={false}
      >
        <h2>{editingEmployee ? "Edit Employee" : "Add Employee"}</h2>

        <div className="form">
          {/* Username Input with Icon */}
          <div className="input-error">
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="Username"
                value={newEmployee.Username}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, Username: e.target.value })
                }
                disabled={!!editingEmployee}
              />
            </div>
            <div className="error">
              {errors.Username && (
                <span className="error-text">{errors.Username}</span>
              )}
            </div>
          </div>

          {/* Password Input with Icon (Show only when adding a new employee) */}
          {!editingEmployee && (
            <div className="input-error">
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={newEmployee.Password || ""}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, Password: e.target.value })
                  }
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    cursor: "pointer",
                    color: "#888",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="error">
                {errors.Password && (
                  <span className="error-text">{errors.Password}</span>
                )}
              </div>
            </div>
          )}

          <div className="namefield">
            {/* First Name Input with Icon */}
            <div className="input-error">
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  placeholder="First Name"
                  value={newEmployee.FirstName}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      FirstName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="error">
                {errors.FirstName && (
                  <span className="error-text">{errors.FirstName}</span>
                )}
              </div>
            </div>

            {/* Last Name Input with Icon */}
            <div className="input-error">
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={newEmployee.LastName}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, LastName: e.target.value })
                  }
                />
              </div>
              <div className="error">
                {errors.LastName && (
                  <span className="error-text">{errors.LastName}</span>
                )}
              </div>
            </div>
          </div>

          {/* Date of Birth and Date of Joining */}
          <div className="datefield">
            {/* Date of Birth Input with Icon */}
            <div className="input-error">
              <div className="input-with-icon">
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
                  value={newEmployee.DOB ? formatDate(newEmployee.DOB) : ""}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, DOB: e.target.value })
                  }
                />
              </div>
              <div className="error">
                {errors.DOB && <span className="error-text">{errors.DOB}</span>}
              </div>
            </div>

            {/* Date of Joining Input with Icon */}
            <div className="input-error">
              <div className="input-with-icon">
                <FaCalendarAlt className="input-icon" />
                <input
                  type="text"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) =>
                    e.target.value === ""
                      ? (e.target.type = "text")
                      : (e.target.type = "date")
                  }
                  placeholder="Date of Joining"
                  value={newEmployee.DOJ ? formatDate(newEmployee.DOJ) : ""}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, DOJ: e.target.value })
                  }
                />
              </div>
              <div className="error">
                {errors.DOJ && <span className="error-text">{errors.DOJ}</span>}
              </div>
            </div>
          </div>

          {/* Contact Input with Icon */}
          <div className="input-error">
            <div className="input-with-icon">
              <FaPhoneAlt className="input-icon" />
              <input
                type="text"
                placeholder="Contact"
                value={newEmployee.Contact}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, Contact: e.target.value })
                }
              />
            </div>
            <div className="error">
              {errors.Contact && (
                <span className="error-text">{errors.Contact}</span>
              )}
            </div>
          </div>

          {/* Email Input with Icon */}
          <div className="input-error">
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={newEmployee.Email}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, Email: e.target.value })
                }
              />
            </div>
            <div className="error" style={{ marginBottom: "10px" }}>
              {errors.Email && (
                <span className="error-text">{errors.Email}</span>
              )}
            </div>
          </div>

          <div className="modelbutton">
            <button onClick={handleSave} className="btn-editmodel">
              {editingEmployee ? "Edit Employee" : "Add Employee"}
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

      {/* Reset Password Modal */}
      <Modal
        isOpen={showResetPasswordModal}
        onRequestClose={() => setShowResetPasswordModal(false)}
        contentLabel="Reset Password"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Reset Password</h2>

        {/* Display employee name */}
        {resetEmployeeId && (
          <>
            <p>
              Reset password for {" "}
              <strong>
                {
                  employees.find((employee) => employee.id === resetEmployeeId)
                    ?.FirstName
                }{" "}
                {
                  employees.find((employee) => employee.id === resetEmployeeId)
                    ?.LastName
                }
              </strong>
            </p>
            <p>
              {" "}
              Mobile No: {""}
              <strong>
                {
                  employees.find((employee) => employee.id === resetEmployeeId)
                    ?.Contact
                }
                {""}
              </strong>
            </p>
          </>
        )}

        <div className="form">
          <div className="input-with-icon">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                cursor: "pointer",
                color: "#888",
              }}
            >
              {/* {showPassword ? <FaEyeSlash /> : <FaEye />} */}
            </span>
          </div>

          {/* Auto-generate password button */}
          <div className="Generate-password">
            <button onClick={generateAutoPassword} className="btn-generate">
              Generate Password
            </button>
          </div>

          <div className="modelbutton">
            <button onClick={saveNewPassword} className="btn-save">
              Save Password
            </button>
            <button
              className="btn-closemodel"
              onClick={() => setShowResetPasswordModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <span style={{ fontWeight: 700, color: "#ee5757" }}>
                {deleteEmployeeName}
              </span>
              ?
            </p>

            <div className="modal-buttons">
              <button
                className="btn-confirm"
                onClick={() => handleDelete(deleteEmployeeId)}
              >
                Yes, Delete
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Confirmation Modal for Status Change */}
        <Modal
        isOpen={showStatusModal}
        onRequestClose={() => setShowStatusModal(false)}
        contentLabel="Confirm Status Change"
        className="modal"
        overlayClassName="modal-overlay"
        style={{
          content: {
            textAlign: "center", 
          },
        }}
      >
        <h2>Confirm Status Change</h2>
        {currentEmployee && (
          <p>
            Are you sure you want to change the status of{" "}
            <span style={{ fontWeight: "bold", color: "#ee5757" }}>
              {currentEmployee.FirstName} {currentEmployee.LastName}
            </span>{" "}
            ?
            {/* to {currentEmployee.is_active ? "Inactive" : "Active"}? */}
          </p>
        )}
        <div className="modal-buttons">
          <button
            onClick={confirmStatusChange}
            className="btn-confirm"
            style={{ backgroundColor: "red", color: "white" }}
          >
            Yes, Change
          </button>
          <button
            onClick={() => setShowStatusModal(false)}
            className="btn-cancel"
            style={{ backgroundColor: "grey", color: "white" }}
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Employees Table */}
      <TableOne
        columns={columns}
        data={filteredEmployees.slice().reverse()}
        handleDelete={(employee) =>
          triggerDeleteModal(
            employee.id,
            `${employee.FirstName} ${employee.LastName}`
          )
        }
        handleEdit={handleEdit}
        handlePasswordReset={(employee) => {
          setResetEmployeeId(employee.id);
          setShowResetPasswordModal(true);
        }}
        isEmployeeTable={true} // Pass true to show the Reset Password button
      />
      {/* Toast Container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default Employees;
