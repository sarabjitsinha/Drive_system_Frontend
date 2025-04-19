/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import API from '../services/api';
// import { useAuth } from '../contexts/Authcontext';

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  // const {user}=useAuth()
  const user=localStorage.getItem("user")
  useEffect(() => {
   user && fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const { data } = await API.get('/files');
      setFiles(data);
    } catch (err) {
      console.error('Failed to fetch files', err);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await API.delete(`/files/${id}`);
      fetchFiles(); // refresh view
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  
  const buildTree = (items, parentId = null) => {
    return items
      .filter(item => {
        const itemParent = item.parent ? item.parent.toString() : null;
        return itemParent === parentId;
      })
      .map(item => ({
        ...item,
        children: buildTree(items, item._id.toString()),
      }));
  };
  

  const tree = buildTree(files);
  const handleDownload = async (id, name) => {
    try {
      const res = await API.get(`/files/download/${id}`, {
        responseType: 'blob',
      });
  
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed. You may be unauthorized or the file is missing.');
    }
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
              
              <button
                   onClick={() => handleDownload(node._id, node.name)}
                className="text-blue-600 underline"
                >
                  Download
                </button>

            )}
            <button
              onClick={() => deleteItem(node._id)}
              className="text-red-500 underline"
            >
              Delete
            </button>
          </div>
        </div>
        {node.children && node.children.length > 0 && renderTree(node.children, depth + 1)}
      </div>
    ));
  };

  return (user ?
    (<div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📂 Your Files & Folders</h1>
      {files.length === 0 ? (
        <p className="text-gray-500">No files uploaded yet.</p>
      ) : (
        renderTree(tree)
      )}
    </div>):<div></div>
  );
}
