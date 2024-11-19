import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./../Dasboard/dashboard.css"

const PieCharts = () => {
  const [serviceStatusData, setServiceStatusData] = useState([]);
  const [vehicleTypeData, setVehicleTypeData] = useState([]);

  useEffect(() => {
    const fetchServiceStatusData = async () => {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };
      
        try {
          const response = await fetch(
            "https://panel.radhetowing.com/api/towing-service-requests",
            requestOptions
          );
          const result = await response.json();
          console.log("Service Status API Response:", result);
      
          const statusCounts = {
            pending: 0,
            complete: 0,
            rejected: 0,
          };
      
          console.log("result.data",result)
          if (result && Array.isArray(result)) {
            result.forEach((item) => {
              if (item.status === "P") statusCounts.pending += 1;
              else if (item.status === "C") statusCounts.complete += 1;
              else if (item.status === "R") statusCounts.rejected += 1;
            });
      
            const chartData = [
              { name: "Pending", value: statusCounts.pending },
              { name: "Complete", value: statusCounts.complete },
              { name: "Rejected", value: statusCounts.rejected },
            ];
      
            console.log("Parsed Service Status Data:", chartData);
            setServiceStatusData(chartData);
          } else {
            console.warn("No valid service status data found in API response.");
            setServiceStatusData([]); // Handle missing data
          }
        } catch (error) {
          console.error("Error fetching service status data:", error);
          setServiceStatusData([]); // Handle fetch error
        }
      };
      
    const fetchVehicleTypeData = async () => {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      try {
        const response = await fetch(
          "https://panel.radhetowing.com/api/vehicles",
          requestOptions
        );
        const result = await response.json();

        const vehicleCounts = {
          Hatchback: 0,
          Sedan: 0,
          SUV: 0,
          MPV: 0,
          "Min-Van": 0,
        };

        result.data.forEach((item) => {
          if (vehicleCounts.hasOwnProperty(item.vehicle_type)) {
            vehicleCounts[item.vehicle_type] += 1;
          }
        });

        const chartData = Object.keys(vehicleCounts).map((key) => ({
          name: key,
          value: vehicleCounts[key],
        }));

        setVehicleTypeData(chartData);
      } catch (error) {
        console.error("Error fetching vehicle type data:", error);
      }
    };

    fetchServiceStatusData();
    fetchVehicleTypeData();
  }, []);

  const COLORS = ["#FFBB28", "#FF8042", "#FF0000", "#0088FE", "#00C49F"];

  return (
    <div className="pie-charts-container" style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
      <div style={{ width: "50%" }} className="service-card">
        <h3 style={{ textAlign: "center" }}>Service Status</h3>
        {serviceStatusData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {serviceStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ textAlign: "center" }}>Loading Service Status Data...</p>
        )}
      </div>

      <div style={{ width: "50%" }} className="vehicle-card">
        <h3 style={{ textAlign: "center" }}>Vehicle Types</h3>
        {vehicleTypeData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vehicleTypeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {vehicleTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ textAlign: "center" }}>Loading Vehicle Type Data...</p>
        )}
      </div>
    </div>
  );
};

export default PieCharts;
