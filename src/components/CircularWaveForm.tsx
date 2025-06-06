import React, { useEffect, useRef } from 'react';

interface CircularWaveformProps {
  recordingStatus: boolean;
}

const CircularWaveform: React.FC<CircularWaveformProps> = ({ recordingStatus }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previousDataRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.25;

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    const bufferLength = analyser.fftSize;
    const dataArray = new Float32Array(bufferLength);

    let animationId: number;

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const draw = () => {
        analyser.getFloatTimeDomainData(dataArray);

        // Smooth data
        const previousData = previousDataRef.current;
        if (previousData) {
          for (let i = 0; i < bufferLength; i++) {
            dataArray[i] = (dataArray[i] + previousData[i]) / 2;
          }
        }
        previousDataRef.current = dataArray.slice();

        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);

        ctx.beginPath();
        const normFactor: number = recordingStatus
          ? 1 
          : 0;
        for (let i = 0; i < bufferLength; i++) {
          const angle = (i / bufferLength) * 2 * Math.PI;
          const v = dataArray[i];
          const smoothed = Math.max(-1, Math.min(1, v));
          const r = radius + normFactor * smoothed * 80;
          const x = centerX + r * Math.cos(angle);
          const y = centerY + r * Math.sin(angle);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.closePath();

        // 💡 Put colors here to reflect latest `recordingStatus`
        const dynamicColors = recordingStatus
          ? ['#00ffff', '#ff00ff', '#00aaff']
          : ['#1a1f33', '#2a2f44', '#3a3f55'];

        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, dynamicColors[0]);
        gradient.addColorStop(0.5, dynamicColors[1]);
        gradient.addColorStop(1, dynamicColors[2]);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = dynamicColors[0];
        ctx.stroke();

        animationId = requestAnimationFrame(draw);
      };

      draw();
    }).catch(err => {
      console.error('Microphone access error:', err);
      alert('🎤 마이크 권한이 없어요... 새로고침 후 권한 재설정!!');
    });

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      audioCtx.close();
    };
  }, [recordingStatus]);

  return <canvas ref={canvasRef} style={{ display: 'block', background: '#f5f5f5' }} />;
};

export default CircularWaveform;
