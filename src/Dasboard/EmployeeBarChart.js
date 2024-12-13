import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import "./../Dasboard/dashboard.css";

const EmployeeBarChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
      const fetchChartData = async () => {
            const user = localStorage.getItem("user");
            if (!user) return;
          
            const parsedUser = JSON.parse(user);
            const employeeId = parsedUser.id; // Extract employee ID from localStorage
          
            const requestOptions = {
              method: "GET",
              redirect: "follow",
            };
          
            try {
              const response = await fetch(
                `https://panel.radhetowing.com/api/payment-master/employee/${employeeId}`,
                requestOptions
              );
              const result = await response.json();
          
              // Log the result to inspect its structure
              console.log("API Result:", result);
          
              // Extract data if it's wrapped inside an object
              const data = Array.isArray(result) ? result : result.data;
          
              // Validate that data is an array
              if (!data || !Array.isArray(data)) {
                console.error("Invalid data format received:", result);
                return;
              }
          
              // Get the last 6 months
              const today = dayjs();
              const months = [];
          
              for (let i = 5; i >= 0; i--) {
                const month = today.subtract(i, "month");
                months.push({
                  month: month.format("MMM"), // Format as "Jan", "Feb", etc.
                  totalEarnings: 0,
                });
              }
          
              // Process the data
              data.forEach((item) => {
                const paymentDate = dayjs(item.PM_plan_startdate);
                const monthName = paymentDate.format("MMM"); // e.g., "Jan"
          
                // Check if the payment falls in the last 6 months
                const matchingMonth = months.find((m) => m.month === monthName);
                if (matchingMonth) {
                  matchingMonth.totalEarnings += item.PM_Amount; // Add earnings
                }
              });
          
              setChartData(months);
            } catch (error) {
              console.error("Error fetching employee data:", error);
            }
          };
          

    fetchChartData();
  }, []);

  return (
    <div className="barchart-container" style={{ width: "50%" }}>
      <h3> Employee Overview <br/>
        Last 6 Months Earnings for -{" "}
        {JSON.parse(localStorage.getItem("user"))?.username || "Employee"}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          barSize={30} // Set consistent bar width
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            label={{
              value: "Previous 6 Months",
              position: "insideBottom",
              offset: -5,
              textAnchor: "middle",
            }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            domain={[0, (dataMax) => Math.ceil(dataMax * 1.2)]} // Add 20% buffer above max value
            label={{
              value: "Total Earnings",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            formatter={(value) => `₹ ${value}`}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="totalEarnings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmployeeBarChart;
