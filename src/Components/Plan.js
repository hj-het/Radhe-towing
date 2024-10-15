import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { FaPlus } from "react-icons/fa";
import TableOne from "../Table/TableOne";
import "./../Style/plan.css";
import {
  FaFileAlt,
  // FaDollarSign,
  FaCalendarAlt,
  FaCar,
  FaGasPump,
  FaTruck,
  FaCalendarCheck,
} from "react-icons/fa";
import { MdOutlineCurrencyRupee } from "react-icons/md";

Modal.setAppElement("#root");

const Plan = () => {
  const [plans, setPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deletePlanId, setDeletePlanId] = useState(null); // For delete confirmation
  const [deletePlanName, setDeletePlanName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({}); // To track validation errors
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: "",
    duration: "",
    price: "",
    value_of_car: "",
    fuel_type: "",
    num_of_towing: "",
    exchange_car: false,
    exchange_car_validity: "",
    is_email_support: false,
    service_24x7: false,
    is_customized: false,
    created_by: "Admin",
  });

  // Fetch plans data from the API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          "https://panel.radhetowing.com/api/plans"
        );
        const planData = response.data.plans.map((plan) => ({
          id: plan.id,
          name: plan.name,
          duration: plan.duration,
          price: plan.price,
          value_of_car: plan.value_of_car,
          fuel_type: plan.fuel_type,
          num_of_towing: plan.num_of_towing,
          exchange_car: plan.exchange_car,
          exchange_car_validity: plan.exchange_car_validity,
          is_email_support: plan.is_email_support,
          service_24x7: plan.service_24x7,
          is_customized: plan.is_customized,
        }));
        setPlans(planData);
      } catch (error) {
        console.error("Error fetching plan data:", error);
      }
    };

    fetchPlans();
  }, []);

  // Validation function to check form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!newPlan.name) newErrors.name = "Plan name is required";
    if (!newPlan.duration) newErrors.duration = "Duration is required";
    if (!newPlan.price) newErrors.price = "Price is required";
    if (!newPlan.value_of_car) newErrors.value_of_car = "Car value is required";
    if (!newPlan.fuel_type) newErrors.fuel_type = "Fuel type is required";
    if (!newPlan.num_of_towing)
      newErrors.num_of_towing = "Number of towing is required";
    if (!newPlan.exchange_car_validity)
      newErrors.exchange_car_validity = "Exchange car validity is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle delete operation
  const handleDelete = async (planId) => {
    try {
      const response = await axios.delete(
        `https://panel.radhetowing.com/api/plans/${planId}`
      );

      if (response.status === 200) {
        setPlans(plans.filter((p) => p.id !== planId));
        setShowDeleteModal(false);
      } else {
        console.error("Error deleting plan:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  // Trigger delete confirmation modal
  const triggerDeleteModal = (planId, planName) => {
    setDeletePlanId(planId);
    setDeletePlanName(planName);
    setShowDeleteModal(true);
  };

  // Handle edit operation
  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setNewPlan(plan); // Pre-fill the form with existing plan details
    setModalIsOpen(true);
  };

  // Handle opening the "Add Plan" modal
  const handleOpenAddModal = () => {
    setNewPlan({
      name: "",
      duration: "",
      price: "",
      value_of_car: "",
      fuel_type: "",
      num_of_towing: "",
      exchange_car: false,
      exchange_car_validity: "",
      is_email_support: false,
      service_24x7: false,
      is_customized: false,
      created_by: "Admin",
    });
    setEditingPlan(null);
    setModalIsOpen(true);
    setErrors({});
  };

  // Add a new plan
  const addPlan = async () => {
    const payload = {
      name: newPlan.name,
      duration: newPlan.duration,
      price: newPlan.price,
      value_of_car: newPlan.value_of_car,
      fuel_type: newPlan.fuel_type,
      num_of_towing: newPlan.num_of_towing,
      exchange_car: newPlan.exchange_car,
      exchange_car_validity: newPlan.exchange_car_validity,
      is_email_support: newPlan.is_email_support,
      service_24x7: newPlan.service_24x7,
      is_customized: newPlan.is_customized,
      created_by: "Admin",
    };

    try {
      const response = await axios.post(
        "https://panel.radhetowing.com/api/plans",
        payload
      );

      if (response.status === 201) {
        setPlans([...plans, { id: response.data.id, ...newPlan }]);
        setModalIsOpen(false);
      } else {
        console.error("Error adding plan:", response.data.message);
      }
    } catch (error) {
      console.error("Error adding plan:", error);
    }
  };

  // Edit/update a plan
  const editPlan = async () => {
    const payload = {
      name: newPlan.name,
      duration: newPlan.duration,
      price: newPlan.price,
      value_of_car: newPlan.value_of_car,
      fuel_type: newPlan.fuel_type,
      num_of_towing: newPlan.num_of_towing,
      exchange_car: newPlan.exchange_car,
      exchange_car_validity: newPlan.exchange_car_validity,
      is_email_support: newPlan.is_email_support,
      service_24x7: newPlan.service_24x7,
      is_customized: newPlan.is_customized,
      created_by: "Admin",
    };

    try {
      const response = await axios.put(
        `https://panel.radhetowing.com/api/plans/${editingPlan.id}`,
        payload
      );

      if (response.status === 200) {
        setPlans(
          plans.map((p) => (p.id === editingPlan.id ? { ...p, ...payload } : p))
        );
        setEditingPlan(null);
        setModalIsOpen(false);
      } else {
        console.error("Error updating plan:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating plan:", error);
    }
  };

  // Handle save operation (either Add or Update)
  const handleSave = () => {
    if (validateForm()) {
      if (editingPlan) {
        editPlan();
      } else {
        addPlan();
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
    { Header: "Plan Name", accessor: "name" },
    { Header: "Duration (months)", accessor: "duration" },
    { Header: "Price (₹)", accessor: "price" },
    { Header: "Car Value", accessor: "value_of_car" },
    { Header: "Fuel Type", accessor: "fuel_type" },
    { Header: "Towing Limit", accessor: "num_of_towing" },
    {
      Header: "Exchange Car",
      accessor: "exchange_car",
      Cell: ({ value }) => (value ? "Yes" : "No"),
    },
    { Header: "Exchange Validity", accessor: "exchange_car_validity" },
    {
      Header: "Email Support",
      accessor: "is_email_support",
      Cell: ({ value }) => (value ? "Yes" : "No"),
    },
    {
      Header: "24x7 Service",
      accessor: "service_24x7",
      Cell: ({ value }) => (value ? "Yes" : "No"),
    },
    {
      Header: "Customized",
      accessor: "is_customized",
      Cell: ({ value }) => (value ? "Yes" : "No"),
    },
  ];

  return (
    <div className="plans-page">
      <h1>Plans</h1>

      {/* Add Plan Button */}
      <div className="AddButton">
        <button onClick={handleOpenAddModal} className="add-btn">
          <FaPlus /> Add Plan
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add/Edit Plan"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>{editingPlan ? "Edit Plan" : "Add New Plan"}</h2>

        <div className="form-plan">
          <div className="input-with-icon">
            <FaFileAlt className="input-icon" /> {/* Icon for plan name */}
            <input
              type="text"
              placeholder="Plan Name"
              value={newPlan.name}
              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
            />
          </div>
          {errors.name && <span className="error-text">{errors.name}</span>}

          <div className="input-combine">
            <div className="input-with-icon">
              <FaCalendarAlt className="input-icon" /> {/* Icon for duration */}
              <input
                type="number"
                placeholder="Duration (months)"
                value={newPlan.duration}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, duration: e.target.value })
                }
              />
            </div>
            {errors.duration && (
              <span className="error-text">{errors.duration}</span>
            )}

            <div className="input-with-icon">
              <MdOutlineCurrencyRupee className="input-icon" /> {/* Icon for price */}
              <input
                type="number"
                placeholder="Price (₹)"
                value={newPlan.price}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, price: e.target.value })
                }
              />
            </div>
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>

          <div className="input-combine">
            <div className="input-with-icon">
              <FaCar className="input-icon" /> {/* Icon for car value */}
              <input
                type="text"
                placeholder="Car Value"
                value={newPlan.value_of_car}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, value_of_car: e.target.value })
                }
              />
            </div>
            {errors.value_of_car && (
              <span className="error-text">{errors.value_of_car}</span>
            )}

            <div className="input-with-icon">
              <FaGasPump className="input-icon" /> {/* Icon for fuel type */}
              <input
                type="text"
                placeholder="Fuel Type"
                value={newPlan.fuel_type}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, fuel_type: e.target.value })
                }
              />
            </div>
            {errors.fuel_type && (
              <span className="error-text">{errors.fuel_type}</span>
            )}
          </div>

          {/* Additional input fields with icons */}
          <div className="input-combine">
            <div className="input-with-icon">
              <FaTruck className="input-icon" /> {/* Icon for towing */}
              <input
                type="number"
                placeholder="Number of Towing"
                value={newPlan.num_of_towing}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, num_of_towing: e.target.value })
                }
              />
            </div>
            {errors.num_of_towing && (
              <span className="error-text">{errors.num_of_towing}</span>
            )}

            <div className="input-with-icon">
              <FaCalendarCheck className="input-icon" />{" "}
              {/* Icon for exchange car validity */}
              <input
                type="text"
                placeholder="Exchange Car Validity"
                value={newPlan.exchange_car_validity}
                onChange={(e) =>
                  setNewPlan({
                    ...newPlan,
                    exchange_car_validity: e.target.value,
                  })
                }
              />
            </div>
            {errors.exchange_car_validity && (
              <span className="error-text">{errors.exchange_car_validity}</span>
            )}
          </div>

          {/* Toggle checkboxes */}
          <div className="form-labels">
            <label>
              <input
                type="checkbox"
                checked={newPlan.exchange_car}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, exchange_car: e.target.checked })
                }
              />
              Exchange Car
            </label>

            <label>
              <input
                type="checkbox"
                checked={newPlan.is_email_support}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, is_email_support: e.target.checked })
                }
              />
              Email Support
            </label>

            <label>
              <input
                type="checkbox"
                checked={newPlan.service_24x7}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, service_24x7: e.target.checked })
                }
              />
              24x7 Service
            </label>

            <label>
              <input
                type="checkbox"
                checked={newPlan.is_customized}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, is_customized: e.target.checked })
                }
              />
              Customized Plan
            </label>
          </div>

          <div className="modelbutton">
            <button onClick={handleSave} className="btn-editmodel">
              {editingPlan ? "Update Plan" : "Add Plan"}
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
                {deletePlanName}
              </span>
              ?
            </p>

            <div className="modal-buttons">
              <button
                className="btn-confirm"
                onClick={() => handleDelete(deletePlanId)}
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

      {/* Plans Table */}
      <TableOne
        columns={columns}
        data={plans}
        handleDelete={(plan) => triggerDeleteModal(plan.id, `${plan.name}`)}
        handleEdit={handleEdit}
      />
    </div>
  );
};

export default Plan;
