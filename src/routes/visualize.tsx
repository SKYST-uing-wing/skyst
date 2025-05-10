import React, { useEffect, useState } from 'react';

const Visualize: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'processing' | 'done' | 'error'>('loading');
  const userName = localStorage.getItem('userName') ?? 'unknown';

  useEffect(() => {
    let interval: number;

    const pollResult = async () => {
      try {
        const response = await fetch(`http://192.168.1.253:8080/upload-mp3?name=${encodeURIComponent(userName)}`);
        const data = await response.json();

        if (data.status === 'processing') {
          setStatus('processing');
        } else if (data.status === 'done') {
          setResult(data.result);
          setStatus('done');
          clearInterval(interval); // Stop polling
        } else {
          throw new Error('Unknown status');
        }
      } catch (error) {
        console.error('Error fetching result:', error);
        setStatus('error');
        clearInterval(interval);
      }
    };

    // Start polling every 3 seconds
    interval = setInterval(pollResult, 3000);
    pollResult(); // call immediately as well

    return () => clearInterval(interval); // cleanup
  }, [userName]);

  return (
    <div className="h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold mb-6">Processing Your Audio...</h1>

      {status === 'loading' || status === 'processing' ? (
        <div className="text-gray-500 animate-pulse">Please wait while we calculate your result.</div>
      ) : status === 'done' ? (
        <div className="bg-white shadow-md rounded p-6 max-w-lg w-full">
          <p className="text-xl">{result}</p>
        </div>
      ) : (
        <p className="text-red-500">Something went wrong. Please try again later.</p>
      )}
    </div>
  );
};

export default Visualize;
