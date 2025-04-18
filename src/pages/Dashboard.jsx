// import React, { useEffect, useState } from 'react';
// import API from '../services/api';

// export default function Dashboard() {
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const { data } = await API.get('/files');
//       setFiles(data);
//     };
//     fetchData();
//   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Your Files</h1>
//       <ul>
//         {files.map(file => (
//           <li key={file._id} className="border-b py-2">{file.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// File: pages/Dashboard.jsx
// import React, { useEffect, useState } from 'react';
// import API from '../services/api';

// export default function Dashboard() {
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data } = await API.get('/files');
//         setFiles(data);
//       } catch (err) {
//         console.error('Failed to fetch files', err);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Your Files & Folders</h1>

//       <ul className="space-y-2">
//         {files.map(file => (
//           <li key={file._id} className="flex justify-between items-center border-b pb-2">
//             <span>
//               📁 {file.type === 'folder' ? file.name : `📄 ${file.name}`}
//             </span>

//             {file.type === 'file' && (
//               <a
//                 href={`${import.meta.env.VITE_API_URL}/files/download/${file._id}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-500 underline"
//               >
//                 Download
//               </a>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// File: pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Dashboard() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get('/files');
        setFiles(data);
      } catch (err) {
        console.error('Failed to fetch files', err);
      }
    };
    fetchData();
  }, []);

  // Build a tree from flat list
  const buildTree = (items, parentId = null) => {
    return items
      .filter(item => item.parent === parentId)
      .map(item => ({
        ...item,
        children: buildTree(items, item._id),
      }));
  };

  const tree = buildTree(files);

  const renderTree = (nodes, depth = 0) => {
    return nodes.map((node) => (
      <div key={node._id} style={{ marginLeft: depth * 20 }} className="mb-1">
        <div className="flex justify-between items-center">
          <span>
            {node.type === 'folder' ? '📁' : '📄'} {node.name}
          </span>
          {node.type === 'file' && (
            <a
              href={`${import.meta.env.VITE_API_URL}/files/download/${node._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Download
            </a>
          )}
        </div>
        {node.children?.length > 0 && renderTree(node.children, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Files & Folders</h1>
      {renderTree(tree)}
    </div>
  );
}
