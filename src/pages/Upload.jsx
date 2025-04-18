// import React, { useState } from 'react';
// import API from '../services/api';

// export default function Upload() {
//   const [file, setFile] = useState(null);

//   const handleUpload = async () => {
//     const formData = new FormData();
//     formData.append('file', file);
//     await API.post('/files/upload', formData,{headers:{"Content-Type":"multipart/form-data"}});
//     alert('Uploaded!');
//   };

//   return (
//     <div className="p-4">
//       <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//       <button onClick={handleUpload} className="ml-4 bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
//     </div>
//   );
// }

// File: pages/Upload.jsx
import React, { useState } from 'react';
import API from '../services/api';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [path, setPath] = useState('');
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) return setMessage('No file selected');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path); // user-defined path (e.g. folder1/folder2)

    try {
      await API.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Upload successful!');
      setFile(null);
      setPath('');
    } catch (err) {
      console.error(err);
      setMessage('Upload failed.');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload File</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <input
        type="text"
        value={path}
        onChange={(e) => setPath(e.target.value)}
        placeholder="Path (e.g. folder1/folder2)"
        className="mt-2 block w-full p-2 border rounded"
      />
      <button
        onClick={handleUpload}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload
      </button>

      {message && <p className="mt-4 text-sm text-blue-600">{message}</p>}
    </div>
  );
}
