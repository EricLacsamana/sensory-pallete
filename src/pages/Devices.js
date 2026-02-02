import React, { useState, useEffect } from 'react';
import { FaWifi, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const Devices = () => {
  // --- DUMMY STATE ---
  const [status, setStatus] = useState('Connected');
  const [ping, setPing] = useState(42);
  const [currentData, setCurrentData] = useState({
    pad: 'RED',
    force: 78,
    duration: 12,
    count: 3
  });

  const [history, setHistory] = useState([
    { time: '10:14:22 AM', pad: 'RED', force: 78, duration: 12, count: 3 },
    { time: '10:13:58 AM', pad: 'BLUE', force: 55, duration: 8, count: 1 },
    { time: '10:13:30 AM', pad: 'GREEN', force: 90, duration: 15, count: 4 },
    { time: '10:12:59 AM', pad: 'RED', force: 60, duration: 10, count: 2 },
    { time: '10:12:10 AM', pad: 'BLUE', force: 48, duration: 6, count: 1 }
  ]);

  // Helper to visualize the sensor color
  const getStatusColor = () => status === 'Connected' ? '#4CAF50' : '#F44336';

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Device Management</h1>
        <p style={{color: 'gray'}}>Hardware Diagnostic Console</p>
      </div>

      {/* STATUS CARDS */}
      <div style={{display: 'flex', gap: '20px', marginBottom: '30px'}}>
        
        {/* Connection Card */}
        <div style={{
          flex: 1, padding: '20px', borderRadius: '15px',
          background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          borderLeft: `5px solid ${getStatusColor()}`
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            {status === 'Connected'
              ? <FaCheckCircle color="#4CAF50" size={24}/>
              : <FaExclamationTriangle color="#F44336" size={24}/>
            }
            <div>
              <h3 style={{margin: 0}}>System Status</h3>
              <p style={{margin: 0, color: getStatusColor(), fontWeight: 'bold'}}>
                {status}
              </p>
            </div>
          </div>
          <p style={{fontSize: '12px', color: '#999', marginTop: '10px'}}>
            Target Host: 192.168.1.10
          </p>
        </div>

        {/* Live Data Card */}
        <div style={{
           flex: 1, padding: '20px', borderRadius: '15px',
           background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
           display: 'flex', flexDirection: 'column', justifyContent: 'center'
        }}>
           <h3 style={{margin: 0, marginBottom: '5px'}}>Live Sensor Input</h3>
           {currentData ? (
             <div>
               <span style={{fontSize: '24px', fontWeight: 'bold', color: '#2C3E50'}}>
                 {currentData.pad}
               </span>
               <span style={{
                 marginLeft: '10px',
                 padding: '2px 8px',
                 borderRadius: '10px',
                 background: '#eee',
                 fontSize: '12px'
               }}>
                 Duration: {currentData.duration}s
               </span>
               <div style={{fontSize: '14px', color: '#666', marginTop: '5px'}}>
                 Force Applied: {currentData.force}%
               </div>
             </div>
           ) : (
             <div style={{color: '#ccc', fontStyle: 'italic'}}>
               Waiting for input...
             </div>
           )}
        </div>
      </div>

      {/* SIGNAL LOGS */}
      <div style={{background: 'white', padding: '20px', borderRadius: '15px'}}>
        <h3>Recent Signal Logs</h3>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Sensor ID (Pad)</th>
              <th>Force</th>
              <th>Duration</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i}>
                <td>{h.time}</td>
                <td style={{
                  fontWeight: 'bold',
                  color:
                    h.pad === 'RED'
                      ? '#E74C3C'
                      : h.pad === 'GREEN'
                      ? '#2ECC71'
                      : '#3498DB'
                }}>
                  {h.pad}
                </td>
                <td>{h.force}%</td>
                <td>{h.duration}s</td>
                <td>{h.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Devices;
