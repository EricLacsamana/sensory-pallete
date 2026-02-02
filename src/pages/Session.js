import React, { useState, useEffect } from 'react';

const Session = () => {
  // Dummy connection state
  const [isConnected, setIsConnected] = useState(true);

  // Dummy current data
  const [currentData, setCurrentData] = useState({
    pad: 'RED',
    force: 75,
    duration: 12,
    count: 3
  });

  // Dummy session history
  const [history, setHistory] = useState([
    { pad: 'RED', force: 70, duration: 10, count: 2 },
    { pad: 'BLUE', force: 55, duration: 8, count: 1 },
    { pad: 'GREEN', force: 90, duration: 15, count: 4 },
    { pad: 'RED', force: 60, duration: 12, count: 3 },
    { pad: 'BLUE', force: 50, duration: 7, count: 1 }
  ]);

  // Dummy handler for back button
  const handleBack = () => {
    alert("Ending Session and going back to Student Profile");
  };

  // Styling Logic (same as original)
  const getColorStyle = (colorName) => {
    const c = colorName ? colorName.toUpperCase() : '';
    switch(c) {
      case 'BLUE': return { color: '#007bff', border: '5px solid #007bff', bg: '#e7f1ff' };
      case 'RED': return { color: '#dc3545', border: '5px solid #dc3545', bg: '#ffe6e6' };
      case 'GREEN': return { color: '#28a745', border: '5px solid #28a745', bg: '#e6ffe6' };
      default: return { color: '#333', border: '5px solid #333', bg: '#f8f9fa' };
    }
  };

  const style = currentData ? getColorStyle(currentData.pad) : {};

  return (
    <div className="main-content" style={{textAlign: 'center'}}>
      <div className="page-header" style={{display: 'flex', justifyContent: 'space-between'}}>
         <h1 className="page-title">Active Session</h1>
         <button className="action-btn" onClick={handleBack} style={{background:'var(--yellow)'}}>End Session</button>
      </div>
      
      <div style={{
         padding: '10px', margin: '20px 0', borderRadius: '5px',
         backgroundColor: isConnected ? '#d4edda' : '#f8d7da',
         color: isConnected ? '#155724' : '#721c24', fontWeight: 'bold'
      }}>
        System Status: {isConnected ? "🟢 Online & Ready" : "🔴 Connecting..."}
      </div>

      {/* Main Display Area */}
      <div style={{
         padding: '50px', borderRadius: '20px', 
         border: style.border || '2px dashed #ccc',
         backgroundColor: style.bg || 'white',
         marginBottom: '30px', transition: '0.3s',
         minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
      }}>
        {currentData ? (
          <div>
            {/* Display the Color Name */}
            <h1 style={{fontSize: '80px', margin: 0, color: style.color}}>
              {currentData.pad || "DETECTED"}
            </h1>
            
            <div style={{display:'flex', gap:'20px', marginTop:'20px', color: '#666', fontSize:'18px'}}>
                <span>⏱ {currentData.duration}s</span>
                <span>💪 Force: {currentData.force}%</span>
                <span>🔢 Count: {currentData.count}</span>
            </div>
          </div>
        ) : (
          <h2 style={{color: '#aaa'}}>Waiting for Input...</h2>
        )}
      </div>

      {/* History List */}
      <div style={{textAlign: 'left', maxWidth: '600px', margin: '0 auto'}}>
        <h3>Session History</h3>
        <ul style={{listStyle:'none', padding:0}}>
          {history.map((item, index) => (
            <li key={index} style={{
                borderLeft: `5px solid ${getColorStyle(item.pad).color}`, 
                padding: '15px', margin: '10px 0', background: 'white', 
                borderRadius:'5px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                display: 'flex', justifyContent: 'space-between'
            }}>
              <strong>{item.pad} Signal</strong> 
              <span>Force: {item.force}% | {item.duration}s</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Session;
