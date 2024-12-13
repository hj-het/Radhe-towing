import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

const EmployeeGraph = () => {
  const [chartData, setChartData] = useState([]);

  console.log("EmployeeGraph");
  useEffect(() => {
    const fetchEmployeeData = async () => {
      const user = localStorage.getItem("user"); // Retrieve user data from localStorage
      if (!user) return;

      const parsedUser = JSON.parse(user); // Parse the JSON string to an object
      const employeeId = parsedUser.id; // Access the id property
      console.log(employeeId); // Log the ID to verify

      if (!employeeId) return;

      try {
        const response = await fetch(
          `https://panel.radhetowing.com/api/payment-master/employee/${employeeId}`
        );
        const result = await response.json();

        // Log the result to understand its structure
        console.log(result);

        // Check if the response contains an array or nested object
        const data = Array.isArray(result) ? result : result.data;

        if (!data || !Array.isArray(data)) {
          console.error("Invalid data format received:", result);
          return;
        }

        const today = dayjs();
        const currentMonth = today.month();
        const currentYear = today.year();
        const previousMonth = today.subtract(1, "month").month();
        const previousYear = today.subtract(1, "month").year();

        const currentMonthSales = {};
        const previousMonthSales = {};

        data.forEach((item) => {
          const date = dayjs(item.PM_plan_startdate);
          const dayOfMonth = date.date();
          const month = date.month();
          const year = date.year();

          if (year === currentYear && month === currentMonth) {
            if (!currentMonthSales[dayOfMonth]) {
              currentMonthSales[dayOfMonth] = 0;
            }
            currentMonthSales[dayOfMonth] += 1;
          } else if (year === previousYear && month === previousMonth) {
            if (!previousMonthSales[dayOfMonth]) {
              previousMonthSales[dayOfMonth] = 0;
            }
            previousMonthSales[dayOfMonth] += 1;
          }
        });

        const daysInCurrentMonth = today.daysInMonth();
        const daysInPreviousMonth = dayjs().subtract(1, "month").daysInMonth();
        const formattedData = [];

        for (
          let i = 1;
          i <= Math.max(daysInCurrentMonth, daysInPreviousMonth);
          i++
        ) {
          formattedData.push({
            day: i,
            currentMonth: currentMonthSales[i] || 0,
            previousMonth: previousMonthSales[i] || 0,
          });
        }

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, []);

  return (
    <div>
      <h3>
        {`Plan Sales Per Day: Current vs. Previous Month - ${
          JSON.parse(localStorage.getItem("user"))?.username || "User"
        }`}
      </h3>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              label={{
                value: "Dates of Month",
                position: "insideBottom",
                offset: -5,
                textAnchor: "middle",
              }}
            />
            <YAxis
              label={{
                value: "Num. of Plan Sales",
                angle: -90,
                position: "insideLeft",
              }}
              domain={[0, 10]}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="currentMonth"
              stroke="#F4511E"
              strokeWidth={3}
              name="Current Month"
            />
            <Line
              type="monotone"
              dataKey="previousMonth"
              stroke="#93c5fd"
              strokeWidth={3}
              name="Previous Month"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-legend">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    width: "20px",
                    height: "10px",
                    backgroundColor: "#F4511E",
                    display: "inline-block",
                  }}
                ></span>
                <span>Current Month</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    width: "20px",
                    height: "10px",
                    backgroundColor: "#93c5fd",
                    display: "inline-block",
                  }}
                ></span>
                <span>Previous Month</span>
              </div>
            </div>
    </div>
  );
};

export default EmployeeGraph;
