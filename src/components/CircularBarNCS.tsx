import React, {useEffect, useState, useRef} from "react";

interface CircularBarChartProps {
  data: number[][]; // 128 length array representing radii
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [idx, setIdx] = useState(0)
  const vectors_dt_sec: number = 1;
  const idx_dt_sec: number = 0.02;
  const frames: number = vectors_dt_sec / idx_dt_sec;

  useEffect(
    ()=>{
        const interval = setInterval(()=>{
            setIdx(idx=>(idx+1) % (frames * 10));
        }, 1000 * idx_dt_sec);

        const N: number = Math.floor(idx / frames);
        
        let currdata: number[] = data[N];

        const center = size / 2;
        const radius = size / 2 - 20; // padding from edge
        const barWidth = (2 * Math.PI) / currdata.length;
        let angle = 0; // start from top
        const innerR = radius * 0.5;
        let outerR = 0;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, size, size)


        for(let i=0; i<currdata.length; i++){
            angle = i * barWidth - Math.PI / 2;
            outerR = innerR + currdata[i];
            ctx.beginPath()

            // Outer arc
            ctx.arc(center, center, outerR, angle, angle, false)

            // Line from outer to inner radius (at end angle)
            ctx.lineTo(
                center + innerR * Math.cos(angle + barWidth),
                center + innerR * Math.sin(angle + barWidth)
            )

            // Inner arc (reversed)
            ctx.arc(center, center, innerR, angle + barWidth, angle, true)

            // Close path and fill
            ctx.closePath()
            ctx.fillStyle = 'Blue'
            ctx.fill()
        }

        return () => clearInterval(interval); // cleanup

   }, []);
    
  return <canvas ref={canvasRef} width={size} height={size} />;

};

export default CircularBarChart;
