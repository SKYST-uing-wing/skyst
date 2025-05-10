import { Box } from "@chakra-ui/react";
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
    <Box borderWidth={2} borderTop={'none'} borderRight={'none'} borderColor={'black'}>
      <ResponsiveContainer width={300} height={200}>
        <LineChart
          data={formattedData}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={false} />
          <XAxis dataKey="time" axisLine={true} tickLine={false} tick={false} hide />
          <YAxis axisLine={true} tickLine={false} tick={false} hide />
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
    </Box>
  );
};

export default TimeSeriesLineChart;
