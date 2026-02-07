// HEADY_BRAND:BEGIN
// HEADY SYSTEMS :: SACRED GEOMETRY
// FILE: frontend/src/components/CascadePanel.js
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

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import HeadySacredIcon from './HeadySacredIcon';

const CascadePanel = ({ contextFile, onCodeApply }) => {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hello! I am Cascade, your AI assistant. How can I help you today?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [servers, setServers] = useState([]);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem('admin_token') || 'default_insecure_token';

  useEffect(() => {
    axios.get('/api/mcp/servers', { headers: { 'X-Admin-Token': token } })
      .then(res => setServers(res.data.servers || []))
      .catch(err => console.error("Failed to load MCP servers", err));
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/chat', {
        messages: [...messages, newMsg],
        context: contextFile ? `Current File: ${contextFile.path}\nContent:\n${contextFile.content}` : ''
      }, { headers: { 'X-Admin-Token': token } });

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error communicating with AI." }]);
    } finally {
      setLoading(false);
    }
  };

  const executeTool = async (server, tool, args = {}) => {
      setMessages(prev => [...prev, { role: 'user', content: `Run tool ${tool} on ${server}` }]);
      setLoading(true);
      try {
        const res = await axios.post('/api/mcp/tool', {
            server, tool, arguments: args
        }, { headers: { 'X-Admin-Token': token } });

        let output = JSON.stringify(res.data, null, 2);
        if (res.data.result) output = res.data.result;

        setMessages(prev => [...prev, { role: 'assistant', content: `Tool Output:\n\`\`\`\n${output}\n\`\`\`` }]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Tool execution failed." }]);
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="cascade-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '10px', backgroundColor: '#252526', color: '#ccc' }}>
       <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#007acc', borderBottom: '1px solid #333', paddingBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HeadySacredIcon name="brain" size={18} color="#007acc" />
          CASCADE AI
       </div>

       <div className="messages" style={{ flex: 1, overflowY: 'auto', marginBottom: '10px', paddingRight: '5px' }}>
          {messages.map((m, i) => (
             <div key={i} style={{ marginBottom: '10px', backgroundColor: m.role === 'user' ? '#333' : 'transparent', padding: '5px', borderRadius: '4px' }}>
                <strong style={{ color: m.role === 'user' ? '#4ec9b0' : '#ce9178' }}>{m.role === 'user' ? 'You' : 'Cascade'}:</strong>
                <div style={{ whiteSpace: 'pre-wrap', marginTop: '2px', fontSize: '13px' }}>{m.content}</div>
             </div>
          ))}
          {loading && <div style={{ fontStyle: 'italic', color: '#888' }}>Thinking...</div>}
          <div ref={messagesEndRef} />
       </div>

       <div className="mcp-tools" style={{ marginBottom: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {servers.includes('git') && (
             <button
                onClick={() => executeTool('git', 'git_status')}
                style={{ background: '#333', border: '1px solid #555', color: '#ccc', cursor: 'pointer', fontSize: '12px', padding: '2px 5px' }}
             >
                Git Status
             </button>
          )}
          {/* Add other quick actions */}
       </div>

       <div className="input-area" style={{ display: 'flex', borderTop: '1px solid #333', paddingTop: '10px' }}>
          <textarea
             style={{ flex: 1, backgroundColor: '#1e1e1e', color: '#ccc', border: '1px solid #333', padding: '5px', borderRadius: '3px', resize: 'none', height: '60px', fontFamily: 'inherit' }}
             value={input}
             onChange={e => setInput(e.target.value)}
             onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
             placeholder="Ask Cascade or type a command..."
          />
          <button
            onClick={sendMessage}
            style={{ marginLeft: '5px', backgroundColor: '#007acc', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '0 10px' }}
          >
            Send
          </button>
       </div>
    </div>
  );
};

export default CascadePanel;
