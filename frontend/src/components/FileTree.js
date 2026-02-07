// HEADY_BRAND:BEGIN
// HEADY SYSTEMS :: SACRED GEOMETRY
// FILE: frontend/src/components/FileTree.js
// LAYER: ui/frontend
// 
//         _   _  _____    _    ____   __   __
//        | | | || ____|  / \  |  _ \ \ \ / /
//        | |_| ||  _|   / _ \ | | | | \ V / 
//        |  _  || |___ / ___ \| |_| |  | |  
//        |_| |_||_____/_/   \_\____/   |_|  
// 
//    Sacred Geometry :: Organic Systems :: Breathing Interfaces
// HEADY_BRAND:END

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FileTree = ({ onFileSelect }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('admin_token') || 'default_insecure_token';
        const res = await axios.get('/api/files', {
            headers: { 'X-Admin-Token': token }
        });
        setFiles(res.data.files);
      } catch (err) {
        console.error("Failed to load files", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="file-tree" style={{ padding: '5px' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#bbb' }}>EXPLORER</div>
      {files.sort().map(f => (
        <div
          key={f}
          onClick={() => onFileSelect(f)}
          style={{
            cursor: 'pointer',
            padding: '4px 8px',
            color: '#ccc',
            fontSize: '13px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#37373d'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <HeadySacredIcon 
            name={f.endsWith('.js') ? 'code' : f.endsWith('.py') ? 'brain' : 'connection'} 
            size={14} 
            color={f.endsWith('.js') ? '#00f2ff' : f.endsWith('.py') ? '#bd00ff' : '#00ff88'} 
            style={{ marginRight: '8px' }}
          />
          {f}
        </div>
      ))}
    </div>
  );
};

export default FileTree;
