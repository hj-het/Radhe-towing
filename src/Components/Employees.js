import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { FaPlus } from "react-icons/fa";
import TableOne from "../Table/TableOne";
import "./../Style/employees.css";
import {
  FaUser,
  FaLock,
  FaCalendarAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

Modal.setAppElement("#root");

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null); // For delete confirmation
  const [deleteEmployeeName, setDeleteEmployeeName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({}); // To track validation errors
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
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "https://panel.radhetowing.com/api/employees"
        );
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
        }));
        setEmployees(employeeData);
        console.log("employeeData-->", employeeData);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Validation function to check form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!newEmployee.Username) newErrors.Username = "Username is required";
    if (!newEmployee.Password) newErrors.Password = "Password is required";
    if (!newEmployee.FirstName) newErrors.FirstName = "First Name is required";
    if (!newEmployee.LastName) newErrors.LastName = "Last Name is required";
    if (!newEmployee.DOB) newErrors.DOB = "Date of Birth is required";
    if (!newEmployee.DOJ) newErrors.DOJ = "Date of Joining is required";
    if (!newEmployee.Contact) newErrors.Contact = "Contact number is required";
    else if (!/^\d+$/.test(newEmployee.Contact))
      newErrors.Contact = "Contact should only contain numbers";
    else if (newEmployee.Contact.length < 10 || newEmployee.Contact.length > 15)
      newErrors.Contact = "Contact should be between 10-15 digits";
    if (!newEmployee.Email) newErrors.Email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.Email))
      newErrors.Email = "Email is invalid";

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle delete operation
  const handleDelete = async (employeeId) => {
    try {
      const response = await axios.delete(
        `https://panel.radhetowing.com/api/employee/delete/${employeeId}`
      );

      if (response.data.success) {
        setEmployees(employees.filter((e) => e.id !== employeeId));
        setShowDeleteModal(false);
      } else {
        console.error("Error deleting employee:", response.data.message);
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
    setEditingEmployee(null); // Ensure that we're not editing any employee
    setModalIsOpen(true); // Open modal
    setErrors({}); // Reset errors when opening modal
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
        const newId = employees.length
          ? employees[employees.length - 1].id + 1
          : 1;
        setEmployees([...employees, { id: newId, ...newEmployee }]);

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

        // Close the modal
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
        setEmployees(
          employees.map((e) =>
            e.id === editingEmployee.id ? { id: e.id, ...payload } : e
          )
        );
        setEditingEmployee(null);
        setModalIsOpen(false);
      } else {
        console.error("Error updating employee:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      if (editingEmployee) {
        editEmployee(); // Call the edit function if we are editing
      } else {
        addEmployee(); // Call the add function if we are adding a new employee
      }
    }
  };

  // Function to format date in 'DD-MM-YYYY' format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with 0 if needed
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-indexed) and pad with 0
    const year = date.getFullYear(); // Get year
    return `${day}-${month}-${year}`; // Return in 'DD-MM-YYYY' format
  };

  // Table columns
  const columns = [
    {
      Header: "ID",
      accessor: (row, index) => index + 1, // Use index as row number
      id: "index", // Optional: Set an ID for the column
    },
    { Header: "Username", accessor: "Username" },
    // { Header: "Password", accessor: "Password" },
    { Header: "First Name", accessor: "FirstName" },
    { Header: "Last Name", accessor: "LastName" },
    { Header: "DOB", accessor: (row) => formatDate(row.DOB) }, // Format DOB
    { Header: "DOJ", accessor: (row) => formatDate(row.DOJ) }, // Format DOJ
    { Header: "Contact", accessor: "Contact" },
    { Header: "Email", accessor: "Email" },
  ];

  return (
    <div className="employees-page">
      <h1>Employees </h1>

      {/* Add Employee Button */}
      <div className="AddButton">
        <button onClick={handleOpenAddModal} className="add-btn">
          <FaPlus /> Add Employee
        </button>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add/Edit Employee"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>{editingEmployee ? "Edit Employee" : "Add New Employee"}</h2>

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
              />
            </div>
            <div className="error">
              {errors.Username && (
                <span className="error-text">{errors.Username}</span>
              )}
            </div>
          </div>

          {/* Password Input with Icon */}
          <div className="input-error">
            <div className="input-with-icon">
              <FaLock className="input-icon" />

              <input
                type={showPassword ? "text" : "password"} // Toggle input type between text and password
                placeholder="Password"
                value={newEmployee.Password || ""}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, Password: e.target.value })
                }
              />

              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
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
          <div className="erroe">
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
          <div className="error" style={{marginBottom:'10px'}}>
          {errors.Email && <span className="error-text">{errors.Email}</span>}
          </div>
          </div>

          <div className="modelbutton">
            <button onClick={handleSave} className="btn-editmodel">
              {editingEmployee ? "Update Employee" : "Add Employee"}
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

      {/* Employees Table */}
      <TableOne
        columns={columns}
        data={employees}
        handleDelete={(employee) =>
          triggerDeleteModal(
            employee.id,
            `${employee.FirstName} ${employee.LastName}`
          )
        }
        handleEdit={handleEdit}
      />
    </div>
  );
};

export default Employees;
