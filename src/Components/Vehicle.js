import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { FaPlus } from "react-icons/fa";
import TableOne from "../Table/TableOne";
import "./../Style/vehicle.css"

Modal.setAppElement("#root");

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [deleteVehicleId, setDeleteVehicleId] = useState(null); // For delete confirmation
  const [deleteVehicleName, setDeleteVehicleName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({}); // To track validation errors
  const [modalIsOpen, setModalIsOpen] = useState(false);
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

  // Fetch vehicles data from the API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(
          "https://panel.radhetowing.com/api/vehicles"
        );
        const vehicleData = response.data.data.map((veh) => ({
          id: veh.id,
          member_id: veh.member_id,
          vehicle_number: veh.vehicle_number,
          vehicle_type: veh.vehicle_type,
          vehicle_age: veh.vehicle_age,
          name: veh.name,
          notes: veh.notes,
          is_active: veh.is_active,
          amount: veh.amount,
        }));
        setVehicles(vehicleData);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };

    fetchVehicles();
  }, []);

  // Validation function to check form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!newVehicle.member_id) newErrors.member_id = "Member ID is required";
    if (!newVehicle.vehicle_number)
      newErrors.vehicle_number = "Vehicle number is required";
    if (!newVehicle.vehicle_type)
      newErrors.vehicle_type = "Vehicle type is required";
    if (!newVehicle.vehicle_age) newErrors.vehicle_age = "Vehicle age is required";
    if (!newVehicle.amount) newErrors.amount = "Amount is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
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
      } else {
        console.error("Error deleting vehicle:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  // Trigger delete confirmation modal
  const triggerDeleteModal = (vehicleId, vehicleName) => {
    setDeleteVehicleId(vehicleId);
    setDeleteVehicleName(vehicleName);
    setShowDeleteModal(true);
  };

  // Handle edit operation
  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setNewVehicle(vehicle); // Pre-fill the form with existing vehicle details
    setModalIsOpen(true);
  };

  // Handle opening the "Add Vehicle" modal
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

  // Add a new vehicle
  const addVehicle = async () => {
    const payload = {
      member_id: newVehicle.member_id,
      vehicle_number: newVehicle.vehicle_number,
      vehicle_type: newVehicle.vehicle_type,
      vehicle_age: newVehicle.vehicle_age,
      name: newVehicle.name,
      notes: newVehicle.notes,
      is_active: newVehicle.is_active,
      amount: newVehicle.amount,
    };

    try {
      const response = await axios.post(
        "https://panel.radhetowing.com/api/vehicles",
        payload
      );

      if (response.status === 201) {
        setVehicles([...vehicles, { id: response.data.id, ...newVehicle }]);
        setModalIsOpen(false);
      } else {
        console.error("Error adding vehicle:", response.data.message);
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  // Edit/update a vehicle
  const editVehicle = async () => {
    const payload = {
      member_id: newVehicle.member_id,
      vehicle_number: newVehicle.vehicle_number,
      vehicle_type: newVehicle.vehicle_type,
      vehicle_age: newVehicle.vehicle_age,
      name: newVehicle.name,
      notes: newVehicle.notes,
      is_active: newVehicle.is_active,
      amount: newVehicle.amount,
    };

    try {
      const response = await axios.put(
        `https://panel.radhetowing.com/api/vehicles/${editingVehicle.id}`,
        payload
      );

      if (response.status === 200) {
        setVehicles(
          vehicles.map((v) =>
            v.id === editingVehicle.id ? { ...v, ...payload } : v
          )
        );
        setEditingVehicle(null);
        setModalIsOpen(false);
      } else {
        console.error("Error updating vehicle:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  };

  // Handle save operation (either Add or Update)
  const handleSave = () => {
    if (validateForm()) {
      if (editingVehicle) {
        editVehicle();
      } else {
        addVehicle();
      }
    }
  };

  // Table columns
  const columns = [
    {
      Header: "ID",
      accessor: (row, index) => index + 1, // Use index as row number
      id: "index", // Optional: Set an ID for the column
    },
    { Header: "Vehicle Number", accessor: "vehicle_number" },
    { Header: "Vehicle Type", accessor: "vehicle_type" },
    { Header: "Vehicle Age", accessor: "vehicle_age" },
    { Header: "Name", accessor: "name" },
    { Header: "Notes", accessor: "notes" },
    { Header: "Amount", accessor: "amount" },
    { Header: "Active", accessor: "is_active", Cell: ({ value }) => (value ? "Yes" : "No") },
  ];

  return (
    <div className="vehicles-page">
      <h1>Vehicles</h1>

      {/* Add Vehicle Button */}
      <div className="AddButton">
        <button onClick={handleOpenAddModal} className="add-btn">
          <FaPlus /> Add Vehicle
        </button>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add/Edit Vehicle"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>{editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}</h2>

        <div className="form">
          <input
            type="text"
            placeholder="Member ID"
            value={newVehicle.member_id}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, member_id: e.target.value })
            }
          />
          {errors.member_id && (
            <span className="error-text">{errors.member_id}</span>
          )}

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
            <span className="error-text">{errors.vehicle_number}</span>
          )}

          <input
            type="text"
            placeholder="Vehicle Type"
            value={newVehicle.vehicle_type}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, vehicle_type: e.target.value })
            }
          />
          {errors.vehicle_type && (
            <span className="error-text">{errors.vehicle_type}</span>
          )}

          <input
            type="text"
            placeholder="Vehicle Age"
            value={newVehicle.vehicle_age}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, vehicle_age: e.target.value })
            }
          />
          {errors.vehicle_age && (
            <span className="error-text">{errors.vehicle_age}</span>
          )}

          <input
            type="text"
            placeholder="Name"
            value={newVehicle.name}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, name: e.target.value })
            }
          />

          <textarea
            placeholder="Notes"
            value={newVehicle.notes}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, notes: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Amount"
            value={newVehicle.amount}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, amount: e.target.value })
            }
          />
          {errors.amount && (
            <span className="error-text">{errors.amount}</span>
          )}

          <div className="modelbutton">
            <button onClick={handleSave} className="btn-editmodel">
              {editingVehicle ? "Update Vehicle" : "Add Vehicle"}
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

      {/* Vehicles Table */}
      <TableOne
        columns={columns}
        data={vehicles}
        handleDelete={(vehicle) =>
          triggerDeleteModal(vehicle.id, `${vehicle.vehicle_number}`)
        }
        handleEdit={handleEdit}
      />
    </div>
  );
};

export default Vehicles;
