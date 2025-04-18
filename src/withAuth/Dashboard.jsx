import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Dashboard() {
  const [files, setFiles] = useState([]);
   const user=localStorage.getItem("user")

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const { data } = await API.get('/files');
      setFiles(data);
    } catch (err) {
      console.error('Failed to fetch files', err);
    }
  };

  const deleteFile = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await API.delete(`/files/${id}`);
      fetchFiles(); // Refresh the file list
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const buildTree = (items, parentId = null) => {
    return items
      .filter(item => item.parent === parentId)
      .map(item => ({
        ...item,
        children: buildTree(items, item._id),
      }));
  };

    const renderTree = (nodes, depth = 0) => {
    return nodes.map((node) => (
      <div key={node._id} style={{ marginLeft: depth * 20 }} className="mb-1">
        <div className="flex justify-between items-center">
          <span>
            {node.type === 'folder' ? '📁' : '📄'} {node.name}
          </span>
  
          <div className="flex gap-2">
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
            {/* ✅ Show delete for both file and folder */}
            <button
              onClick={() => deleteFile(node._id)}
              className="text-red-500 underline"
            >
              Delete
            </button>
          </div>
        </div>
        {node.children?.length > 0 && renderTree(node.children, depth + 1)}
      </div>
    ));
  };

  const tree = buildTree(files);

  return (user ?
   (<div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Files & Folders</h1>
      {renderTree(tree)}
    </div>):<div></div>)
  
}
