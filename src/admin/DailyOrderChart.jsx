import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import api from "../api/axios";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { FaChartLine, FaChartBar } from "react-icons/fa";

function DailyOrderChart() {
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState("line"); // 'line' or 'bar'

  useEffect(() => {
    api.get("adminuser/api/daily-orders/").then((res) => {
      const transformed = res.data.map((item) => {
        const currentDate = dayjs(item.day);
        const isToday = currentDate.isSame(dayjs(), "day");
        return {
          date: isToday
            ? `${currentDate.format("D MMM")} (Today)`
            : currentDate.format("D MMM"),
          orders: item.count,
        };
      });
      setData(transformed);
    });
  }, []);

  const isLineChart = chartType === "line";

  return (
    <div className="bg-white p-4 rounded-xl shadow-md relative">
      <div className="flex justify-between items-center mb-4">
        {/* Title */}
        <h2 className="text-xl font-semibold text-center w-full">
          📅 Daily Orders (This Month)
        </h2>

        {/* Toggle Chart Type Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setChartType(isLineChart ? "bar" : "line")}
          className="ml-4 text-gray-600 hover:text-black transition"
          title={isLineChart ? "Switch to Bar Chart" : "Switch to Line Chart"}
        >
          {isLineChart ? <FaChartBar size={22} /> : <FaChartLine size={22} />}
        </motion.button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {isLineChart ? (
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" />
            <XAxis dataKey="date" angle={-30} textAnchor="end" height={60} />
            <YAxis allowDecimals={false} />
            <Tooltip
              wrapperStyle={{ outline: "none" }}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
              labelStyle={{ fontWeight: "bold" }}
              formatter={(value, name) => [
                `${value}`,
                name === "orders" ? "Orders" : name,
              ]}
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#000000"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        ) : (
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" />
            <XAxis dataKey="date" angle={-30} textAnchor="end" height={60} />
            <YAxis allowDecimals={false} />
            <Tooltip
              wrapperStyle={{ outline: "none" }}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
              labelStyle={{ fontWeight: "bold" }}
              formatter={(value, name) => [
                `${value}`,
                name === "orders" ? "Orders" : name,
              ]}
            />
            <Bar dataKey="orders" fill="#000000" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export default DailyOrderChart;
