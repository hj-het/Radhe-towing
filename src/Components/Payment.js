import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { FaPlus, FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../Style/payment.css";
import { FaUser, FaCar, FaFileAlt, FaRupeeSign, FaImage } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import TableOne from "../Table/TableOne";

Modal.setAppElement("#root");

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]); // Store members data
  const [vehicles, setVehicles] = useState([]);
  const [plans, setPlans] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPayment, setEditingPayment] = useState(null);
  const [deletePaymentId, setDeletePaymentId] = useState(null);
  const [deletePaymentName, setDeletePaymentName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  // Fetch all payments from the API
  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        "https://panel.radhetowing.com/api/payment-master"
      );
      setPayments(response.data);
      setFilteredPayments(response.data); // Initialize filteredPayments with full list of payments
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchPlans(); // Fetch all plans on component mount
  }, []);

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
      const response = await axios.get("https://panel.radhetowing.com/api/plans");
      setPlans(response.data.plans); // Store all plans in state
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

// Handle member change, fetch vehicles based on the selected member ID
const handleMemberChange = async (memberId) => {
  try {
    setVehicles([]);
    setNewPayment({ ...newPayment, PM_M_id: memberId });

    const response = await axios.get(
      `https://panel.radhetowing.com/api/vehicles/member/${memberId}`
    );

    // Check if the API returns success or not
    if (response.data.error) {
      toast.error(response.data.message || "No vehicles found for this member.");
      return;
    }

    const memberVehicles = response.data.data;
    setVehicles(memberVehicles); // Update vehicles for dropdown

  } catch (error) {
    console.error("Error fetching vehicles for member:", error);
    toast.error("Error fetching vehicles. Please try again.");
  }
};


  // Handle save for new or edit payment
  const handleSavePayment = async () => {
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

      if (editingPayment) {
        // Update payment
        await axios.put(
          `https://panel.radhetowing.com/api/payment-master/${editingPayment.PM_id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Payment updated successfully!");
      } else {
        // Add new payment
        await axios.post(
          "https://panel.radhetowing.com/api/payment-master",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Payment added successfully!");
      }

      setModalIsOpen(false);
      fetchPayments(); // Refresh the payments list after save
    } catch (error) {
      console.error("Error saving payment:", error);
      toast.error("Error saving payment");
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
    setVehicles([]); // Reset vehicles when form is reset
  };

  // Handle opening modal for adding a new payment
  const handleOpenAddModal = () => {
    resetForm();
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
    { Header: "Amount", accessor: "PM_Amount" },
    {
      Header: "Expire Date",
      accessor: (row) => new Date(row.PM_expiredate).toLocaleDateString(),
    },
    { Header: "Received By", accessor: "PM_payment_recived_by" },
    {
      Header: "Status",
      accessor: "Status",
      Cell: ({ row }) => {
        const statusMap = {
          A: "Accepted",
          P: "Pending",
          R: "Rejected",
          E: "Expired",
        };
        return <span>{statusMap[row.original.Status] || "Unknown"}</span>;
      },
    },
  ];

  return (
    <div className="payments-page">
      <h1>Payments</h1>

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
        <h2>{editingPayment ? "Edit Payment" : "Add New Payment"}</h2>

        <div className="form-payment">
          {/* Member Dropdown */}
          <div className="input-error-payment">
            <div className="input-payment">
              <FaUser className="icon" />
              <select
                value={newPayment.PM_M_id}
                onChange={(e) => handleMemberChange(e.target.value)}
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

          {/* Vehicle Dropdown */}
          <div className="input-error-payment">
            <div className="input-payment">
              <FaCar className="icon" />
              <select
                value={newPayment.PM_V_id}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, PM_V_id: e.target.value })
                }
                disabled={!newPayment.PM_M_id} // Disable if no member is selected
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

          {/* Plan Dropdown */}
          <div className="input-error-payment">
            <div className="input-payment">
              <FaFileAlt className="icon" />
              <select
                value={newPayment.PM_P_id}
                onChange={(e) => handlePlanChange(e.target.value)} // Handle plan selection
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
                } // Allow users to modify the amount
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="input-error-payment">
            <div className="input-payment">
              <MdOutlinePendingActions className="icon" />
              <select
                value={newPayment.Status}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, Status: e.target.value })
                }
              >
                <option value="P">Pending</option>
                <option value="A">Accepted</option>
                <option value="R">Rejected</option>
                <option value="E">Expired</option>
              </select>
            </div>
          </div>

          {/* Payment Screenshot */}
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

          <div className="modelbutton">
            <button onClick={handleSavePayment} className="btn-editmodel">
              {editingPayment ? "Update Payment" : "Add Payment"}
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

      {/* Payments Table */}
      <TableOne
        columns={columns}
        data={filteredPayments.length > 0 ? filteredPayments : payments} // Conditionally render filtered payments or all payments
        handleDelete={(payment) => triggerDeleteModal(payment)}
        handleEdit={(payment) => {
          setEditingPayment(editingPayment);
          setNewPayment(payment);
          setModalIsOpen(true);
        }}
      />

      {/* Toast Container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default Payments;
