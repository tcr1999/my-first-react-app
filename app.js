const HelloWorld = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [location, setLocation] = React.useState(null);
  const [locationError, setLocationError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [weatherData, setWeatherData] = React.useState(null);
  const [hourlyForecastData, setHourlyForecastData] = React.useState(null);
  const [weatherError, setWeatherError] = React.useState(null);
  const [weatherLoading, setWeatherLoading] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getLocation = () => {
    setIsLoading(true);
    setLocationError(null);
    setWeatherData(null);
    setWeatherError(null);
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setLocation(locationData);
        setIsLoading(false);
        
        // Fetch weather data once we have location
        fetchWeatherData(locationData.latitude, locationData.longitude);
      },
      (error) => {
        setLocationError("Unable to retrieve your location");
        setIsLoading(false);
        console.error("Geolocation error:", error);
      }
    );
  };

  const fetchWeatherData = async (latitude, longitude) => {
    setWeatherLoading(true);
    setWeatherError(null);
    
    const apiKey = 'jbinO4s4hSgUKzKkBvdVhgorbCzVEijP'; // Your Tomorrow.io API key
    const url = `https://api.tomorrow.io/v4/weather/realtime?location=${latitude},${longitude}&units=metric&apikey=${apiKey}`;
    const forecastUrl = `https://api.tomorrow.io/v4/weather/forecast?location=${latitude},${longitude}&timesteps=1h&units=metric&apikey=${apiKey}`;
    
    try {
      // Fetch current weather
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'accept-encoding': 'deflate, gzip, br',
        },
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Weather Data:', data);
      
      // Fetch forecast data
      const forecastResponse = await fetch(forecastUrl, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'accept-encoding': 'deflate, gzip, br',
        },
      });
      
      if (!forecastResponse.ok) {
        throw new Error(`Forecast API request failed with status ${forecastResponse.status}`);
      }
      
      const forecastData = await forecastResponse.json();
      console.log('Forecast Data:', forecastData);
      
      // Extract location components from the API response
      let locationName = "Unknown Location"; // Default fallback
      
      if (data.location && data.location.name) {
        locationName = data.location.name;
      } else {
        // If no location name is provided, we can try to determine it
        // from the coordinates (this is a fallback)
        try {
          const geocodeUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
          const geocodeResponse = await fetch(geocodeUrl);
          const geocodeData = await geocodeResponse.json();
          
          if (geocodeData.city) {
            locationName = geocodeData.city;
            if (geocodeData.locality && geocodeData.locality !== geocodeData.city) {
              locationName = `${geocodeData.locality}, ${geocodeData.city}`;
            }
          } else if (geocodeData.locality) {
            locationName = geocodeData.locality;
          }
        } catch (geocodeError) {
          console.error('Error with geocoding fallback:', geocodeError);
        }
      }
      
      setWeatherData({
        locationName: locationName,
        tempApparent: data.data.values.temperatureApparent,
        temperature: data.data.values.temperature,
        humidity: data.data.values.humidity,
        weatherCode: data.data.values.weatherCode,
        windSpeed: data.data.values.windSpeed,
        // Additional data for expanded view
        precipitation: data.data.values.precipitationProbability || 0,
        visibility: data.data.values.visibility || 0,
        pressureSurfaceLevel: data.data.values.pressureSurfaceLevel || 0,
        uvIndex: data.data.values.uvIndex || 0
      });
      
      // Process the forecast data
      if (forecastData.timelines && forecastData.timelines.hourly) {
        setHourlyForecastData(forecastData.timelines.hourly.slice(0, 24)); // Get 24 hours
      }
      
      setWeatherLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherError('Failed to fetch weather data');
      setWeatherLoading(false);
    }
  };

  // Get weather icon based on weather code
  const getWeatherIcon = (weatherCode) => {
    // Basic mapping of weather codes to emojis
    // You can expand this to include more codes as needed
    const weatherIcons = {
      1000: '☀️', // Clear, Sunny
      1100: '🌤️', // Mostly Clear
      1101: '⛅', // Partly Cloudy
      1102: '🌥️', // Mostly Cloudy
      1001: '☁️', // Cloudy
      2000: '🌫️', // Fog
      4000: '🌧️', // Rain
      4001: '🌧️', // Rain Showers
      4200: '⛈️', // Rain, Thunderstorm
      5000: '❄️', // Snow
      5001: '🌨️', // Flurries
      5100: '🌨️', // Snow Showers
      6000: '🌧️', // Freezing Rain
      6200: '🌨️', // Freezing Rain
      7000: '🌨️', // Ice Pellets
      7101: '🌨️', // Heavy Ice Pellets
      8000: '⛈️', // Thunderstorm
    };
    
    return weatherIcons[weatherCode] || '❓'; // Default icon if code not found
  };

    // Get hour from date string (e.g., "1 PM")
    const formatToHour = (dateString) => {
      const date = new Date(dateString);
      const options = { hour: 'numeric', hour12: true };
      return date.toLocaleTimeString([], options);
    };

    // Handle card click to show more details
    const handleCardClick = () => {
      if (weatherData) {
        setShowDetails(true);
      }
    };

  // Return to main view
  const handleBackClick = () => {
    setShowDetails(false);
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
      
    // Border - consistent border radius for card (same for both modes)
    cardBorderRadius: '16px',
    
    // Button styles - consistent across modes
    buttonBorderRadius: '8px'
  };

  // If showing details page with forecast
  if (showDetails) {
    return (
      <div style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        minHeight: '100vh',
        fontFamily: theme.fontFamily,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'all 0.3s ease',
        padding: '20px',
        overflowX: 'hidden'
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
        
        <div style={{
          width: '100%',
          maxWidth: '600px',
          marginTop: '60px'
        }}>
          {/* Header Section */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '600'
            }}>
              24-Hour Forecast
            </h1>
            
            <button 
              onClick={handleBackClick}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                backgroundColor: theme.accentColor,
                color: '#ffffff',
                border: 'none',
                borderRadius: theme.buttonBorderRadius,
                cursor: 'pointer',
                fontWeight: '500',
                boxShadow: isDarkMode ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease'
              }}
            >
              Back
            </button>
          </div>
          
          {/* Current Weather Card */}
          {weatherData && (
            <div style={{
              backgroundColor: theme.cardBackground,
              padding: '20px',
              borderRadius: theme.cardBorderRadius,
              boxShadow: theme.boxShadow,
              width: '100%',
              marginBottom: '24px',
              border: isDarkMode ? '1px solid #374151' : 'none',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                paddingBottom: '12px'
              }}>
                <div>
                  <p style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>
                    {weatherData.locationName}
                  </p>
                  <p style={{
                    fontSize: '13px',
                    color: theme.secondaryText
                  }}>
                    Today's Weather
                  </p>
                </div>
                <span style={{fontSize: '28px'}}>
                  {getWeatherIcon(weatherData.weatherCode)}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline'
                  }}>
                    <span style={{
                      fontSize: '36px',
                      fontWeight: '600',
                      marginRight: '8px'
                    }}>
                      {Math.round(weatherData.temperature)}°C
                    </span>
                  </div>
                  <p style={{
                    color: theme.secondaryText,
                    marginTop: '4px'
                  }}>
                    Feels like {Math.round(weatherData.tempApparent)}°C
                  </p>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{color: theme.secondaryText}}>Humidity:</span>
                    <span style={{fontWeight: '500'}}>{Math.round(weatherData.humidity)}%</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{color: theme.secondaryText}}>Wind:</span>
                    <span style={{fontWeight: '500'}}>{Math.round(weatherData.windSpeed)} m/s</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{color: theme.secondaryText}}>UV Index:</span>
                    <span style={{fontWeight: '500'}}>{weatherData.uvIndex}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 5-Day Forecast */}
          {hourlyForecastData && hourlyForecastData.length > 0 ? (
            <div style={{
              backgroundColor: theme.cardBackground,
              padding: '20px',
              borderRadius: theme.cardBorderRadius,
              boxShadow: theme.boxShadow,
              width: '100%',
              border: isDarkMode ? '1px solid #374151' : 'none',
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                paddingBottom: '8px'
              }}>
                5-Day Forecast
              </h2>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {hourlyForecastData.map((day, index) => {
                  const values = day.values;
                  return (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: index < hourlyForecastData.length - 1 ? 
                        (isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb') : 'none'
                    }}>
                      {/* Day and Date */}
                      <div style={{
                        minWidth: '100px'
                      }}>
                        <p style={{
                          fontWeight: '600',
                          fontSize: '16px'
                        }}>
                          {formatToHour(day.time)}
                        </p>
                        <p style={{
                          color: theme.secondaryText,
                          fontSize: '14px'
                        }}>
                          {/* You can add more hourly details here if needed, or remove this line */}
                        </p>
                      </div>
                      
                      {/* Weather Icon */}
                      <div style={{
                        fontSize: '24px',
                        flexGrow: 0,
                        flexShrink: 0,
                        marginRight: '8px'
                      }}>
                        {getWeatherIcon(values.weatherCodeMax || values.weatherCode)}
                      </div>
                      
                      {/* Temperature and Details */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        justifyContent: 'space-between',
                        flex: 1
                      }}>
                        {/* Temperature Range */}
                        <div style={{
                          textAlign: 'right'
                        }}>
                          <p style={{
                            fontWeight: '600',
                            fontSize: '16px'
                          }}>
                            {Math.round(values.temperature)}°C
                          </p>
                          <p style={{
                            color: theme.secondaryText,
                            fontSize: '14px'
                          }}>
                            {values.precipitationProbability ? `${Math.round(values.precipitationProbability)}% precip.` : 'No precipitation'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: theme.cardBackground,
              padding: '20px',
              borderRadius: theme.cardBorderRadius,
              boxShadow: theme.boxShadow,
              width: '100%',
              textAlign: 'center',
              border: isDarkMode ? '1px solid #374151' : 'none',
            }}>
              <p>Forecast data not available</p>
            </div>
          )}
        </div>
      </div>
    );
  }

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
      {/* Logo */}
      <img src="./images/logo.png" alt="Logo" style={{ width: '250px', height: 'auto', marginBottom: '20px' }} />
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
      
      {/* App Title Text */}
      <h1 style={{ 
        fontSize: '48px', 
        fontWeight: '600',
        letterSpacing: 'normal',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        Forecastly
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
      
      {/* Location Button */}
      <button 
        onClick={getLocation} 
        disabled={isLoading || weatherLoading}
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
        {isLoading || weatherLoading ? 'Loading...' : 'Get Weather Information'}
      </button>
      
      {/* Weather and Location Display */}
      {weatherData && (
        <div 
          onClick={handleCardClick}
          style={{
            backgroundColor: theme.cardBackground,
            padding: '20px',
            borderRadius: theme.cardBorderRadius,
            boxShadow: theme.boxShadow,
            maxWidth: '320px',
            width: '100%',
            border: isDarkMode ? '1px solid #374151' : 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            ':hover': {
              transform: 'translateY(-2px)',
              boxShadow: isDarkMode ? 
                '0 6px 16px rgba(0, 0, 0, 0.6)' : 
                '0 12px 36px rgba(0, 0, 0, 0.12)'
            }
          }}
        >
          {/* Location Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
            paddingBottom: '12px'
          }}>
            <div>
              <p style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                {weatherData.locationName}
              </p>
              <p style={{
                fontSize: '13px',
                color: theme.secondaryText
              }}>
                Current Weather
              </p>
            </div>
            <span style={{fontSize: '28px'}}>
              {getWeatherIcon(weatherData.weatherCode)}
            </span>
          </div>
          
          {/* Temperature Section */}
          <div style={{
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'baseline'
            }}>
              <span style={{
                fontSize: '36px',
                fontWeight: '600',
                marginRight: '8px'
              }}>
                {Math.round(weatherData.temperature)}°C
              </span>
            </div>
            <p style={{
              color: theme.secondaryText,
              marginTop: '4px'
            }}>
              Feels like {Math.round(weatherData.tempApparent)}°C
            </p>
          </div>
          
          {/* Additional Weather Info */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
            paddingTop: '12px'
          }}>
            <div>
              <p style={{color: theme.secondaryText, fontSize: '12px'}}>
                Humidity
              </p>
              <p style={{fontWeight: '500'}}>
                {Math.round(weatherData.humidity)}%
              </p>
            </div>
            <div>
              <p style={{color: theme.secondaryText, fontSize: '12px'}}>
                Wind Speed
              </p>
              <p style={{fontWeight: '500'}}>
                {Math.round(weatherData.windSpeed)} m/s
              </p>
            </div>
          </div>
          
          {/* Click for more info hint */}
          <div style={{
            textAlign: 'center',
            marginTop: '12px',
            fontSize: '12px',
            color: theme.secondaryText
          }}>
            Click for 5-day forecast
          </div>
        </div>
      )}
      
      {/* Loading State */}
      {(isLoading || weatherLoading) && !weatherData && (
        <div style={{
          backgroundColor: theme.cardBackground,
          padding: '16px 20px',
          borderRadius: theme.cardBorderRadius,
          boxShadow: theme.boxShadow,
          maxWidth: '300px',
          width: '100%',
          border: isDarkMode ? '1px solid #374151' : 'none',
          textAlign: 'center'
        }}>
          <p>Fetching your location and weather data...</p>
        </div>
      )}
      
      {/* Error Messages */}
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
      
      {weatherError && (
        <div style={{
          color: isDarkMode ? '#F87171' : '#d32f2f',
          marginTop: '10px',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          {weatherError}
        </div>
      )}
    </div>
  );
};

const App = () => {
  // Update page title
  React.useEffect(() => {
    document.title = "Forecastly";
  }, []);
  
  return <HelloWorld />;
};

ReactDOM.render(<App />, document.getElementById('root'));
