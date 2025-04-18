import React, { useState } from 'react';
import API from '../services/api';

export default function CreatePath() {
  const [path, setPath] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/files/create-path', { path });
      setMessage(`Created path: ${res.data.folder.name}`);
      setPath('');
    } catch (err) {
      console.error(err);
      setMessage('Failed to create path.');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Folder Path</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="e.g. folder1/folder2/folder3"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Create Path
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-blue-600">{message}</p>}
    </div>
  );
}

