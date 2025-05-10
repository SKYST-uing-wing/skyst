import React, { useEffect, useRef, useState, useMemo } from "react";

interface CircularBarChartProps {
  data: number[][]; // shape: [frames][bars]
  size?: number;
  barColor?: string;
  backgroundColor?: string;
}

const CircularBarChart: React.FC<CircularBarChartProps> = React.memo(({
  data,
  size = 400,
  barColor = "#9C27B0",
  backgroundColor = "#e2e8f0"
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null); // ✅ 캐싱
  const [idx, setIdx] = useState(0);
  const frames = 24;

  // ✅ context 한 번만 얻음
  useEffect(() => {
    if (canvasRef.current && !ctxRef.current) {
      ctxRef.current = canvasRef.current.getContext("2d");
    }
  }, []);

  // ✅ 타이머만 idx 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1));
    }, 1000 / frames);
    
    return () => clearInterval(interval);
  }, []);

  // ✅ 그리기 로직
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    
    const N = idx;
    const raw = data[N % data.length];
    const currdata = raw.slice(30); // 최적화: 변경되지 않으면 slice할 필요 없음

    const center = size / 2;
    const radius = size / 2 - 20;
    const barWidth = (2 * Math.PI) / currdata.length;
    const innerR = radius * 0.5;

    // 지우기
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size, size);

    // 그리기
    ctx.fillStyle = barColor;
    for (let i = 0; i < currdata.length; i++) {
      const angle = i * barWidth - Math.PI / 2;
      const outerR = innerR + 10 + currdata[i];

      const x0 = center + innerR * Math.cos(angle + barWidth);
      const y0 = center + innerR * Math.sin(angle + barWidth);

      ctx.beginPath();
      ctx.arc(center, center, outerR, angle, angle + barWidth, false);
      ctx.lineTo(x0, y0);
      ctx.arc(center, center, innerR, angle + barWidth, angle, true);
      ctx.closePath();
      ctx.fill();
    }
  }, [idx, data, size, barColor, backgroundColor]);

  return <canvas ref={canvasRef} width={size} height={size} />;
});

export default CircularBarChart;
