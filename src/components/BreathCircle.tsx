import React, { useEffect, useRef, useState } from 'react';

type BreathVector = [number, number, number, number, number, number];

interface BreathCircleProps {
  vectors: number[][];
  size?: number; // canvas size
}

const BreathCircle: React.FC<BreathCircleProps> = ({ vectors, size = 500 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [idx, setIdx] = useState(0)

  const vectors_dt_sec: number = 1;
  const idx_dt_sec: number = 0.05;

  const frames: number = vectors_dt_sec / idx_dt_sec;

  useEffect(
    ()=>{
        const interval = setInterval(()=>{
            setIdx(idx=>(idx+1) % (frames * 10));
        }, 1000 * idx_dt_sec);

    console.log(idx / frames);

    if ((idx / frames) >= 8.95) {
        setIdx(0);
    }

    const N: number = Math.floor(idx / frames);
    const alpha: number = idx / frames - N;
    let vector: BreathVector = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 6; i++) {
        vector[i] = vectors[N][i] + Math.atan(alpha * 1.35) * (vectors[N + 1][i] - vectors[N][i]);
    }

    const [volume, c1, c2, c3, r, theta] = vector;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background color
    // const bg_red = 0;
    // const bg_green = 0; 
    // const bg_blue = 0;

    const background = `rgba(bg_red, bg_green, bg_blue, 1)`
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, size, size);

    // Convert polar coordinates to cartesian
    const radiusScale = size / 3; // max movement radius
    const centerX = size / 2;
    const centerY = size / 2;
    const radian = theta * 2 * Math.PI; // theta: 0~1 assumed
    const distance = r * radiusScale; // r: 0~1 assumed
    const x = centerX + distance * Math.cos(radian);
    const y = centerY + distance * Math.sin(radian);

    // Color (c1, c2, c3): assume normalized 0~1 → convert to RGB
    const red = Math.floor(c1 * 255);
    const green = Math.floor(c2 * 255);
    const blue = Math.floor(c3 * 255);
    const color = `rgba(${red}, ${green}, ${blue}, 1)`; // soft glow
    const color_medium = `rgba(${red*0.8}, ${green*0.8}, ${blue*0.8}, 0.8)`

    // Radius (volume): normalize and scale
    const circleRadius = 10 + volume * 400;

    // Create radial gradient (soft edge like airbrush)
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, circleRadius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.7, color_medium);
    gradient.addColorStop(1, 'rgba(0,0,0,0)')

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
    ctx.fill();

    return () => clearInterval(interval); // cleanup
  }, [vectors, size, idx]);

  return <canvas ref={canvasRef} width={size} height={size} />;
};

export default BreathCircle;
