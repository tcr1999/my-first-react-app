const HelloWorld = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [location, setLocation] = React.useState(null);
  const [locationError, setLocationError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getLocation = () => {
    setIsLoading(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setIsLoading(false);
      },
      (error) => {
        setLocationError("Unable to retrieve your location");
        setIsLoading(false);
        console.error("Geolocation error:", error);
      }
    );
  };

  // Tamarashvili style vs Unix style
  const theme = {
    // Background colors
    backgroundColor: isDarkMode ? '#000000' : '#f8f9fa',
    cardBackground: isDarkMode ? '#121212' : '#ffffff',
    
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
      transition: 'all 0.3s ease',
      padding: '20px'
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
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        {isDarkMode ? 'HELLO_WORLD' : 'Hello World'}
      </h1>
      
      <p style={{
        fontSize: '18px',
        opacity: 0.7,
        maxWidth: '600px',
        textAlign: 'center',
        padding: '0 20px',
        marginBottom: '30px'
      }}>
        {isDarkMode ? 
          'TOGGLE_THE_SWITCH_TO_CHANGE_THEMES' : 
          'Toggle the switch in the corner to change themes'}
      </p>
      
      {/* Location Button */}
      <button 
        onClick={getLocation} 
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: isDarkMode ? '#121212' : '#6366f1',
          color: isDarkMode ? '#33ff00' : '#ffffff',
          border: isDarkMode ? '1px solid #33ff00' : 'none',
          borderRadius: isDarkMode ? '0' : '8px',
          cursor: 'pointer',
          fontFamily: theme.fontFamily,
          boxShadow: isDarkMode ? '0 0 5px #33ff00' : '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}
      >
        {isLoading ? 
          (isDarkMode ? 'LOADING...' : 'Loading...') : 
          (isDarkMode ? 'GET_LOCATION' : 'Get My Location')}
      </button>
      
      {/* Location Display */}
      {location && (
        <div style={{
          backgroundColor: theme.cardBackground,
          padding: '20px',
          borderRadius: isDarkMode ? '0' : '12px',
          border: isDarkMode ? '1px solid #33ff00' : 'none',
          boxShadow: theme.boxShadow,
          maxWidth: '300px',
          width: '100%',
          textAlign: 'center'
        }}>
          <p style={{marginBottom: '10px', fontWeight: isDarkMode ? '400' : '600'}}>
            {isDarkMode ? 'YOUR_COORDINATES:' : 'Your Coordinates'}
          </p>
          <p style={{marginBottom: '5px'}}>
            <span style={{opacity: 0.7}}>
              {isDarkMode ? 'LAT: ' : 'Latitude: '}
            </span>
            {location.latitude.toFixed(6)}
          </p>
          <p>
            <span style={{opacity: 0.7}}>
              {isDarkMode ? 'LONG: ' : 'Longitude: '}
            </span>
            {location.longitude.toFixed(6)}
          </p>
        </div>
      )}
      
      {/* Error Message */}
      {locationError && (
        <div style={{
          color: isDarkMode ? '#ff6b6b' : '#d32f2f',
          marginTop: '10px',
          textAlign: 'center'
        }}>
          {isDarkMode ? locationError.toUpperCase() : locationError}
        </div>
      )}
    </div>
  );
};

const App = () => {
  return <HelloWorld />;
};

ReactDOM.render(<App />, document.getElementById('root'));
