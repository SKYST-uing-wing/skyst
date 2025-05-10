import React, { useEffect, useState } from 'react';
import BreathCircle from '../components/BreathCircle';
import { URI } from '../../const';
import TimeSeriesLineChart from '../components/BreathGraph';
import CircularBarChart from '../components/CircularBarNCS';

const ResultPage: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [vectors, setVectors] = useState<number[][]>([]);

  const [targetUser, setTargetUser] = useState('');
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);
  const [compareStatus, setCompareStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const userName = localStorage.getItem('userName') ?? 'unknown';

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`${URI}result?name=${encodeURIComponent(userName)}`);
        const data = await res.json();
        setVectors(data.vectors);
        setStatus('ready');
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };

    fetchImage();
  }, [userName]);

  const handleCompare = async () => {
    if (!targetUser.trim()) return;
    setCompareStatus('loading');
    try {
      const res = await fetch(
        `/api/compare?name=${encodeURIComponent(userName)}&target=${encodeURIComponent(targetUser)}`
      );
      const data = await res.json();
      setComparisonResult(data.result);
      setCompareStatus('done');
    } catch (err) {
      console.error(err);
      setCompareStatus('error');
    }
  };

  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 animate-pulse">
        Loading your result...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Failed to load result image.
      </div>
    );
  }

  // let vectors: number[][] = [
  //   [0.12, 0.4, 0.78, 0.05, 0.91, 0],
  //   [0.14, 0.5, 0.77, 0.06, 0.90, 0.1],
  //   [0.13, 0.6, 0.76, 0.08, 0.88, 0.2],
  //   [0.15, 0.5, 0.74, 0.07, 0.87, 0.3],
  //   [0.16, 0.4, 0.75, 0.06, 0.89, 0.4],
  //   [0.18, 0.3, 0.76, 0.05, 0.90, 0.5],
  //   [0.19, 0.2, 0.78, 0.04, 0.91, 0.6],
  //   [0.20, 0.3, 0.79, 0.06, 0.92, 0.7],
  //   [0.19, 0.4, 0.81, 0.07, 0.91, 0.8],
  //   [0.21, 0.5, 0.82, 0.08, 0.90, 0.9]
  // ];
  

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {/* Section 1: Result Image */}
      <section className="snap-start h-screen flex flex-col justify-center items-center bg-gray-100 px-6">
        <h2 className="text-2xl font-bold mb-4">Your Analysis Image</h2>

        <CircularBarChart data = {vectors}></CircularBarChart>
        
        <TimeSeriesLineChart data = {vectors}></TimeSeriesLineChart>

        <BreathCircle vectors={vectors}></BreathCircle>

      </section>

      {/* Section 2: Comparison Input */}
      <section className="snap-start h-screen flex flex-col justify-center items-center bg-white px-6">
        <h2 className="text-2xl font-bold mb-4">Compare With Another User</h2>
        <input
          type="text"
          placeholder="Enter username to compare"
          value={targetUser}
          onChange={(e) => setTargetUser(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 mb-4 w-full max-w-sm text-center"
        />
        <button
          onClick={handleCompare}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Compare
        </button>

        {compareStatus === 'loading' && (
          <p className="mt-4 text-gray-500 animate-pulse">Comparing...</p>
        )}

        {compareStatus === 'done' && comparisonResult && (
          <p className="mt-4 text-lg text-center max-w-lg">{comparisonResult}</p>
        )}

        {compareStatus === 'error' && (
          <p className="mt-4 text-red-500">Failed to fetch comparison result.</p>
        )}
      </section>
    </div>
  );
};

export default ResultPage;
