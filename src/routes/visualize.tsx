import React, { useEffect, useState } from 'react';

const ResultPage = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const [targetUser, setTargetUser] = useState('');
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);
  const [compareStatus, setCompareStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const userName = localStorage.getItem('userName') ?? 'unknown';

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`/api/result?name=${encodeURIComponent(userName)}`);
        const data = await res.json();
        setImageUrl(data.imageUrl);
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

  if (status === 'error' || !imageUrl) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Failed to load result image.
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {/* Section 1: Result Image */}
      <section className="snap-start h-screen flex flex-col justify-center items-center bg-gray-100 px-6">
        <h2 className="text-2xl font-bold mb-4">Your Analysis Image</h2>
        <img
          src={imageUrl}
          alt="Result"
          className="max-h-[70vh] w-auto rounded shadow-md"
        />
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
