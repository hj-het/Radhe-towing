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
import { AiOutlineDashboard } from "react-icons/ai";
import BarChartComponent from "./BarChartComponent";
import PieCharts from "./PieCharts";
import "./../Dasboard/dashboard.css";

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [currentMonthMembers, setCurrentMonthMembers] = useState(0);
  const [previousMonthMembers, setPreviousMonthMembers] = useState(0);
  const [newMembersPercentage, setNewMembersPercentage] = useState(0);
  const [repeatMembersPercentage, setRepeatMembersPercentage] = useState(0);

  useEffect(() => {
    const fetchChartData = async () => {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      try {
        const response = await fetch(
          "https://panel.radhetowing.com/api/payment-master",
          requestOptions
        );
        const result = await response.json();

        // Get current and previous months
        const today = dayjs();
        const currentMonth = today.month();
        const currentYear = today.year();
        const previousMonth = today.subtract(1, "month").month();
        const previousYear = today.subtract(1, "month").year();

        // Initialize data structures for counting sales
        const currentMonthSales = {};
        const previousMonthSales = {};

        // Process the data
        result.forEach((item) => {
          const date = dayjs(item.PM_plan_startdate);
          const dayOfMonth = date.date();
          const month = date.month();
          const year = date.year();

          if (year === currentYear && month === currentMonth) {
            // Current month
            if (!currentMonthSales[dayOfMonth]) {
              currentMonthSales[dayOfMonth] = 0;
            }
            currentMonthSales[dayOfMonth] += 1; // Count the sale
          } else if (year === previousYear && month === previousMonth) {
            // Previous month
            if (!previousMonthSales[dayOfMonth]) {
              previousMonthSales[dayOfMonth] = 0;
            }
            previousMonthSales[dayOfMonth] += 1; // Count the sale
          }
        });

        // Prepare data for the chart
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
        console.error("Error fetching data:", error);
      }
    };

    fetchChartData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://panel.radhetowing.com/api/members"
        );
        const data = await response.json();

        // Total number of members
        const total = data.length;

        // Get the current date
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth(); // 0-based index
        const currentYear = currentDate.getFullYear();

        // Get the previous month and year
        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        // Filter members by the current month and year
        const currentMonthMembers = data.filter((member) => {
          const createdAt = new Date(member.created_at);
          return (
            createdAt.getMonth() === currentMonth &&
            createdAt.getFullYear() === currentYear
          );
        }).length;

        // Filter members by the previous month and year
        const previousMonthMembers = data.filter((member) => {
          const createdAt = new Date(member.created_at);
          return (
            createdAt.getMonth() === previousMonth &&
            createdAt.getFullYear() === previousYear
          );
        }).length;

        // Assuming 58% are new members
        const newMembers = Math.floor(total * 0.58);
        const repeatMembers = total - newMembers;

        // Update states
        setTotalMembers(total);
        setCurrentMonthMembers(currentMonthMembers);
        setPreviousMonthMembers(previousMonthMembers);
        setNewMembersPercentage((newMembers / total) * 100);
        setRepeatMembersPercentage((repeatMembers / total) * 100);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="dashboard-container">
        <h1
          style={{
            display: "flex",
            textAlign: "center",
            gap: "6px",
            alignItems: "center",
            fontSize: "25px",
          }}
        >
          <AiOutlineDashboard /> Dashboard
        </h1>
        <h3>Plan Sales Per Day: Current vs. Previous Month</h3>
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
                domain={[0, 10]} // Set maximum value to 200
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="currentMonth"
                stroke="#3b82f6"
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
                backgroundColor: "#3b82f6",
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

      <div className="barchart-box">
        <BarChartComponent />
        <div className="info-card">
          <h3>Number of Members</h3>
          <h2>
            {totalMembers.toLocaleString()} <span className="growth">+23%</span>
          </h2>
          <p>{newMembersPercentage.toFixed(0)}% New Members</p>
          <p>{repeatMembersPercentage.toFixed(0)}% Repeat Members</p>
          <div className="info-more">
            <h3>Current Month Members: {currentMonthMembers}</h3>
            <h3>Previous Month Members: {previousMonthMembers}</h3>
          </div>
        </div>
      </div>
      <div className="graph-pichart">
        <PieCharts />
      </div>
    </div>
  );
};

export default Dashboard;
