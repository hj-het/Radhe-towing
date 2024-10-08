import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { FaPlus } from "react-icons/fa";
import TableOne from "../Table/TableOne";
import "./../Style/employees.css";


Modal.setAppElement("#root"); 

const Employees = () => {
  const [employees, setEmployees] = useState([]); 
  const [editingEmployee, setEditingEmployee] = useState(null); 
  const [newEmployee, setNewEmployee] = useState({
    Username: "",
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
          FirstName: emp.FirstName,
          LastName: emp.LastName,
          DOB: emp.DOB,
          DOJ: emp.DOJ,
          Contact: emp.Contact,
          Email: emp.Email,
        }));
        setEmployees(employeeData);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Handle delete operation
  const handleDelete = (employee) => {
    setEmployees(employees.filter((e) => e.id !== employee.id));
  };

  // Handle edit operation
const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setNewEmployee(employee); // Populate the form with the selected employee's data
    setModalIsOpen(true);
};
  // Handle form submission for both adding and updating employees
  const handleSave = () => {
    if (editingEmployee) {
      setEmployees(
        employees.map((e) =>
          e.id === editingEmployee.id ? editingEmployee : e
        )
      );
      setEditingEmployee(null);
    } else {
      const newId = employees.length
        ? employees[employees.length - 1].id + 1
        : 1;
      setEmployees([...employees, { id: newId, ...newEmployee }]);
    }

    // Reset the form
    setNewEmployee({
      Username: "",
      FirstName: "",
      LastName: "",
      DOB: "",
      DOJ: "",
      Contact: "",
      Email: "",
    });
    setModalIsOpen(false); // Close the modal after saving
  };

  // Table columns
  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Username", accessor: "Username" },
    { Header: "First Name", accessor: "FirstName" },
    { Header: "Last Name", accessor: "LastName" },
    { Header: "DOB", accessor: "DOB" },
    { Header: "DOJ", accessor: "DOJ" },
    { Header: "Contact", accessor: "Contact" },
    { Header: "Email", accessor: "Email" },
  ];

  return (
    <div className="employees-page">
      <h1>Employees Management</h1>

      {/* Add Employee Button */}
      <div className="AddButton">
      <button onClick={() => setModalIsOpen(true)} className="add-btn">
        <FaPlus /> Add Employee
      </button>
       </div>

   

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add/Edit Member"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>{editingEmployee ? "Edit Employee" : "Add New Employee"}</h2>
        
        <div className="form">
          <input
            type="text"
            placeholder="Username"
            value={newEmployee.Username}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, Username: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="First Name"
            value={newEmployee.FirstName}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, FirstName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Last Name"
            value={newEmployee.LastName}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, LastName: e.target.value })
            }
          />
          <input
            type="date"
            placeholder="Date of Birth"
            value={newEmployee.DOB}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, DOB: e.target.value })
            }
          />
          <input
            type="date"
            placeholder="Date of Joining"
            value={newEmployee.DOJ}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, DOJ: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Contact"
            value={newEmployee.Contact}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, Contact: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            value={newEmployee.Email}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, Email: e.target.value })
            }
          />
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

      {/* Employees Table */}
      <TableOne
        columns={columns}
        data={employees}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    </div>
  );
};

export default Employees;
