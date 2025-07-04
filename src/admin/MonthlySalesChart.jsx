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
} from 'recharts';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { FaChartLine, FaChartBar } from 'react-icons/fa';

function MonthlySalesChart() {
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    api.get('adminuser/api/monthly-sales/').then((res) => {
      const transformed = res.data.map((item) => ({
        date: dayjs(item.month).format('MMMM, YYYY'),
        sales: parseFloat(item.total_sales),
      }));
      setData(transformed);
    });
  }, []);

  const isLineChart = chartType === 'line';

  return (
    <div className="bg-white p-4 rounded-xl shadow-md relative">
      <h2 className="text-xl font-semibold mb-4 text-center">
        📈 Monthly Sales (Last 12 Months)
      </h2>

      {/* Toggle Chart Type Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setChartType(isLineChart ? 'bar' : 'line')}
        className="absolute top-4 right-4 text-gray-600 hover:text-black transition"
        title={isLineChart ? 'Switch to Bar Chart' : 'Switch to Line Chart'}
      >
        {isLineChart ? <FaChartBar size={22} /> : <FaChartLine size={22} />}
      </motion.button>

      <ResponsiveContainer width="100%" height={300}>
        {isLineChart ? (
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" />
            <XAxis dataKey="date" angle={-30} textAnchor="end" height={60} />
            <YAxis allowDecimals />
            <Tooltip
              wrapperStyle={{ outline: 'none' }}
              contentStyle={{ backgroundColor: '#fff', borderRadius: 8, border: '1px solid #ddd' }}
              labelStyle={{ fontWeight: 'bold' }}
              formatter={(value, name) => [`৳${value}`, name === 'sales' ? 'Sales' : name]}
            />
            <Line
              type="monotone"
              dataKey="sales"
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
            <YAxis allowDecimals />
            <Tooltip
              wrapperStyle={{ outline: 'none' }}
              contentStyle={{ backgroundColor: '#fff', borderRadius: 8, border: '1px solid #ddd' }}
              labelStyle={{ fontWeight: 'bold' }}
              formatter={(value, name) => [`৳${value}`, name === 'sales' ? 'Sales' : name]}
            />
            <Bar dataKey="sales" fill="#000000" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlySalesChart;
