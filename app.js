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

  // Theme with consistent font family across dark and light modes
  const theme = {
    // Background colors
    backgroundColor: isDarkMode ? '#111827' : '#f8f9fa',
    cardBackground: isDarkMode ? '#1F2937' : '#ffffff',
    
    // Text colors
    textColor: isDarkMode ? '#F9FAFB' : '#333333',
    secondaryText: isDarkMode ? '#9CA3AF' : '#6e6e73',
    
    // Accent colors
    accentColor: isDarkMode ? '#8B5CF6' : '#6366f1',
    
    // Typography - same font for both modes
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    
    // Effects
    boxShadow: isDarkMode ? 
      '0 4px 12px rgba(0, 0, 0, 0.5)' : 
      '0 10px 30px rgba(0, 0, 0, 0.1)',
      
    // Border - consistent border radius for card
    cardBorderRadius: isDarkMode ? '6px' : '16px',
    
    // Button styles - consistent across modes
    buttonBorderRadius: '8px'
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
        width: '48px',
        height: '24px',
        backgroundColor: isDarkMode ? '#374151' : '#e0e0e0',
        borderRadius: '12px',
        padding: '2px',
        position: 'absolute',
        top: '20px',
        right: '20px',
        cursor: 'pointer',
        transition: 'background-color 0.3s'
      }}>
        <div style={{
          width: '20px',
          height: '20px',
          backgroundColor: isDarkMode ? theme.accentColor : '#ffffff',
          borderRadius: '50%',
          position: 'absolute',
          left: isDarkMode ? '26px' : '2px',
          transition: 'all 0.3s ease',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '12px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
        }}>
          {isDarkMode ? '🌙' : '☀️'}
        </div>
      </div>
      
      {/* Hello World Text */}
      <h1 style={{ 
        fontSize: '48px', 
        fontWeight: '600',
        letterSpacing: 'normal',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        Hello World
      </h1>
      
      <p style={{
        fontSize: '16px',
        color: theme.secondaryText,
        maxWidth: '600px',
        textAlign: 'center',
        padding: '0 20px',
        marginBottom: '30px',
        lineHeight: '1.5'
      }}>
        Toggle the switch in the corner to change themes
      </p>
      
      {/* Location Button - now with consistent border radius */}
      <button 
        onClick={getLocation} 
        disabled={isLoading}
        style={{
          padding: '8px 16px',
          fontSize: '14px',
          backgroundColor: theme.accentColor,
          color: '#ffffff',
          border: 'none',
          borderRadius: theme.buttonBorderRadius,
          cursor: 'pointer',
          fontFamily: theme.fontFamily,
          fontWeight: '500',
          boxShadow: isDarkMode ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px',
          transition: 'all 0.2s ease'
        }}
      >
        {isLoading ? 'Loading...' : 'Get My Location'}
      </button>
      
      {/* Location Display */}
      {location && (
        <div style={{
          backgroundColor: theme.cardBackground,
          padding: '16px 20px',
          borderRadius: theme.cardBorderRadius,
          boxShadow: theme.boxShadow,
          maxWidth: '300px',
          width: '100%',
          border: isDarkMode ? '1px solid #374151' : 'none'
        }}>
          <p style={{
            marginBottom: '12px', 
            fontWeight: '500',
            fontSize: '14px',
            color: theme.secondaryText
          }}>
            Your Coordinates
          </p>
          <p style={{
            marginBottom: '8px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span style={{color: theme.secondaryText}}>
              Latitude
            </span>
            <span style={{fontWeight: '500'}}>
              {location.latitude.toFixed(6)}
            </span>
          </p>
          <p style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span style={{color: theme.secondaryText}}>
              Longitude
            </span>
            <span style={{fontWeight: '500'}}>
              {location.longitude.toFixed(6)}
            </span>
          </p>
        </div>
      )}
      
      {/* Error Message */}
      {locationError && (
        <div style={{
          color: isDarkMode ? '#F87171' : '#d32f2f',
          marginTop: '10px',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          {locationError}
        </div>
      )}
    </div>
  );
};

const App = () => {
  return <HelloWorld />;
};

ReactDOM.render(<App />, document.getElementById('root'));
