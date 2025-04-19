
// File: pages/Upload.jsx
// import React, { useState } from 'react';
// import API from '../services/api';
// import Dashboard from './Dashboard';
// import { useAuth } from '../contexts/Authcontext';

// export default function Upload() {
//   const [file, setFile] = useState(null);
//   const [path, setPath] = useState('');
//   const [message, setMessage] = useState('');
//   // const user=localStorage.getItem("user");
//   const {user}=useAuth();

//   const handleUpload = async () => {
//     if (!file) return setMessage('No file selected');

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('path', path); //Creates user-defined path (e.g. folder1/folder2)

//     try {
//       await API.post('/files/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       setMessage('Upload successful!');
//       setFile(null);
//       setPath('');
//       alert("upload success")
//       window.location.reload()
//     } 
//     catch (err) {
//       alert("Please connect to backend to execute upload")
//       console.error(err);
//       setMessage('Upload failed.');
//     }
//   };

//   return (user ?
//     (<div className="p-4 max-w-lg mx-auto">
//       <h2 className="text-xl font-bold mb-4">Upload File</h2>

//       <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//       <input
//         type="text"
//         value={path}
//         onChange={(e) => setPath(e.target.value)}
//         placeholder="Path (e.g. folder1/folder2)"
//         className="mt-2 block w-full p-2 border rounded"
//       />
//       <button
//         onClick={handleUpload}
//         className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         Upload
//       </button>

//       {message && <p className="mt-4 text-sm text-blue-600">{message}</p>}
//     </div>):<Dashboard/>
//   );
// }






// import React, { useEffect, useState } from 'react';
// import API from '../services/api';

// export default function Upload() {
//   const [file, setFile] = useState(null);
//   const [folders, setFolders] = useState([]);
//   const [selectedPath, setSelectedPath] = useState('');
//   const [message, setMessage] = useState('');

//   // Get all folders for dropdown
//   useEffect(() => {
//     const fetchFolders = async () => {
//       const { data } = await API.get('/files');
//       const onlyFolders = data.filter(f => f.type === 'folder');
//       const folderTree = buildPathTree(onlyFolders);
//       setFolders(folderTree);
//     };
//     fetchFolders();
//   }, []);

//   // Build full folder path from nested folder data
//   const buildPathTree = (items) => {
//     const map = {};
//     const roots = [];

//     items.forEach(item => (map[item._id] = { ...item, children: [] }));
//     items.forEach(item => {
//       if (item.parent && map[item.parent]) {
//         map[item.parent].children.push(map[item._id]);
//       } else {
//         roots.push(map[item._id]);
//       }
//     });

//     const flatten = (nodes, prefix = '') => {
//       return nodes.flatMap(node => {
//         const path = `${prefix}${node.name}`;
//         return [
//           { id: node._id, path },
//           ...flatten(node.children, `${path}/`)
//         ];
//       });
//     };

//     return flatten(roots);
//   };

//   const handleUpload = async () => {
//     if (!file) return setMessage('No file selected.');

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('path', selectedPath); // backend auto-creates folders if needed

//     try {
//       await API.post('/files/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       setMessage('Upload successful!');
//       setFile(null);
//       setSelectedPath('');
//     } catch (err) {
//       console.error(err);
//       setMessage('Upload failed.');
//     }
//   };

//   return (
//     <div className="p-4 max-w-xl mx-auto">
//       <h2 className="text-xl font-bold mb-4">Upload File to Selected Folder</h2>

//       <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-2" />

//       <select
//         value={selectedPath}
//         onChange={(e) => setSelectedPath(e.target.value)}
//         className="w-full p-2 border rounded mb-4"
//       >
//         <option value="">Select folder (or upload to root)</option>
//         {folders.map(folder => (
//           <option key={folder.id} value={folder.path}>{folder.path}</option>
//         ))}
//       </select>

//       <button
//         onClick={handleUpload}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         Upload
//       </button>

//       {message && <p className="mt-4 text-sm text-blue-600">{message}</p>}
//     </div>
//   );
// }



import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Dashboard from './Dashboard';
import { useAuth } from '../contexts/Authcontext';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [folders, setFolders] = useState([]);
  const [selectedPath, setSelectedPath] = useState('');
  const [customPath, setCustomPath] = useState('');
  const [message, setMessage] = useState('');
  const {user}=useAuth();

  useEffect(() => {
    const fetchFolders = async () => {
      const { data } = await API.get('/files');
      const onlyFolders = data.filter(f => f.type === 'folder');
      const folderTree = buildPathTree(onlyFolders);
      setFolders(folderTree);
    };
    fetchFolders();
  }, []);

  const buildPathTree = (items) => {
    const map = {};
    const roots = [];

    items.forEach(item => (map[item._id] = { ...item, children: [] }));
    items.forEach(item => {
      if (item.parent && map[item.parent]) {
        map[item.parent].children.push(map[item._id]);
      } else {
        roots.push(map[item._id]);
      }
    });

    const flatten = (nodes, prefix = '') => {
      return nodes.flatMap(node => {
        const path = `${prefix}${node.name}`;
        return [
          { id: node._id, path },
          ...flatten(node.children, `${path}/`)
        ];
      });
    };

    return flatten(roots);
  };

  const handleUpload = async () => {
    if (!file) return setMessage('No file selected.');

    const uploadPath = customPath || selectedPath;

    if (!uploadPath) return setMessage('Please select or create a path.');

    try {
      // Step 1: Create path (backend handles smart idempotent creation)
      await API.post('/files/create-path', { path: uploadPath });

      // Step 2: Upload file into path
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', uploadPath);

      await API.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('Upload successful!');
      setFile(null);
      setSelectedPath('');
      setCustomPath('');
      window.location.reload();
    } catch (err) {
      console.error(err);
      setMessage('Upload failed.');
    }
  };

  return (user ?
    (<div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload File</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-2 border-4 border-amber-900" />

      <div className="mb-4">
        <label className="block font-semibold mb-1">Choose existing folder:</label>
        <select
          value={selectedPath}
          onChange={(e) => {
            setSelectedPath(e.target.value);
            setCustomPath('');
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">Select folder (or leave blank)</option>
          {folders.map(folder => (
            <option key={folder.id} value={folder.path}>{folder.path}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Or create a new nested path:</label>
        <input
          type="text"
          value={customPath}
          onChange={(e) => {
            setCustomPath(e.target.value);
            setSelectedPath('');
          }}
          placeholder="e.g. Projects/2025/Designs"
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload File
      </button>

      {message && <p className="mt-4 text-sm text-blue-600">{message}</p>}
    </div>):<Dashboard/>
  );
}
