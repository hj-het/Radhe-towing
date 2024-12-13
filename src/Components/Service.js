import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import {
  FaPlus,
  FaSearch,
  FaUser,
  FaCar,
  // FaFileAlt,
  // FaCalendarAlt,
  FaLocationArrow,
  FaCommentAlt,
  FaExclamationCircle,
  FaWrench,
  FaEdit
  // FaClipboardCheck,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";

import TableOne from "../Table/TableOne";
import "./../Style/employees.css"; // Reuse employees CSS for styling
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../Style/service.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { IoWarningOutline } from "react-icons/io5";
Modal.setAppElement("#root");

const statusOptions = [
  { label: "Request", value: "R" },
  { label: "Accept", value: "A" },
  { label: "Decline", value: "D" },
  { label: "Processing", value: "P" },
  { label: "Complete", value: "C" },
];

const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [members, setMembers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [deleteServiceId, setDeleteServiceId] = useState(null);
  const [deleteServiceName, setDeleteServiceName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
 
  const [newService, setNewService] = useState({
    member_id: "",
    vehicle_id: "",
    datetime: getCurrentDateTime(),
    comments: "",
    location: "",
    status: "P",
    chargble: false,
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberDetails, setMemberDetails] = useState(null);
  const [completedCountModalIsOpen, setCompletedCountModalIsOpen] =
    useState(false); // Modal for showing response data
  const [completedCountData, setCompletedCountData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [completedCount, setCompletedCount] = useState(null); // State for completed count
  const [numOfTowing, setNumOfTowing] = useState(null);

  // console.log(getCurrentDateTime()); // Output: 'dd-mm-yyyy hh:mm AM/PM'

  // Fetch services and members
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://panel.radhetowing.com/api/towing-service-requests"
        );
        setServices(response.data);
        setFilteredServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
      setLoading(false);
    };

    const fetchMembers = async () => {
      try {
        const response = await axios.get(
          "https://panel.radhetowing.com/api/members"
        );
        setMembers(response.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchServices();
    fetchMembers();
  }, []);

  const handleMemberChange = async (e) => {
    const memberId = e.target.value;
    setNewService({ ...newService, member_id: memberId, vehicle_id: "" });
    setSelectedMember(memberId);
    setMemberDetails(null);
    setCompletedCount(null);
    setNumOfTowing(null);

    if (memberId) {
      fetchVehiclesForMember(memberId);
      fetchMemberDetails(memberId);
    }
  };
  const handleVehicleChange = async (e) => {
    const vehicleId = e.target.value;
    setNewService({ ...newService, vehicle_id: vehicleId });

    if (newService.member_id && vehicleId) {
      try {
        // Fetch completed count
        const completedCountResponse = await axios.get(
          `https://panel.radhetowing.com/api/towing-service-requests/completed-count/${newService.member_id}/${vehicleId}`
        );
        setCompletedCount(completedCountResponse.data.completed_count);

        // Fetch payment data for the member
        const paymentResponse = await axios.get(
          `https://panel.radhetowing.com/api/payment-master/member/${newService.member_id}`
        );

        // Ensure paymentResponse.data is an array
        const payments = Array.isArray(paymentResponse.data)
          ? paymentResponse.data
          : paymentResponse.data.data;

        // Convert vehicleId to the same type as PM_V_id for comparison (both to strings here)
        const matchedPayment = payments.find(
          (payment) => String(payment.PM_V_id) === String(vehicleId)
        );
        console.log("matchedPayment", matchedPayment);
        if (matchedPayment) {
          setNumOfTowing(matchedPayment.PM_num_of_towing);
        } else {
          console.warn(
            "No matching payment data found for the selected vehicle."
          );
          setNumOfTowing(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data.");
      }
    }
  };

  // Fetch member details
  const fetchMemberDetails = async (memberId) => {
    try {
      const response = await axios.get(
        `https://panel.radhetowing.com/api/members/${memberId}`
      );

      // Combine first_name and last_name for full name
      const fullName = `${response.data.first_name} ${response.data.last_name}`;
      setMemberDetails({
        full_name: fullName,
        contact: response.data.contact,
      });
    } catch (error) {
      console.error("Error fetching member details:", error);
      toast.error("Failed to fetch member details. Please try again.");
    }
  };

  // Fetch vehicles when a member is selected
  const fetchVehiclesForMember = async (memberId) => {
    try {
      const response = await axios.get(
        `https://panel.radhetowing.com/api/vehicles/member/${memberId}`
      );

      console.log("Response Data:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setVehicles(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        // If response.data.data is the array
        setVehicles(response.data.data);
      } else {
        setVehicles([]);
        console.warn("Unexpected response structure:", response);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Handle 404 specifically
        toast.error("No vehicles found for this member.");
      } else {
        // Generic error message for other errors
        console.error("Error fetching vehicles:", error);
        toast.error("Failed to fetch vehicles. Please try again.");
      }
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!newService.member_id) newErrors.member_id = "Member is required";
    if (!newService.vehicle_id) newErrors.vehicle_id = "Vehicle is required";
    if (!newService.datetime) newErrors.datetime = "Date and Time are required";
    if (!newService.location) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add a new service
  // Add a new service
  const handleAddService = async () => {
    try {
      // Log the newService data to ensure it contains all required fields
      console.log("Adding new service with data:", newService);

      const response = await axios.post(
        "https://panel.radhetowing.com/api/towing-service-requests",
        newService
      );

      console.log("Server Response:", response); // Log the server's response

      // Add the new service to the services list
      setServices([...services, response.data]);
      setFilteredServices([...services, response.data]);
      toast.success("Service added successfully");
    } catch (error) {
      // Enhanced error handling with detailed logs
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error("Server Error:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);

        toast.error(
          `Server Error: ${
            error.response.data.message || "Failed to add service"
          }`
        );
      } else if (error.request) {
        // No response received from server
        console.error("Network Error - No response received:", error.request);
        toast.error("Network Error: No response received from the server");
      } else {
        // Other errors during request setup
        console.error("Error:", error.message);
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  // Edit an existing service
  const handleEditService = async () => {
    try {
      const response = await axios.put(
        `https://panel.radhetowing.com/api/towing-service-requests/${editingService.id}`,
        newService
      );

      const updatedServices = services.map((service) =>
        service.id === editingService.id ? response.data : service
      );
      console.log("updatedServices->", updatedServices);
      setServices(updatedServices);
      setFilteredServices(updatedServices);
      toast.success("Service updated successfully");
    } catch (error) {
      console.error("Error editing service:", error);
      toast.error("Error editing service");
    }
  };

  // const handleEdit = async (service) => {
  //   setEditingService(service);
  //   setNewService({
  //     ...service,
  //     member_id: service.member.id,
  //     vehicle_id: service.vehicle.id,
  //   });
  //   setSelectedMember(service.member.id);
  //   await fetchVehiclesForMember(service.member.id); // Fetch vehicles when a member is selected
  //   setModalIsOpen(true);
  // };

  // Add or Edit a service
  const handleSave = () => {
    if (!validateForm()) return;

    if (editingService) {
      handleEditService();
    } else {
      handleAddService();
    }

    setModalIsOpen(false);
    resetForm();
    setMemberDetails(null);
    setCompletedCount(null);
    setNumOfTowing(null);
  };

  // Reset form to initial state
  const resetForm = () => {
    setNewService({
      member_id: "",
      vehicle_id: "",
      datetime: getCurrentDateTime(),
      comments: "",
      location: "",
      status: "P",
      chargble: false,
    });
    setEditingService(null);
    setVehicles([]);
    setMemberDetails(null);
    setCompletedCount(null);
    setNumOfTowing(null);
  };

  // Handle opening modal for adding a new service
  const handleOpenAddModal = () => {
    resetForm();
    setModalIsOpen(true);
    setMemberDetails(null);
    setCompletedCount(null);
    setNumOfTowing(null);
  };

  // Delete service
  const handleDelete = async (serviceId) => {
    try {
      await axios.delete(
        `https://panel.radhetowing.com/api/towing-service-requests/${serviceId}`
      );
      const updatedServices = services.filter(
        (service) => service.id !== serviceId
      );
      setServices(updatedServices);
      setFilteredServices(updatedServices);
      setShowDeleteModal(false);
      toast.success("Service deleted successfully");
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  // Trigger delete confirmation modal with member name
  const triggerDeleteModal = (service) => {
    const memberFullName = `${service.member.username}`;
    setDeleteServiceId(service.id);
    setDeleteServiceName(memberFullName);
    setShowDeleteModal(true);
  };

  // Filter services based on search and selected statuses
  useEffect(() => {
    const filtered = services.filter((service) => {
      const matchesSearch =
        service.member.username.toLowerCase().includes(searchQuery) ||
        service.vehicle.vehicle_number.toLowerCase().includes(searchQuery) ||
        service.location.toLowerCase().includes(searchQuery);

      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(service.status);

      return matchesSearch && matchesStatus;
    });
    setFilteredServices(filtered);
  }, [searchQuery, selectedStatuses, services]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Function to fetch completed count data based on member_id and vehicle_id
  const handleCompletedCount = async (memberId, vehicleId) => {
    if (!memberId || !vehicleId) {
      console.warn("Member ID or Vehicle ID is missing.");
      return;
    }
    setLoading(true); // Start loading
    try {
      // Fetch completed count data
      const completedCountResponse = await axios.get(
        `https://panel.radhetowing.com/api/towing-service-requests/completed-count/${memberId}/${vehicleId}`
      );
      setCompletedCountData(completedCountResponse.data);

      // Fetch payment data for the member
      const paymentResponse = await axios.get(
        `https://panel.radhetowing.com/api/payment-master/member/${memberId}`
      );

      // Filter payment data for the selected vehicle and Status: "A"
      const matchedPaymentData = paymentResponse.data.find(
        (payment) => payment.PM_V_id === vehicleId && payment.Status === "A"
      );

      if (matchedPaymentData) {
        setPaymentData(matchedPaymentData);

        // Extract `PM_num_of_towing` and set it as `numOfTowing`
        setNumOfTowing(matchedPaymentData.PM_num_of_towing || 0);
      } else {
        // Show toast message when no matching payment is found
        toast.error("Please make payment for this service to proceed.", {
          position: "top-right",
        });
        setPaymentData(null);
        setNumOfTowing(0); // Reset numOfTowing if no match is found
      }

      // Open the modal to display data
      setCompletedCountModalIsOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching data. Please try again.", {
        position: "top-right",
      });
    }
    setLoading(false); 
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
      accessor: (row) => row.member?.username || "Unknown",
    },
    {
      Header: "Vehicle Number",
      accessor: (row) => row.vehicle?.vehicle_number || "Unknown",
    },

    { Header: "Date & Time", accessor: "datetime" },
    { Header: "Location", accessor: "location" },
    { Header: "Comments", accessor: "comments" },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => {
        const statusMap = {
          // R: "Request",
          A: "Accept",
          D: "Decline",
          P: "Processing",
          C: "Complete",
        };

        const statusLabel = statusMap[row.original.status] || "Unknown";
        const statusColor =
          row.original.status === "P"
            ? "orange"
            : row.original.status === "A"
            ? "blue"
            : row.original.status === "D"
            ? "red"
            : row.original.status === "C"
            ? "green"
            : "grey";

        return (
          <span style={{ color: statusColor, fontWeight: "bold" }}>
            {statusLabel}
          </span>
        );
      },
    },
  ];

  return (
    <div className="services-page">
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
        <FaWrench /> Services
      </h1>

      {/* Add Service Button */}
      <div className="AddButton">
        <button onClick={handleOpenAddModal} className="add-btn">
          <FaPlus /> Add Service
        </button>
      </div>

      <div className="top-search">
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

        {/* Status Multi-Select Filter */}
        <div className="status-filter" style={{ width: "250px" }}>
          <Autocomplete
            multiple
            options={statusOptions}
            getOptionLabel={(option) => option.label}
            onChange={(event, newValue) => {
              setSelectedStatuses(newValue.map((option) => option.value));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Filter by Status"
                placeholder="Select statuses"
              />
            )}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add/Edit Service"
        className="modal"
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={false}
      >
        <h2>{editingService ? "Edit Service" : "Add Service"}</h2>

        <div className="form-service">
          {/* Member Dropdown */}
          <div className="input-error">
            <FaUser className="icon" />
            <select
              value={newService.member_id}
              onChange={handleMemberChange} // Handle member change
            >
              <option value="">Select Member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.username}
                </option>
              ))}
            </select>
            {errors.member_id && (
              <span className="error-text">{errors.member_id}</span>
            )}
          </div>

          {/* Display Member Details */}

          {memberDetails && (
            <div className="member-details">
              <p>
                <strong>Full Name:</strong> {memberDetails.full_name}
              </p>
              <p>
                <strong>Contact:</strong> {memberDetails.contact}
              </p>
            </div>
          )}

          {/* Vehicle Dropdown */}
          <div className="input-error">
            <FaCar className="icon" />
            <select
              value={newService.vehicle_id}
              onChange={handleVehicleChange} // Handle vehicle change
              disabled={!selectedMember}
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.vehicle_number}
                </option>
              ))}
            </select>
            {errors.vehicle_id && (
              <span className="error-text">{errors.vehicle_id}</span>
            )}
          </div>

          {/* Display Completed Count and Number of Towing if Available */}
          <div className="form-count-towing">
            {completedCount !== null && numOfTowing !== null && (
              <div className="towing-info">
                <p>
                  <strong>Used Towing Service:</strong> {completedCount} /{" "}
                  {numOfTowing}
                </p>
              </div>
            )}
          </div>

          {/* Date and Location */}
          {/* <div className="date-location"> */}
          {/* Date */}
          {/*<div className="input-error">
            <FaCalendarAlt className="icon" />
            <input
              type="date-time"
              value={newService.datetime}
              onChange={(e) =>
                setNewService({ ...newService, datetime: e.target.value })
              }
            />
            {errors.datetime && (
              <span className="error-text">{errors.datetime}</span>
            )}
          </div>*/}

          {/* Location */}
          <div className="input-error-location">
            <FaLocationArrow className="icon" />
            <input
              type="text"
              placeholder="Location"
              value={newService.location}
              onChange={(e) =>
                setNewService({ ...newService, location: e.target.value })
              }
            />
            {errors.location && (
              <span className="error-text">{errors.location}</span>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="input-error">
            <FaExclamationCircle className="icon" />
            <select
              value={newService.status}
              onChange={(e) =>
                setNewService({ ...newService, status: e.target.value })
              }
            >
              {/* <option value="R">Request</option> */}
              <option value="A">Accept</option>
              <option value="D">Decline</option>
              <option value="P">Processing</option>
              <option value="C">Complete</option>
            </select>
          </div>

          {/* Comments */}
          <div className="input-error-comment">
            <FaCommentAlt className="icon" />
            <textarea
              placeholder="Comments"
              value={newService.comments}
              onChange={(e) =>
                setNewService({ ...newService, comments: e.target.value })
              }
            />
          </div>

          <div className="modelbutton">
            <button onClick={handleSave} className="btn-editmodel">
              {editingService ? (
                <>
                  <FaEdit  /> Edit Service
                </>
              ) : (
                <>
                <FaPlus/> Add Service
                </>
              )}
            </button>
            <button
              className="btn-closemodel"
              onClick={() => setModalIsOpen(false)}
            >
               <MdCancel  /> Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal for completed count data */}
      {/* Modal for completed count and towing details */}
      <Modal
        isOpen={completedCountModalIsOpen}
        onRequestClose={() => setCompletedCountModalIsOpen(false)}
        contentLabel="Completed Service Count"
        className="modal"
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={false}
      >
        <h2 style={{ textAlign: "center" }}>Number of Towing Services</h2>
        {completedCountData && paymentData ? (
          <div className="completedCountData">
            {/* <p>
              <strong>Completed Count:</strong>{" "}
              {completedCountData.completed_count}
            </p>
            <p>
              <strong>Total Towing Allowed:</strong>{" "}
              {paymentData.PM_num_of_towing}
            </p> */}

            <p>
              Used Towing Service:{" "}
              <strong>
                {completedCountData.completed_count}/{" "}
                {paymentData.PM_num_of_towing}
              </strong>
            </p>
            <p>
              Remaining Towing:
              <strong>
                {" "}
                {paymentData.PM_num_of_towing -
                  completedCountData.completed_count}
              </strong>{" "}
            </p>
            <div className="Additional-charged">
              {paymentData.PM_num_of_towing -
                completedCountData.completed_count ===
                0 && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Additional towing will be charged!
                </p>
              )}
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <div className="close-completedCountData">
          <button
            onClick={() => setCompletedCountModalIsOpen(false)}
            className="btn-closemodel-service"
          >
            Close
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
              Are you sure you want to permanent delete service for{" "}
              <span style={{ fontWeight: 700, color: "#ee5757" }}>
                {deleteServiceName}
              </span>
              ?
            </p>
            <div className="modal-buttons">
              <button
                className="btn-confirm"
                onClick={() => handleDelete(deleteServiceId)}
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

      {/* Services Table */}
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <TableOne
          columns={columns}
          data={filteredServices.slice().reverse()}
          handleDelete={(service) => triggerDeleteModal(service)}
          handleEdit={async (service) => {
            console.log("service-->", service);
            console.log("member.id", service.member.id);
            setEditingService(service);
            setNewService({
              member_id: service.member.id,
              vehicle_id: service.vehicle.id,
              datetime: service.datetime,
              comments: service.comments,
              location: service.location,
              status: service.status,
              chargble: false,
            });
            setMemberDetails(null);
            setSelectedMember(service.member.id);
            await fetchVehiclesForMember(service.member.id);
            setCompletedCount(null);
            setNumOfTowing(null);
            setModalIsOpen(true);
          }}
          isServiceTable={true}
          handleCompletedCount={handleCompletedCount}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default Services;
