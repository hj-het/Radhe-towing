import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { FaPlus, FaSearch } from "react-icons/fa";
import TableOne from "../Table/TableOne";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../Style/payment.css"; // Reuse service CSS for styling
import {
  FaUser,
  FaCar,
  FaFileAlt,
  FaCalendarAlt,
  FaRupeeSign,
  FaImage,
} from "react-icons/fa";

Modal.setAppElement("#root");

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [plans, setPlans] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPayment, setEditingPayment] = useState(null);
  const [deletePaymentId, setDeletePaymentId] = useState(null);
  const [deletePaymentName, setDeletePaymentName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});
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
    Status: "P", // Default to 'Pending'
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Fetch all payments from the API
  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        "https://panel.radhetowing.com/api/payment-master"
      );
      setPayments(response.data);
      setFilteredPayments(response.data); // Initialize filteredPayments with full list of payments
      extractMembers(response.data); // Extract members from payments
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Extract unique members from payments data
  const extractMembers = (payments) => {
    const uniqueMembers = payments
      .map((payment) => payment.member)
      .filter(
        (member, index, self) =>
          self.findIndex((m) => m.M_id === member.M_id) === index
      ); // Filter unique members
    setMembers(uniqueMembers);
  };

  // Handle member change, and update vehicles and plans based on member selection
  const handleMemberChange = (memberId) => {
    setNewPayment({ ...newPayment, PM_M_id: memberId });

    const memberPayments = payments.filter(
      (p) => p.PM_M_id === parseInt(memberId)
    );

    // Extract unique vehicles based on the selected member
    const uniqueVehicles = [
      ...new Set(memberPayments.map((p) => p.vehicle.V_id)),
    ].map((id) => memberPayments.find((p) => p.vehicle.V_id === id).vehicle);

    // Extract unique plans based on the selected member
    const uniquePlans = [
      ...new Set(memberPayments.map((p) => p.plan.P_id)),
    ].map((id) => memberPayments.find((p) => p.plan.P_id === id).plan);

    setVehicles(uniqueVehicles); // Update vehicles for dropdown
    setPlans(uniquePlans); // Update plans for dropdown
  };

  // Handle save for new or edit payment
  const handleSavePayment = async () => {
    try {
      const formData = new FormData();
      formData.append("PM_M_id", newPayment.PM_M_id);
      formData.append("PM_V_id", newPayment.PM_V_id);
      formData.append("PM_P_id", newPayment.PM_P_id);
      formData.append("PM_plan_startdate", newPayment.PM_plan_startdate);
      formData.append("PM_expiredate", newPayment.PM_expiredate);
      formData.append("PM_Amount", newPayment.PM_Amount);
      formData.append(
        "PM_payment_recived_by",
        newPayment.PM_payment_recived_by
      );
      formData.append("PM_isCreateby", newPayment.PM_isCreateby);
      formData.append("PM_comment", newPayment.PM_comment);
      formData.append("Status", newPayment.Status);

      if (newPayment.PM_payment_ss_image) {
        formData.append("PM_payment_ss_image", newPayment.PM_payment_ss_image); // Add file to FormData
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
    setEditingPayment(null);
    setVehicles([]);
    setPlans([]);
  };

  // Handle opening modal for adding a new payment
  const handleOpenAddModal = () => {
    resetForm();
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

    // Filter payments based on the search query
    const filtered = payments.filter((payment) =>
      payment.member?.M_username.toLowerCase().includes(query)
    );

    setFilteredPayments(filtered); // Update the filtered payments state
  };

  // Table columns
  const columns = [
    {
      Header: "ID",
      accessor: "PM_id",
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
    { Header: "Start Date", accessor: "PM_plan_startdate" },
    { Header: "Expire Date", accessor: "PM_expiredate" },
    { Header: "Received By", accessor: "PM_payment_recived_by" },
    {
      Header: "Status",
      accessor: "Status",
      Cell: ({ row }) => {
        const statusMap = {
          A: "Accepted",
          P: "Pending",
          R: "Rejected",
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
            onChange={handleSearchChange} // Link search to filtering logic
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
                  <option key={member.M_id} value={member.M_id}>
                    {member.M_username}
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
                  <option key={vehicle.V_id} value={vehicle.V_id}>
                    {vehicle.V_vihicle_number}
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
                onChange={(e) =>
                  setNewPayment({ ...newPayment, PM_P_id: e.target.value })
                }
                disabled={!newPayment.PM_M_id}
              >
                <option value="">Select Plan</option>
                {plans.map((plan) => (
                  <option key={plan.P_id} value={plan.P_id}>
                    {plan.P_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Start Date */}
          <div className="date-payment">
            <div className="input-error-payment ">
              <div className="input-payment">
                <FaCalendarAlt className="icon" />
                <input
                  type="datetime-local"
                  value={newPayment.PM_plan_startdate}
                  onChange={(e) =>
                    setNewPayment({
                      ...newPayment,
                      PM_plan_startdate: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Expire Date */}
            <div className="input-error-payment">
              <div className="input-payment">
                <FaCalendarAlt className="icon" />
                <input
                  type="datetime-local"
                  value={newPayment.PM_expiredate}
                  onChange={(e) =>
                    setNewPayment({
                      ...newPayment,
                      PM_expiredate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Amount */}
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
              />
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
          setEditingPayment(payment);
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
