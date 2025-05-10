import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeScreen: React.FC = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!name.trim()) return;
    localStorage.setItem('userName', name.trim());
    navigate('/voice_input');
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-6 bg-gray-50">
      <h1 className="text-3xl font-bold">Welcome</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded px-4 py-2 w-64 text-center"
      />
      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Continue
      </button>
    </div>
  );
};

export default WelcomeScreen;
