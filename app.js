const HelloWorld = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [location, setLocation] = React.useState(null);
  const [locationError, setLocationError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [weatherData, setWeatherData] = React.useState(null);
  const [hourlyForecastData, setHourlyForecastData] = React.useState(null);
  const [dailyForecastData, setDailyForecastData] = React.useState(null); // New state for 7-day daily forecast
  const [weatherError, setWeatherError] = React.useState(null);
  const [weatherLoading, setWeatherLoading] = React.useState(false);
  const [selectedHourlyItem, setSelectedHourlyItem] = React.useState(null); // Re-added state to track selected hourly item
  
  // Effect to update page title when component mounts
  React.useEffect(() => {
    document.title = "Forecastly";
  }, []);

  // Initialize selectedHourlyItem when hourlyForecastData is available and component mounts/updates
  React.useEffect(() => {
    if (hourlyForecastData && hourlyForecastData.length > 0 && !selectedHourlyItem) {
      setSelectedHourlyItem(hourlyForecastData[0]);
    }
  }, [hourlyForecastData, selectedHourlyItem]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleHourlyItemClick = (item) => {
    setSelectedHourlyItem(item);
  };

  const getLocation = () => {
    setIsLoading(true);
    setLocationError(null);
    setWeatherData(null);
    setWeatherError(null);
    
    if (!navigator.geolocation) {
      // Fallback to IP-based geolocation if browser geolocation is not supported
      fetchIpLocation();
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
        console.error("Geolocation error:", error);
        // Fallback to IP-based geolocation if permission is denied or an error occurs
        fetchIpLocation();
      }
    );
  };

  const fetchIpLocation = async () => {
    setLocationError(null); // Clear previous errors
    try {
      const response = await fetch('http://ip-api.com/json/');
      if (!response.ok) {
        throw new Error(`IP geolocation failed with status ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
        const locationData = {
          latitude: data.lat,
          longitude: data.lon
        };
        setLocation(locationData);
        setIsLoading(false);
        fetchWeatherData(locationData.latitude, locationData.longitude);
      } else {
        throw new Error(`IP geolocation failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('IP Geolocation fallback error:', error);
      setLocationError("Unable to retrieve your location. Please ensure location services are enabled or try again.");
      setIsLoading(false);
    }
  };

  const fetchWeatherData = async (latitude, longitude) => {
    setWeatherLoading(true);
    setWeatherError(null);
    
    const apiKey = 'jbinO4s4hSgUKzKkBvdVhgorbCzVEijP'; // Your Tomorrow.io API key
    const url = `https://api.tomorrow.io/v4/weather/realtime?location=${latitude},${longitude}&units=metric&apikey=${apiKey}`;
    const hourlyForecastUrl = `https://api.tomorrow.io/v4/weather/forecast?location=${latitude},${longitude}&timesteps=1h&units=metric&apikey=${apiKey}`;
    const dailyForecastUrl = `https://api.tomorrow.io/v4/weather/forecast?location=${latitude},${longitude}&timesteps=1d&units=metric&apikey=${apiKey}`;
    
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
        const errorBody = await response.json(); // Attempt to read error body
        console.error('Realtime API Error:', response.status, errorBody);
        throw new Error(`API request failed with status ${response.status}: ${errorBody.message || JSON.stringify(errorBody)}`);
      }
      
      const data = await response.json();
      console.log('Weather Data:', data);
      
      // Fetch forecast data
      const forecastResponse = await fetch(hourlyForecastUrl, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'accept-encoding': 'deflate, gzip, br',
        },
      });
      
      if (!forecastResponse.ok) {
        const errorBody = await forecastResponse.json(); // Attempt to read error body
        console.error('Hourly Forecast API Error:', forecastResponse.status, errorBody);
        throw new Error(`Forecast API request failed with status ${forecastResponse.status}: ${errorBody.message || JSON.stringify(errorBody)}`);
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
        values: { // Changed to values to match new structure
          temperatureApparent: data.data.values.temperatureApparent,
          temperature: data.data.values.temperature,
          humidity: data.data.values.humidity,
          weatherCode: data.data.values.weatherCode,
          windSpeed: data.data.values.windSpeed,
          // Additional data for expanded view
          precipitationProbability: data.data.values.precipitationProbability || 0,
          visibility: data.data.values.visibility || 0,
          pressureSurfaceLevel: data.data.values.pressureSurfaceLevel || 0,
          uvIndex: data.data.values.uvIndex || 0
        }
      });
      
      // Process the forecast data
      if (forecastData.timelines && forecastData.timelines.hourly) {
        setHourlyForecastData(forecastData.timelines.hourly.slice(0, 24)); // Get 24 hours
      }
      
      // Process the daily forecast data
      const dailyForecastResponse = await fetch(dailyForecastUrl, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'accept-encoding': 'deflate, gzip, br',
        },
      });

      if (!dailyForecastResponse.ok) {
        const errorBody = await dailyForecastResponse.json(); // Attempt to read error body
        console.error('Daily Forecast API Error:', dailyForecastResponse.status, errorBody);
        throw new Error(`Daily Forecast API request failed with status ${dailyForecastResponse.status}: ${errorBody.message || JSON.stringify(errorBody)}`);
      }

      const dailyData = await dailyForecastResponse.json();
      console.log('Daily Forecast Data:', dailyData);

      if (dailyData.timelines && dailyData.timelines.daily) {
        setDailyForecastData(dailyData.timelines.daily.slice(0, 7)); // Get 7 days
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

  // Get the source for the main dynamic weather logo
  const getMainWeatherLogoSrc = (weatherCode) => {
    switch (weatherCode) {
      case 1000: // Clear, Sunny
        return './images/sunlogo.png';
      case 4000: // Rain
      case 4001: // Rain Showers
      case 4200: // Rain, Thunderstorm
      case 6000: // Freezing Rain
      case 6200: // Freezing Rain
        return './images/rainlogo.png';
      case 5000: // Snow
      case 5001: // Flurries
      case 5100: // Snow Showers
      case 7000: // Ice Pellets
      case 7101: // Heavy Ice Pellets
        return './images/snowlogo.png';
      default:
        return './images/logo.png'; // Default main logo
    }
  };

    // Get day name from date string
    const getDayName = (dateString) => {
      const date = new Date(dateString);
      const options = { weekday: 'short' };
      return date.toLocaleDateString(undefined, options);
    };

    // Format date for display (e.g., "Apr 23")
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { month: 'short', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    };

    // Get hour from date string (e.g., "1 PM")
    const formatToHour = (dateString) => {
      const date = new Date(dateString);
      const options = { hour: 'numeric', hour12: true };
      return date.toLocaleTimeString([], options);
    };

    // Removed: handleCardClick and handleBackClick functions

  // Return to main view
  // Removed: handleBackClick function

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
  // Removed: if (showDetails) block

  return (
    <div style={{
      backgroundColor: theme.backgroundColor,
      color: theme.textColor,
      minHeight: '100vh',
      fontFamily: theme.fontFamily,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start', // Align content to the start (top)
      alignItems: 'center',
      transition: 'all 0.3s ease',
      padding: '20px',
      boxSizing: 'border-box',
    }}>
      {/* Dark Mode Toggle - always present */}
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
        maxWidth: '800px',
        marginTop: '60px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        paddingBottom: '20px',
      }}>
        {/* Logo */}
        {weatherData && (
          <img
            src={getMainWeatherLogoSrc(weatherData.values.weatherCode)}
            alt="Weather Logo"
            style={{
              width: '250px',
              height: 'auto',
              marginBottom: '20px',
              alignSelf: 'center',
            }}
          />
        )}

        {/* App Title Text */}
        <h1 style={{
          fontSize: '48px',
          fontWeight: '600',
          letterSpacing: 'normal',
          marginBottom: '20px',
          textAlign: 'center',
          color: theme.textColor,
        }}>
          Forecastly
        </h1>

        {/* Location Button */}
        <button
          onClick={getLocation}
          disabled={isLoading || weatherLoading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: theme.accentColor,
            color: '#ffffff',
            border: 'none',
            borderRadius: theme.buttonBorderRadius,
            cursor: 'pointer',
            fontFamily: theme.fontFamily,
            fontWeight: '500',
            boxShadow: isDarkMode ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px',
            transition: 'all 0.2s ease',
            alignSelf: 'center',
          }}
        >
          {isLoading || weatherLoading ? 'Loading...' : 'Get Weather Information'}
        </button>

        {/* Current Weather Card */}
        {weatherData && (
          <div
            style={{
              backgroundColor: theme.cardBackground,
              padding: '20px',
              borderRadius: theme.cardBorderRadius,
              boxShadow: theme.boxShadow,
              width: '100%',
              border: isDarkMode ? '1px solid #374151' : 'none',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
              paddingBottom: '12px',
            }}
            >
              <div>
                <p style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '4px',
                }}>
                  {weatherData.locationName}
                </p>
                <p style={{
                  fontSize: '13px',
                  color: theme.secondaryText,
                }}>
                  Current Weather
                </p>
              </div>
              <span style={{ fontSize: '28px' }}>
                {getWeatherIcon(selectedHourlyItem ? selectedHourlyItem.values.weatherCode : weatherData.values.weatherCode)}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            >
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                }}>
                  <span style={{
                    fontSize: '36px',
                    fontWeight: '600',
                    marginRight: '8px',
                  }}>
                    {Math.round(selectedHourlyItem ? selectedHourlyItem.values.temperature : weatherData.values.temperature)}°C
                  </span>
                </div>
                <p style={{
                  color: theme.secondaryText,
                  marginTop: '4px',
                }}>
                  Feels like {Math.round(selectedHourlyItem ? selectedHourlyItem.values.temperatureApparent : weatherData.values.temperatureApparent)}°C
                </p>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span style={{ color: theme.secondaryText }}>Humidity:</span>
                  <span style={{ fontWeight: '500' }}>{Math.round(selectedHourlyItem ? selectedHourlyItem.values.humidity : weatherData.values.humidity)}%</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span style={{ color: theme.secondaryText }}>Wind:</span>
                  <span style={{ fontWeight: '500' }}>{Math.round(selectedHourlyItem ? selectedHourlyItem.values.windSpeed : weatherData.values.windSpeed)} m/s</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span style={{ color: theme.secondaryText }}>UV Index:</span>
                  <span style={{ fontWeight: '500' }}>{selectedHourlyItem ? selectedHourlyItem.values.uvIndex : weatherData.values.uvIndex}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 24-Hour Hourly Forecast */}
        {weatherData && hourlyForecastData && hourlyForecastData.length > 0 ? (
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
              paddingBottom: '8px',
            }}>
              24-Hour Forecast
            </h2>

            <div style={{
              display: 'flex',
              flexDirection: 'row',
              overflowX: 'auto',
              gap: '12px',
              paddingBottom: '10px',
              MsOverflowStyle: 'none',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
              '&::-webkit-scrollbar': { display: 'none' },
            }}>
              {hourlyForecastData.map((hour, index) => {
                const values = hour.values;
                return (
                  <div
                    key={index}
                    onClick={() => handleHourlyItemClick(hour)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '10px',
                      minWidth: '90px',
                      backgroundColor: selectedHourlyItem === hour ? theme.accentColor : (isDarkMode ? '#2D3748' : '#edf2f7'),
                      color: selectedHourlyItem === hour ? '#ffffff' : theme.textColor,
                      borderRadius: theme.cardBorderRadius,
                      boxShadow: selectedHourlyItem === hour ? '0 4px 12px rgba(0,0,0,0.4)' : (isDarkMode ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.08)'),
                      flexShrink: 0,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <p style={{
                      fontWeight: '600',
                      fontSize: '14px',
                      marginBottom: '4px',
                    }}>
                      {formatToHour(hour.time)}
                    </p>

                    <div style={{
                      fontSize: '22px',
                      marginBottom: '8px',
                    }}>
                      {getWeatherIcon(values.weatherCode)}
                    </div>

                    <p style={{
                      fontWeight: '600',
                      fontSize: '15px',
                      marginBottom: '4px',
                    }}>
                      {Math.round(values.temperature)}°C
                    </p>

                    <p style={{
                      color: theme.secondaryText,
                      fontSize: '12px',
                    }}>
                      {values.precipitationProbability ? `${Math.round(values.precipitationProbability)}%` : '0%'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (weatherData && (isLoading || weatherLoading ? null : (
          <div style={{
            backgroundColor: theme.cardBackground,
            padding: '20px',
            borderRadius: theme.cardBorderRadius,
            boxShadow: theme.boxShadow,
            width: '100%',
            textAlign: 'center',
            border: isDarkMode ? '1px solid #374151' : 'none',
          }}>
            <p>Hourly forecast data not available</p>
          </div>
        )))}

        {/* 7-Day Daily Forecast */}
        {weatherData && dailyForecastData && dailyForecastData.length > 0 ? (
          <div style={{
            backgroundColor: theme.cardBackground,
            padding: '20px',
            borderRadius: theme.cardBorderRadius,
            boxShadow: theme.boxShadow,
            width: '100%',
            border: isDarkMode ? '1px solid #374151' : 'none',
            marginTop: '24px',
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
              paddingBottom: '8px',
            }}>
              7-Day Forecast
            </h2>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              {dailyForecastData.map((day, index) => {
                const values = day.values;
                const previousDayTemp = index > 0 ? dailyForecastData[index - 1].values.temperatureAvg : null;
                const currentDayTemp = values.temperatureAvg;
                const tempDifference = previousDayTemp !== null ? currentDayTemp - previousDayTemp : 0;
                const showTempChange = Math.abs(tempDifference) >= 5;
                const tempChangeIndicator = tempDifference > 0 ? '⬆️' : '⬇️';
                const tempChangeColor = tempDifference > 0 ? '#4CAF50' : '#F44336';

                return (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: index < dailyForecastData.length - 1 ? 
                      (isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb') : 'none',
                  }}>
                    <div style={{ minWidth: '120px' }}>
                      <p style={{ fontWeight: '600', fontSize: '16px' }}>
                        {getDayName(day.time)}
                      </p>
                      <p style={{ color: theme.secondaryText, fontSize: '14px' }}>
                        {formatDate(day.time)}
                      </p>
                    </div>

                    <div style={{ fontSize: '24px', flexGrow: 0, flexShrink: 0, marginRight: '8px' }}>
                      {getWeatherIcon(values.weatherCodeMax || values.weatherCode)}
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: '600', fontSize: '16px' }}>
                        {Math.round(values.temperatureMax)}° / {Math.round(values.temperatureMin)}°
                      </p>
                      {showTempChange && (
                        <p style={{ color: tempChangeColor, fontSize: '12px', fontWeight: '500' }}>
                          {tempChangeIndicator} {Math.abs(Math.round(tempDifference))}° change
                        </p>
                      )}
                      <p style={{ color: theme.secondaryText, fontSize: '14px' }}>
                        {values.precipitationProbabilityAvg ? `${Math.round(values.precipitationProbabilityAvg)}% precip.` : '0% precip.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (weatherData && (isLoading || weatherLoading ? null : (
          <div style={{
            backgroundColor: theme.cardBackground,
            padding: '20px',
            borderRadius: theme.cardBorderRadius,
            boxShadow: theme.boxShadow,
            width: '100%',
            textAlign: 'center',
            border: isDarkMode ? '1px solid #374151' : 'none',
            marginTop: '24px',
          }}>
            <p>Daily forecast data not available</p>
          </div>
        )))}

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
            textAlign: 'center',
            alignSelf: 'center',
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
            fontSize: '14px',
          }}>
            {locationError}
          </div>
        )}

        {weatherError && (
          <div style={{
            color: isDarkMode ? '#F87171' : '#d32f2f',
            marginTop: '10px',
            textAlign: 'center',
            fontSize: '14px',
          }}>
            {weatherError}
          </div>
        )}
      </div>
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
