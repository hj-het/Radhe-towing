import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { FaPlus, FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../Style/payment.css";
import {
  FaUser,
  FaCar,
  FaFileAlt,
  FaRupeeSign,
  FaImage,
  FaMoneyBillAlt,
} from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import TableOne from "../Table/TableOne";

Modal.setAppElement("#root");

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [plans, setPlans] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPayment, setEditingPayment] = useState(null); // For tracking edit state
  const [deletePaymentId, setDeletePaymentId] = useState(null);
  const [deletePaymentName, setDeletePaymentName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false); // For image modal
  const [selectedImage, setSelectedImage] = useState(""); // To store selected image URL
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);
  const [newPayment, setNewPayment] = useState({
    PM_M_id: "",
    PM_V_id: "",
    PM_P_id: "",
    PM_plan_startdate: "",
    PM_expiredate: "",
    PM_Amount: "",
    PM_payment_ss_image: "",
    PM_payment_recived_by: "",
    PM_isCreateby: "",
    PM_comment: "",
    Status: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  
  useEffect(() => {
    const fetchPayments = async () => {
      const storedRole = localStorage.getItem("role");
      const storedUser = JSON.parse(localStorage.getItem("user"));
  
      setRole(storedRole);
      setUser(storedUser);
  
      setLoading(true); // Show loader while fetching data
  
      try {
        if (storedRole === "employee" && storedUser?.id) {
          // Fetch payments for employees only
          const employeePayments = await fetchPaymentsForEmployee(storedUser.id);
          setPayments(employeePayments); // Set raw payments for employees
          setFilteredPayments(employeePayments); // Set filtered payments for employees
        } else if (storedRole === "admin") {
          // Fetch all payments for admin only
          const allPayments = await fetchAllPayments();
          setPayments(allPayments); // Set raw payments for admin
          setFilteredPayments(allPayments); // Set filtered payments for admin
        } else {
          toast.error("Invalid role or user data.");
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
        toast.error("Failed to fetch payments.");
      } finally {
        setLoading(false); // Hide loader
      }
    };
  
    fetchPayments();
  }, []); // Run this effect once when the component mounts
  

  const fetchAllPayments = async () => {
    console.log("nbhdghsd")
    try {
      const response = await axios.get("https://panel.radhetowing.com/api/payment-master");
      setPayments(response.data);
      setFilteredPayments(response.data);
    } catch (error) {
      console.error("Error fetching all payments:", error);
      toast.error("Failed to fetch payments.");
    }
  };

  const fetchPaymentsForEmployee = async (employeeId) => {
    console.log("employee")
    try {
      const response = await axios.get(
        `https://panel.radhetowing.com/api/payment-master/employee/${employeeId}`
      );
      const employeePayments = response.data.data; // Assuming the response contains payments in `data.data`
      setPayments(employeePayments);
      setFilteredPayments(employeePayments);
    } catch (error) {
      console.error("Error fetching payments for employee:", error);
      toast.error("Failed to fetch payments for the employee.");
    }
  };
  

  
  
  

  // Fetch members from the API
  const fetchMembers = async () => {
    try {
      const response = await axios.get(
        "https://panel.radhetowing.com/api/members"
      );
      setMembers(response.data); // Store the member data in state
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  // Fetch plans from the API
  const fetchPlans = async () => {
    try {
      const response = await axios.get(
        "https://panel.radhetowing.com/api/plans"
      );
      setPlans(response.data.plans); // Store all plans in state
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  // Fetch employees from the API
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "https://panel.radhetowing.com/api/employees"
      );
      setEmployees(response.data.data); // Assuming 'data' contains the list of employees
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Error fetching employees. Please try again.");
    }
  };

  // Fetch employees on component mount
  useEffect(() => {
    fetchAllPayments();
    fetchPlans();
    fetchEmployees(); // Fetch all employees when the component mounts
  }, []);

  // Handle member change, fetch vehicles based on the selected member ID
  const handleMemberChange = async (memberId) => {
    try {
      setVehicles([]); // Clear previous vehicles
      setNewPayment((prev) => ({ ...prev, PM_M_id: memberId })); // Set selected member ID

      const response = await axios.get(
        `https://panel.radhetowing.com/api/vehicles/member/${memberId}`
      );

      if (!response.data.success) {
        toast.error(
          response.data.message || "No vehicles found for this member."
        );
        return;
      }

      const memberVehicles = response.data.data;
      setVehicles(memberVehicles); // Update vehicles for dropdown

      // If there's already a selected vehicle, make sure it's still selected
      setNewPayment((prev) => ({
        ...prev,
        PM_V_id: editingPayment ? editingPayment.PM_V_id : "", // Retain selected vehicle ID during editing
      }));
    } catch (error) {
      console.error("Error fetching vehicles for member:", error);
      toast.error("Error fetching vehicles. Please try again.");
    }
  };

  // Handle Plan Change: set price in amount field when a plan is selected
  const handlePlanChange = (planId) => {
    const selectedPlan = plans.find((plan) => plan.id === parseInt(planId));
    if (selectedPlan) {
      setNewPayment({
        ...newPayment,
        PM_P_id: planId,
        PM_Amount: selectedPlan.price, // Set the plan price in the amount field
      });
    }
  };

  const handleAddPayment = async () => {
    try {
      const formData = new FormData();
      formData.append("PM_M_id", newPayment.PM_M_id);
      formData.append("PM_V_id", newPayment.PM_V_id);
      formData.append("PM_P_id", newPayment.PM_P_id);
      formData.append("PM_Amount", newPayment.PM_Amount);
      formData.append(
        "PM_payment_recived_by",
        newPayment.PM_payment_recived_by
      );
      formData.append("PM_isCreateby", newPayment.PM_isCreateby);
      formData.append("PM_comment", newPayment.PM_comment);
      formData.append("Status", newPayment.Status);

      if (newPayment.PM_payment_ss_image) {
        formData.append("PM_payment_ss_image", newPayment.PM_payment_ss_image);
      }

      // Add new payment
      await axios.post(
        "https://panel.radhetowing.com/api/payment-master",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Payment added successfully!");
      setModalIsOpen(false);
      fetchAllPayments(); // Refresh the payments list after save
    } catch (error) {
      console.error("Error adding payment:", error);
      toast.error("Error adding payment");
    }
  };

  const handleEditPayment = async () => {
    const paymentId = editingPayment.PM_id;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      PM_isUpdateby: "Admin",
      PM_payment_recived_by: newPayment.PM_payment_recived_by,
      Status: newPayment.Status,
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `https://panel.radhetowing.com/api/payment-master/${paymentId}`,
        requestOptions
      );
      const result = await response.json();

      if (response.ok) {
        toast.success("Payment updated successfully!");
        setModalIsOpen(false);
        fetchAllPayments(); // Refresh the payments list after save
      } else {
        throw new Error(result.message || "Error updating payment");
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error("Error updating payment");
    }
  };

  const handleSavePayment = () => {
    if (editingPayment) {
      handleEditPayment(); // Call edit if editing
    } else {
      handleAddPayment(); // Call add if creating new payment
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setNewPayment({
      PM_M_id: "",
      PM_V_id: "",
      PM_P_id: "",
      PM_plan_startdate: "",
      PM_expiredate: "",
      PM_Amount: "",
      PM_payment_ss_image: "",
      PM_payment_recived_by: "",
      PM_isCreateby: "",
      PM_comment: "",
      Status: "P", // Default to 'Pending'
    });
    setEditingPayment(null); // Reset editing state to avoid editing mode when adding a new payment
    setVehicles([]); // Reset vehicles when form is reset
  };

  // Handle opening modal for adding a new payment
  const handleOpenAddModal = () => {
    resetForm(); // Reset form when adding new payment
    fetchMembers(); // Fetch members when opening the modal
    setModalIsOpen(true);
  };

  // Delete payment
  const handleDelete = async (paymentId) => {
    try {
      await axios.delete(
        `https://panel.radhetowing.com/api/payment-master/${paymentId}`
      );
      const updatedPayments = payments.filter(
        (payment) => payment.PM_id !== paymentId
      );
      setPayments(updatedPayments);
      setFilteredPayments(updatedPayments);
      setShowDeleteModal(false);
      toast.success("Payment deleted successfully");
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  // Trigger delete confirmation modal
  const triggerDeleteModal = (payment) => {
    const memberName = payment.member?.M_username || "Unknown";
    setDeletePaymentId(payment.PM_id);
    setDeletePaymentName(memberName);
    setShowDeleteModal(true);
  };

  // Handle search
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = payments.filter((payment) =>
      payment.member?.M_username.toLowerCase().includes(query)
    );

    setFilteredPayments(filtered); // Update the filtered payments state
  };

  // Function to open the image modal with the selected image URL
  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalIsOpen(true);
  };

  // Close the image modal
  const closeImageModal = () => {
    setImageModalIsOpen(false);
    setSelectedImage("");
  };

  // Table columns
  const columns = [
    {
      Header: "ID",
      accessor: (row, index) => index + 1,
      id: "index",
    },
    {
      Header: "Member Username",
      accessor: (row) => row.member?.M_username || "Unknown",
    },
    {
      Header: "Vehicle Number",
      accessor: (row) => row.vehicle?.V_vihicle_number || "Unknown",
    },
    { Header: "Plan Name", accessor: (row) => row.plan?.P_name || "Unknown" },
    {
      Header: "Amount",
      accessor: "PM_Amount",
      Cell: ({ value }) => `₹ ${value}`,
    },

    {
      Header: "Expire Date",
      accessor: (row) => new Date(row.PM_expiredate).toLocaleDateString(),
    },
     {
      Header: "Received By",
      accessor: (row) => {
        if (!employees || employees.length === 0) {
          return "Loading...";
        }

        const employee = employees.find(
          (emp) => emp.id === parseInt(row.PM_payment_recived_by)
        );

        return employee
          ? employee.Username || `${employee.FirstName} ${employee.LastName}`
          : "Unknown";
      },
    },

    {
      Header: "Image",
      accessor: "PM_payment_ss_image",
      Cell: ({ row }) => {
        let imagePath = row.original.PM_payment_ss_image;
    
        if (imagePath) {
          // Ensure the base URL is consistent
          if (!imagePath.startsWith("http")) {
            imagePath = `https://panel.radhetowing.com/${imagePath.replace(
              /\\/g,
              ""
            ).replace(/\/+/g, "/")}`;
          }
    
      
          imagePath = imagePath.replace(/\\/g, "").replace(/\/+/g, "/");
          // console.log("imagePath",imagePath)
        }
    
        return imagePath ? (
          <img
            src={imagePath}
            alt="Imagess"
            style={{ width: "30px", height: "30px", objectFit: "cover" }}
            onClick={() => openImageModal(imagePath)}
          />
        ) : (
          <span>No Image</span>
        );
      },
    },
    

    {
      Header: "Status",
      accessor: "Status",
      Cell: ({ row }) => {
        const statusMap = {
          A: { label: "Accepted", color: "green" },
          P: { label: "Pending", color: "orange" },
          R: { label: "Rejected", color: "gray" },
          E: { label: "Expired", color: "red" },
          U: { label: "Used", color: "Blue" },
          
        };

        const status = statusMap[row.original.Status] || {
          label: "Unknown",
          color: "black",
        };

        return (
          <span style={{ color: status.color, fontWeight: "bold" }}>
            {status.label}
          </span>
        );
      },
    },
  ];

  return (
    <div className="payments-page">
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
        <FaMoneyBillAlt /> Payments
      </h1>

      {/* Add Payment Button */}
      <div className="AddButton">
        <button onClick={handleOpenAddModal} className="add-btn">
          <FaPlus /> Add Payment
        </button>
      </div>

      {/* Search Input */}
      <div className="search-bar">
        <div className="search-input-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by member"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add/Edit Payment"
        className="modal"
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={false}
      >
        <h2>{editingPayment ? "Edit Payment" : "Add Payment"}</h2>

        <div className="form-payment">
          {/* Show member's username and vehicle number in h4 when editing */}

          {editingPayment && (
            <div className="member-info">
              {editingPayment.member && (
                <div className="member-label-pyt">
                  <p>Member Name: </p>
                  <h4>{editingPayment.member.M_username}</h4>
                </div>
              )}

              {editingPayment.vehicle && (
                <div className="vehicle-label-pyt">
                  <p>Vehicle No:</p>
                  <h4>{editingPayment.vehicle.V_vihicle_number}</h4>
                </div>
              )}
            </div>
          )}

          {/* Member Dropdown */}
          {!editingPayment && (
            <div className="input-error-payment">
              <div className="input-payment">
                <FaUser className="icon" />
                <select
                  value={newPayment.PM_M_id} // Correctly bind the selected value
                  onChange={(e) => handleMemberChange(e.target.value)} // Handle member change
                >
                  <option value="">Select Member</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.username}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Vehicle Dropdown */}
          {!editingPayment && (
            <div className="input-error-payment">
              <div className="input-payment">
                <FaCar className="icon" />
                <select
                  value={newPayment.PM_V_id}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, PM_V_id: e.target.value })
                  }
                  disabled={!newPayment.PM_M_id}
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.vehicle_number}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Plan Dropdown */}
          <div className="input-error-payment">
            <div className="input-payment">
              <FaFileAlt className="icon" />
              <select
                value={newPayment.PM_P_id}
                onChange={(e) => handlePlanChange(e.target.value)}
                disabled={!!editingPayment}
              >
                <option value="">Select Plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount (Plan Price) */}
          <div className="input-error-payment">
            <div className="input-payment">
              <FaRupeeSign className="icon" />
              <input
                type="number"
                placeholder="Amount"
                value={newPayment.PM_Amount}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, PM_Amount: e.target.value })
                }
                disabled={!!editingPayment}
              />
            </div>
          </div>
          {editingPayment && (
            <div className="input-error-payment">
              <div className="input-payment">
                <FaUser className="icon" />
                <select
                  value={newPayment.PM_payment_recived_by} // Bind the selected value
                  onChange={(e) =>
                    setNewPayment({
                      ...newPayment,
                      PM_payment_recived_by: e.target.value, // Update state on change
                    })
                  }
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.Username ||
                        `${employee.FirstName} ${employee.LastName}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Status Dropdown */}
          <div className="input-error-payment">
            <div className="input-payment">
              <MdOutlinePendingActions className="icon" />
              <select
                value={newPayment.Status}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, Status: e.target.value })
                }
                disabled={!editingPayment} // Disable dropdown for adding new payments
              >
                <option value="P">Pending</option>
                <option value="A">Accepted</option>
                <option value="R">Rejected</option>
                <option value="E">Expired</option>
                <option value="U">Used</option>

              </select>
            </div>
          </div>

          {/* Payment Screenshot */}
          {!editingPayment && (
            <div className="input-error-payment">
              <div className="input-payment">
                <FaImage className="icon" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewPayment({
                      ...newPayment,
                      PM_payment_ss_image: e.target.files[0],
                    })
                  }
                />
              </div>
            </div>
          )}

          <div className="modelbutton">
            <button onClick={handleSavePayment} className="btn-editmodel">
              {editingPayment ? "Edit Payment" : "Add Payment"}
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
              Are you sure you want to delete payment for{" "}
              <span style={{ fontWeight: 700, color: "#ee5757" }}>
                {deletePaymentName}
              </span>
              ?
            </p>
            <div className="modal-buttons">
              <button
                className="btn-confirm"
                onClick={() => handleDelete(deletePaymentId)}
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

      {/* Image Modal */}
      <Modal
        isOpen={imageModalIsOpen}
        onRequestClose={closeImageModal}
        contentLabel="View Image"
        className="image-modal"
        overlayClassName="modal-overlay"
      >
        <img
          src={selectedImage}
          alt="Payment Proof"
          style={{ width: "100%", height: "500px" }}
        />
        <button onClick={closeImageModal} className="btn-closemodel">
          Close
        </button>
      </Modal>


  {/* Payments Table */}
{loading ? (
  <div className="loader-container">
    <div className="loader"></div>
    <p>Loading...</p>
  </div>
) : (
  <TableOne
    columns={columns}
    data={Array.isArray(filteredPayments) 
      ? [...filteredPayments].reverse() // Safely reverse the array
      : []}
    handleDelete={(payment) => triggerDeleteModal(payment)}
    handleEdit={(payment) => {
      setEditingPayment(payment);
      setNewPayment(payment);
      setModalIsOpen(true);
    }}
  />
)}


      <ToastContainer />
    </div>
  );
};

export default Payments;