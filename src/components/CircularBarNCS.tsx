import React from "react";

interface CircularBarChartProps {
  data: number[]; // 128 length array representing radii
  size?: number; // optional size of the canvas (width/height)
  barColor?: string;
  backgroundColor?: string;
}

const CircularBarChart: React.FC<CircularBarChartProps> = ({
  data,
  size = 400,
  barColor = "#00f0ff",
  backgroundColor = "#000000"
}) => {
  const center = size / 2;
  const radius = size / 2 - 20; // padding from edge
  const barWidth = (2 * Math.PI) / data.length;

  return (
    <svg width={size} height={size} style={{ backgroundColor }}>
      {data.map((value, i) => {
        const angle = i * barWidth - Math.PI / 2; // start from top
        const innerR = radius * 0.5;
        const outerR = innerR + value;

        const x1 = center + innerR * Math.cos(angle);
        const y1 = center + innerR * Math.sin(angle);
        const x2 = center + outerR * Math.cos(angle);
        const y2 = center + outerR * Math.sin(angle);

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={barColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

export default CircularBarChart;
