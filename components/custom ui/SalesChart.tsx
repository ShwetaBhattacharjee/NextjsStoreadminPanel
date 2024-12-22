"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const SalesChart = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        className="w-full h-full"
        data={data}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        {/* Deep blue color and animation */}
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#003366" // Deep blue stroke color
          strokeWidth={2}
          dot={{ stroke: "#003366", strokeWidth: 2 }} // Deep blue dots
          activeDot={{ r: 8 }} // Enlarged active dot
          isAnimationActive={true} // Enable animation
          animationDuration={1500} // Animation duration in ms
        />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;
