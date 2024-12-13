import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import {
  FaPlus,
  FaUser,
  FaCar,
  FaCalendarAlt,
  FaDollarSign,
  FaCommentAlt,
  FaUserEdit,
  FaAddressCard,
  FaSearch,
  FaEdit,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import TableOne from "../Table/TableOne";
import "./../Style/vehicle.css";
import { toast, ToastContainer } from "react-toastify";
import { FormControlLabel, Switch } from "@mui/material"; // Import Material-UI components
import { IoWarningOutline } from "react-icons/io5";
Modal.setAppElement("#root");

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [members, setMembers] = useState([]);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [deleteVehicleId, setDeleteVehicleId] = useState(null);
  const [deleteVehicleName, setDeleteVehicleName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [newVehicle, setNewVehicle] = useState({
    member_id: "",
    vehicle_number: "",
    vehicle_type: "",
    vehicle_age: "",
    name: "",
    notes: "",
    is_active: true,
    amount: "",
  });

  // Fetch vehicles and members data from the API
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://panel.radhetowing.com/api/vehicles"
        );
        setVehicles(response.data.data);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
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

    fetchVehicles();
    fetchMembers();
  }, []);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!newVehicle.member_id) newErrors.member_id = "* Member is required";
    if (!newVehicle.vehicle_number)
      newErrors.vehicle_number = "* Vehicle number is required";
    if (!newVehicle.vehicle_type)
      newErrors.vehicle_type = "* Vehicle type is required";
    if (!newVehicle.name) newErrors.name = "* Name is required";
    if (!newVehicle.vehicle_age)
      newErrors.vehicle_age = "* Vehicle age is required";
    if (!newVehicle.amount) newErrors.amount = "* Amount is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add a new vehicle
  const addVehicle = async () => {
    if (!validateForm()) return;
    try {
      const response = await axios.post(
        "https://panel.radhetowing.com/api/vehicles",
        newVehicle
      );
      if (response.status === 201) {
        setVehicles([...vehicles, { id: response.data.id, ...newVehicle }]);
        setModalIsOpen(false);
        toast.success("Vehicle added successfully!");
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast.error("Failed to add vehicle.");
    }
  };

  // Edit/Edit a vehicle
  const editVehicle = async () => {
    if (!validateForm()) return;
    try {
      const response = await axios.put(
        `https://panel.radhetowing.com/api/vehicles/${editingVehicle.id}`,
        newVehicle
      );
      if (response.status === 200) {
        setVehicles(
          vehicles.map((v) =>
            v.id === editingVehicle.id ? { ...v, ...newVehicle } : v
          )
        );
        setEditingVehicle(null);
        setModalIsOpen(false);
        toast.success("Vehicle updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to Edit vehicle.");
    }
  };

  // Open edit form with the specific vehicle data
  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setNewVehicle(vehicle);
    setModalIsOpen(true);
  };

  // Handle save operation
  const handleSave = () => {
    if (editingVehicle) {
      editVehicle();
    } else {
      addVehicle();
    }
  };

  // Open the "Add Vehicle" modal with empty form
  const handleOpenAddModal = () => {
    setNewVehicle({
      member_id: "",
      vehicle_number: "",
      vehicle_type: "",
      vehicle_age: "",
      name: "",
      notes: "",
      is_active: true,
      amount: "",
    });
    setEditingVehicle(null);
    setModalIsOpen(true);
    setErrors({});
  };

  // Handle delete operation
  const handleDelete = async (vehicleId) => {
    try {
      const response = await axios.delete(
        `https://panel.radhetowing.com/api/vehicles/${vehicleId}`
      );

      if (response.status === 200) {
        setVehicles(vehicles.filter((v) => v.id !== vehicleId));
        setShowDeleteModal(false);
        toast.success("Vehicle deleted successfully!");
      } else {
        console.error("Error deleting vehicle:", response.data.message);
        toast.error("Failed to delete vehicle.");
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Failed to delete vehicle.");
    }
  };

  // Trigger delete confirmation modal
  const triggerDeleteModal = (vehicleId, vehicleName) => {
    setDeleteVehicleId(vehicleId);
    setDeleteVehicleName(vehicleName);
    setShowDeleteModal(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchValue = searchQuery.toLowerCase();

    return (
      (vehicle.vehicle_number &&
        vehicle.vehicle_number.toLowerCase().includes(searchValue)) ||
      (vehicle.vehicle_type &&
        vehicle.vehicle_type.toLowerCase().includes(searchValue)) ||
      (vehicle.vehicle_age &&
        String(vehicle.vehicle_age).toLowerCase().includes(searchValue)) ||
      (vehicle.name && vehicle.name.toLowerCase().includes(searchValue)) ||
      (vehicle.notes && vehicle.notes.toLowerCase().includes(searchValue)) ||
      (vehicle.amount &&
        String(vehicle.amount).toLowerCase().includes(searchValue)) ||
      (vehicle.is_active !== undefined &&
        (vehicle.is_active ? "active" : "inactive").includes(searchValue))
    );
  });

  // Table columns
  const columns = [
    { Header: "ID", accessor: (row, index) => index + 1, id: "index" },
    { Header: "Vehicle Number", accessor: "vehicle_number" },
    { Header: "Vehicle Type", accessor: "vehicle_type" },
    { Header: "Vehicle Age", accessor: "vehicle_age" },
    { Header: "Name", accessor: "name" },
    { Header: "Notes", accessor: "notes" },
    { Header: "Amount", accessor: "amount" },
    {
      Header: "Status",
      accessor: "is_active",
      Cell: ({ value }) => (
        <span style={{ color: value ? "green" : "red", fontWeight: "bold" }}>
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <div className="vehicles-page">
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
        <FaCar /> Vehicles
      </h1>

      <div className="AddButton">
        <button onClick={handleOpenAddModal} className="add-btn">
          <FaPlus /> Add Vehicle
        </button>
      </div>

      {/* Search Input */}
      <div className="search-bar">
        <div className="search-input-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add/Edit Vehicle"
        className="modal"
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={false}
      >
        <h2>{editingVehicle ? "Edit Vehicle" : "Add Vehicle"}</h2>

        {/* <h2>
          {editingVehicle ? <FaUserEdit /> : <FaPlus />}
          {editingVehicle ? " Edit Vehicle" : " Add Vehicle"}
        </h2> */}

        <div className="form-vehicle">
          {/* Member Dropdown */}
          <div className="input-error-veh">
            <div className="input-group">
              <FaUser className="icon" />
              <select
                value={newVehicle.member_id}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, member_id: e.target.value })
                }
              >
                <option value="">Select Member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.username}
                  </option>
                ))}
              </select>
            </div>
            <div className="error">
              {errors.member_id && (
                <span className="error-text-veh">{errors.member_id}</span>
              )}
            </div>
          </div>

          {/* Vehicle Type Dropdown */}
          <div className="input-error-veh">
            <div className="input-group">
              <FaCar className="icon" />
              <select
                value={newVehicle.vehicle_type}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, vehicle_type: e.target.value })
                }
              >
                <option value="">Select Vehicle Type</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="MPV">MPV</option>
                <option value="Mini-Van">Mini-Van</option>
              </select>
            </div>
            <div className="error">
              {errors.vehicle_type && (
                <span className="error-text-veh">{errors.vehicle_type}</span>
              )}
            </div>
          </div>

          {/* Owner name */}
          <div className="name-vehiclenumber">
            <div className="input-group">
              <FaUserEdit className="icon" />
              <input
                type="text"
                placeholder="Name"
                value={newVehicle.name}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, name: e.target.value })
                }
              />
              {errors.name && (
                <span className="error-text-veh">{errors.name}</span>
              )}
            </div>

            {/* Vehicle Number */}
            <div className="input-group">
              <FaAddressCard className="icon" />
              <input
                type="text"
                placeholder="Vehicle Number"
                value={newVehicle.vehicle_number}
                onChange={(e) =>
                  setNewVehicle({
                    ...newVehicle,
                    vehicle_number: e.target.value,
                  })
                }
              />
              {errors.vehicle_number && (
                <span className="error-text-veh">{errors.vehicle_number}</span>
              )}
            </div>
          </div>

          {/* Vehicle Age */}
          <div className="vehicleage-amount">
            <div className="input-group">
              <FaCalendarAlt className="icon" />
              <input
                type="text"
                placeholder="Vehicle Age"
                value={newVehicle.vehicle_age}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, vehicle_age: e.target.value })
                }
              />
              {errors.vehicle_age && (
                <span className="error-text-veh">{errors.vehicle_age}</span>
              )}
            </div>

            {/* Amount */}
            <div className="input-group">
              <FaDollarSign className="icon" />
              <input
                type="text"
                placeholder="Amount"
                value={newVehicle.amount}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, amount: e.target.value })
                }
              />
              {errors.amount && (
                <span className="error-text-veh">{errors.amount}</span>
              )}
            </div>
          </div>

          {/* Active Switch - Only visible in Edit Vehicle form */}
          {editingVehicle && (
            <FormControlLabel
              control={
                <Switch
                  checked={newVehicle.is_active}
                  onChange={(e) =>
                    setNewVehicle({
                      ...newVehicle,
                      is_active: e.target.checked,
                    })
                  }
                  name="is_active"
                />
              }
              label="Active"
            />
          )}

          {/* Notes */}
          <div className="input-group">
            <FaCommentAlt className="icon" />
            <textarea
              placeholder="Notes"
              value={newVehicle.notes}
              onChange={(e) =>
                setNewVehicle({ ...newVehicle, notes: e.target.value })
              }
            />
          </div>

          <div className="modelbutton">
            <button onClick={handleSave} className="btn-editmodel">
              {editingVehicle ? (
                <>
                  <FaEdit /> Edit Vehicle
                </>
              ) : (
                <>
                  <FaPlus /> Add Vehicle
                </>
              )}
            </button>
            <button
              className="btn-closemodel"
              onClick={() => setModalIsOpen(false)}
            >
              <MdCancel /> Close
            </button>
          </div>
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
                {deleteVehicleName}
              </span>
              ?
            </p>

            <div className="modal-buttons">
              <button
                className="btn-confirm"
                onClick={() => handleDelete(deleteVehicleId)}
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
      <ToastContainer />

      {/* Vehicles Table */}
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <TableOne
          columns={columns}
          data={filteredVehicles.slice().reverse()}
          handleDelete={(vehicle) =>
            triggerDeleteModal(vehicle.id, `${vehicle.vehicle_number}`)
          }
          handleEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default Vehicles;
