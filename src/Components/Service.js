import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import {
  FaPlus,
  FaSearch,
  FaUser,
  FaCar,
  // FaFileAlt,
  FaCalendarAlt,
  FaLocationArrow,
  FaCommentAlt,
  FaExclamationCircle,
  // FaClipboardCheck,
} from "react-icons/fa";
import TableOne from "../Table/TableOne";
import "./../Style/employees.css"; // Reuse employees CSS for styling
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../Style/service.css";

Modal.setAppElement("#root");

const Services = () => {
  const [services, setServices] = useState([]);
  const [members, setMembers] = useState([]);
  const [vehicles, setVehicles] = useState([]); // State to store vehicles related to a member
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingService, setEditingService] = useState(null);
  const [deleteServiceId, setDeleteServiceId] = useState(null);
  const [deleteServiceName, setDeleteServiceName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [newService, setNewService] = useState({
    member_id: "",
    vehicle_id: "",
    datetime: "",
    comments: "",
    location: "",
    status: "P",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const getCurrentDateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };

  // console.log(getCurrentDateTime()); // Output: 'dd-mm-yyyy hh:mm AM/PM'

  // Fetch services and members
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "https://panel.radhetowing.com/api/towing-service-requests"
        );
        setServices(response.data);
        setFilteredServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
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


  const handleMemberChange = (e) => {
    const memberId = e.target.value;
    console.log("memberId",memberId)
    setNewService({ ...newService, member_id: memberId, vehicle_id: "" });
    setSelectedMember(memberId);
    if (memberId) fetchVehiclesForMember(memberId); 
  };

  
  // Fetch vehicles when a member is selected
  const fetchVehiclesForMember = async (memberId) => {
    try {
      const response = await axios.get(`https://panel.radhetowing.com/api/vehicles/member/${memberId}`);
      
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
  const handleAddService = async () => {
    try {
      const response = await axios.post(
        "https://panel.radhetowing.com/api/towing-service-requests",
        newService
      );
      // Add the new service to the services list
      setServices([...services, response.data]);
      setFilteredServices([...services, response.data]);
      toast.success("Service added successfully");
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error("Error adding service");
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
      chargble: "false",
    });
    setEditingService(null);
    setVehicles([]);
  };

  // Handle opening modal for adding a new service
  const handleOpenAddModal = () => {
    resetForm();
    setModalIsOpen(true);
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

  // Handle search
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = services.filter(
      (service) =>
        service.member.username.toLowerCase().includes(query) ||
        service.vehicle.vehicle_number.toLowerCase().includes(query) ||
        service.location.toLowerCase().includes(query)
    );
    setFilteredServices(filtered);
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
          R: "Request",
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
      <h1>Services</h1>

      {/* Add Service Button */}
      <div className="AddButton">
        <button onClick={handleOpenAddModal} className="add-btn">
          <FaPlus /> Add Service
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
        contentLabel="Add/Edit Service"
        className="modal"
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={false}
      >
        <h2>{editingService ? "Edit Service" : "Add New Service"}</h2>

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

     {/* Vehicle Dropdown */}
     <div className="input-error">
            <FaCar className="icon" />
            <select
              value={newService.vehicle_id}
              onChange={(e) => setNewService({ ...newService, vehicle_id: e.target.value })}
              disabled={!selectedMember}
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.vehicle_number}
                </option>
              ))}
            </select>
            {errors.vehicle_id && <span className="error-text">{errors.vehicle_id}</span>}
          </div>


          {/* Date and Location */}
          {/* <div className="date-location"> */}
          {/* Date */}
          <div className="input-error">
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
          </div>

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
              <option value="R">Request</option>
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
              {editingService ? "Update Service" : "Add Service"}
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
              Are you sure you want to delete service for{" "}
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
      <TableOne
        columns={columns}
        data={filteredServices}
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
          setSelectedMember(service.member.id);
          await fetchVehiclesForMember(service.member.id);

          setModalIsOpen(true);
        }}
      />

      <ToastContainer />
    </div>
  );
};

export default Services;
