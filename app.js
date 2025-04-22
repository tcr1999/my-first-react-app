const HelloWorld = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Tamarashvili style vs Unix style
  const theme = {
    // Background colors
    backgroundColor: isDarkMode ? '#000000' : '#f8f9fa',
    
    // Text colors
    textColor: isDarkMode ? '#33ff00' : '#333333',
    
    // Typography
    fontFamily: isDarkMode ? 
      'Courier New, monospace' : 
      'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
    
    // Effects
    boxShadow: isDarkMode ? 
      '0 0 5px #33ff00' : 
      '0 10px 30px rgba(0,0,0,0.1)'
  };

  return (
    <div style={{
      backgroundColor: theme.backgroundColor,
      color: theme.textColor,
      minHeight: '100vh',
      fontFamily: theme.fontFamily,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'all 0.3s ease'
    }}>
      {/* Dark Mode Toggle */}
      <div onClick={toggleDarkMode} style={{
        width: '60px',
        height: '30px',
        backgroundColor: isDarkMode ? '#121212' : '#e0e0e0',
        border: isDarkMode ? '1px solid #33ff00' : 'none',
        borderRadius: '15px',
        padding: '3px',
        position: 'absolute',
        top: '20px',
        right: '20px',
        cursor: 'pointer',
        transition: 'background-color 0.3s'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          backgroundColor: isDarkMode ? '#33ff00' : '#ffffff',
          borderRadius: '50%',
          position: 'absolute',
          left: isDarkMode ? '33px' : '3px',
          transition: 'left 0.3s',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '14px',
          boxShadow: isDarkMode ? '0 0 5px #33ff00' : '0 2px 5px rgba(0,0,0,0.2)'
        }}>
          {isDarkMode ? '>' : '☀️'}
        </div>
      </div>
      
      {/* Hello World Text */}
      <h1 style={{ 
        fontSize: '48px', 
        fontWeight: isDarkMode ? '400' : '600',
        letterSpacing: isDarkMode ? '1px' : 'normal',
        textShadow: isDarkMode ? '0 0 10px #33ff00' : 'none',
        marginBottom: '20px'
      }}>
        {isDarkMode ? 'HELLO_WORLD' : 'Hello World'}
      </h1>
      
      <p style={{
        fontSize: '18px',
        opacity: 0.7,
        maxWidth: '600px',
        textAlign: 'center',
        padding: '0 20px'
      }}>
        {isDarkMode ? 
          'TOGGLE_THE_SWITCH_TO_CHANGE_THEMES' : 
          'Toggle the switch in the corner to change themes'}
      </p>
    </div>
  );
};

const App = () => {
  return <HelloWorld />;
};

ReactDOM.render(<App />, document.getElementById('root'));
