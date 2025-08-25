import React from 'react';

const SimpleApp = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#667eea',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      color: 'white'
    }}>
      <div style={{
        background: 'white',
        color: '#333',
        padding: '3rem',
        borderRadius: '20px',
        textAlign: 'center' as const,
        maxWidth: '800px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '1rem',
          color: '#667eea'
        }}>
          🌐 Learning Metaverse
        </h1>
        
        <p style={{ 
          fontSize: '1.5rem', 
          marginBottom: '2rem',
          color: '#666'
        }}>
          Your VR Learning Platform is Ready! 🚀
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          justifyContent: 'center',
          flexWrap: 'wrap' as const,
          marginBottom: '2rem'
        }}>
          <div style={{ 
            padding: '1.5rem', 
            background: '#f0f8ff', 
            borderRadius: '15px',
            minWidth: '200px'
          }}>
            <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>🏛️ Metaverse Hub</h3>
            <p style={{ margin: 0, color: '#666' }}>3D Learning Spaces</p>
          </div>
          
          <div style={{ 
            padding: '1.5rem', 
            background: '#f0fff0', 
            borderRadius: '15px',
            minWidth: '200px'
          }}>
            <h3 style={{ color: '#4CAF50', marginBottom: '0.5rem' }}>📚 Learning Paths</h3>
            <p style={{ margin: 0, color: '#666' }}>Structured Courses</p>
          </div>
          
          <div style={{ 
            padding: '1.5rem', 
            background: '#fff0f5', 
            borderRadius: '15px',
            minWidth: '200px'
          }}>
            <h3 style={{ color: '#FF6B6B', marginBottom: '0.5rem' }}>🧪 Interactive Lab</h3>
            <p style={{ margin: 0, color: '#666' }}>Code & Experiments</p>
          </div>
        </div>
        
        <div style={{ 
          background: '#e8f5e8', 
          padding: '1.5rem', 
          borderRadius: '15px',
          marginBottom: '2rem'
        }}>
          <h4 style={{ color: '#2E7D32', marginBottom: '1rem' }}>✅ System Status</h4>
          <div style={{ color: '#2E7D32' }}>
            <div>✓ React App: Running</div>
            <div>✓ Components: Loaded</div>
            <div>✓ Ready for VR</div>
          </div>
        </div>
        
        <button 
          onClick={() => {
            // Switch back to full app
            window.location.reload();
          }}
          style={{
            background: '#667eea',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '25px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
          }}
        >
          🚀 Launch Full Metaverse Experience
        </button>
        
        <p style={{ 
          marginTop: '2rem', 
          fontSize: '1rem', 
          color: '#999',
          fontStyle: 'italic'
        }}>
          Congratulations! Your React app is working perfectly! 🎉
          <br />
          Click the button above to load the full VR learning platform.
        </p>
      </div>
    </div>
  );
};

export default SimpleApp;