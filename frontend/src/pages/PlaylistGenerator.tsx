import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';

const PlaylistGenerator: React.FC = () => {
  const [emotion, setEmotion] = useState('');
  const [memory, setMemory] = useState('');
  const [error, setError] = useState('');
  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:3001/api/playlists/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ emotion, memory }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to generate playlist');
      }
    } catch (err) {
      setError('An error occurred while generating the playlist');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Generate Playlist</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500">{error}</div>}
          <div>
            <label htmlFor="emotion" className="block text-sm font-medium text-gray-700">
              Emotion
            </label>
            <input
              type="text"
              id="emotion"
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="memory" className="block text-sm font-medium text-gray-700">
              Memory
            </label>
            <textarea
              id="memory"
              value={memory}
              onChange={(e) => setMemory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={4}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Playlist
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlaylistGenerator; 