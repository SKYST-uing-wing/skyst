import React, { useEffect, useRef, useState } from "react";

interface CircularBarChartProps {
  data: number[][]; // 128 length array representing radii
  size?: number;
  barColor?: string;
  backgroundColor?: string;
}

const CircularBarChart: React.FC<CircularBarChartProps> = ({
  data,
  size = 400,
  barColor = "#00f0ff",
  backgroundColor = "#000000"
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [idx, setIdx] = useState(0);

  const vectors_dt_sec = 1;
  const idx_dt_sec = 0.02;
  const frames = vectors_dt_sec / idx_dt_sec;

  // 업데이트 타이머
  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % (frames * 10));
    }, 1000 * idx_dt_sec);

    return () => clearInterval(interval);
  }, []);

  console.log(data)
  // 그리기 로직
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const N = Math.floor(idx / frames);
    let currdata_: number[] = data[N % data.length];
    let currdata: number[] = currdata_.slice(30);
    
    const center = size / 2;
    const radius = size / 2 - 20;
    const barWidth = (2 * Math.PI) / currdata.length;
    const innerR = radius * 0.5;

    // 배경 지우기
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size, size);

    // 바 그리기
    for (let i = 0; i < currdata.length; i++) {
      const angle = i * barWidth - Math.PI / 2;
      const outerR = innerR + 10 + currdata[i];

      ctx.beginPath();
      ctx.arc(center, center, outerR, angle, angle + barWidth, false);
      ctx.lineTo(
        center + innerR * Math.cos(angle + barWidth),
        center + innerR * Math.sin(angle + barWidth)
      );
      ctx.arc(center, center, innerR, angle + barWidth, angle, true);
      ctx.closePath();
      ctx.fillStyle = barColor;
      ctx.fill();
    }
  }, [idx, data, size, barColor, backgroundColor]);

  return <canvas ref={canvasRef} width={size} height={size} />;
};

export default CircularBarChart;
