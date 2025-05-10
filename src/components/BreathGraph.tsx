import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

interface TimeSeriesLineChartProps {
  data: number[][];
}

const keys = ["A", "B", "C", "D", "E", "F"];
const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#413ea0", "#ff0000"];

const TimeSeriesLineChart: React.FC<TimeSeriesLineChartProps> = ({ data }) => {
  const formattedData = data.map((row, i) => {
    const entry: Record<string, number | string> = { time: `T${i + 1}` };
    row.forEach((value, j) => {
      entry[keys[j]] = value;
    });
    return entry;
  });

  return (
    <ResponsiveContainer width={600} height={400}>
      <LineChart
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={false} />
        <XAxis dataKey="time" axisLine={true} tickLine={false} tick={false} />
        <YAxis axisLine={true} tickLine={false} tick={false} />
        {keys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimeSeriesLineChart;
