const BankingApp = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Tamarashvili style vs Unix style
  const theme = {
    // Background colors
    backgroundColor: isDarkMode ? '#000000' : '#f8f9fa',
    cardBackground: isDarkMode ? '#121212' : '#ffffff',
    
    // Text colors
    textColor: isDarkMode ? '#33ff00' : '#333333',
    secondaryText: isDarkMode ? '#1edd00' : '#6e6e73',
    
    // Accent colors
    accentColor: isDarkMode ? '#33ff00' : '#6366f1',
    accentGradient: isDarkMode ? 'none' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    
    // Borders
    borderColor: isDarkMode ? '#33ff00' : '#e6e6e6',
    borderRadius: isDarkMode ? '0px' : '16px',
    
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
      padding: '20px',
      transition: 'all 0.3s ease'
    }}>
      {/* Header with Theme Toggle */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '24px', 
            fontWeight: isDarkMode ? '400' : '600',
            letterSpacing: isDarkMode ? '1px' : 'normal'
          }}>
            {isDarkMode ? 'UNIX_BANKING' : 'Wave Banking'}
          </h1>
        </div>
        
        <div onClick={toggleDarkMode} style={{
          width: '60px',
          height: '30px',
          backgroundColor: isDarkMode ? '#121212' : '#e0e0e0',
          border: isDarkMode ? '1px solid #33ff00' : 'none',
          borderRadius: '15px',
          padding: '3px',
          position: 'relative',
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
      </header>

      {/* Balance Card */}
      <div style={{
        backgroundColor: theme.cardBackground,
        borderRadius: theme.borderRadius,
        padding: '24px',
        marginBottom: '24px',
        background: isDarkMode ? 
          '#121212' : 
          'linear-gradient(135deg, #ffffff 0%, #f0f2ff 100%)',
        boxShadow: theme.boxShadow,
        border: isDarkMode ? '1px solid #33ff00' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <p style={{ 
          color: theme.secondaryText, 
          margin: '0 0 8px 0', 
          fontSize: '14px',
          fontFamily: theme.fontFamily
        }}>
          {isDarkMode ? 'CURRENT_BALANCE:' : 'Current Balance'}
        </p>
        
        <h2 style={{ 
          margin: '0 0 16px 0', 
          fontSize: '32px', 
          fontWeight: isDarkMode ? '400' : '700',
          letterSpacing: isDarkMode ? '1px' : 'normal'
        }}>
          {isDarkMode ? '$8,256.42' : '$8,256.42'}
        </h2>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ 
              color: theme.secondaryText, 
              margin: '0 0 4px 0', 
              fontSize: '13px',
              fontFamily: theme.fontFamily
            }}>
              {isDarkMode ? 'CARD_NUMBER:' : 'Card Number'}
            </p>
            <p style={{ 
              margin: '0', 
              fontSize: '14px',
              fontFamily: theme.fontFamily
            }}>
              •••• •••• •••• 4832
            </p>
          </div>
          <div>
            <p style={{ 
              color: theme.secondaryText, 
              margin: '0 0 4px 0', 
              fontSize: '13px',
              fontFamily: theme.fontFamily
            }}>
              {isDarkMode ? 'EXPIRY:' : 'Expiry'}
            </p>
            <p style={{ 
              margin: '0', 
              fontSize: '14px',
              fontFamily: theme.fontFamily
            }}>
              09/28
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: isDarkMode ? '400' : '600', 
        marginBottom: '16px',
        letterSpacing: isDarkMode ? '1px' : 'normal'
      }}>
        {isDarkMode ? 'RECENT_TRANSACTIONS:' : 'Recent Transactions'}
      </h3>
      
      {[
        { name: 'Coffee Shop', amount: '-$4.50', date: 'Today', icon: isDarkMode ? '>' : '☕' },
        { name: 'Grocery Store', amount: '-$56.32', date: 'Yesterday', icon: isDarkMode ? '>' : '🛒' },
        { name: 'Salary Deposit', amount: '+$2,450.00', date: 'Apr 15', icon: isDarkMode ? '>' : '💰' },
      ].map((transaction, index) => (
        <div key={index} style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          backgroundColor: theme.cardBackground,
          borderRadius: theme.borderRadius,
          marginBottom: '12px',
          boxShadow: isDarkMode ? 'none' : '0 4px 12px rgba(0,0,0,0.05)',
          border: isDarkMode ? '1px solid #33ff00' : 'none',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: isDarkMode ? '0' : '12px',
            backgroundColor: isDarkMode ? '#000000' : '#f0f0f5',
            border: isDarkMode ? '1px solid #33ff00' : 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '16px',
            fontSize: '18px'
          }}>
            {transaction.icon}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ 
              margin: '0 0 4px 0', 
              fontWeight: isDarkMode ? '400' : '500',
              fontFamily: theme.fontFamily
            }}>
              {isDarkMode ? transaction.name.toUpperCase() : transaction.name}
            </p>
            <p style={{ 
              margin: '0', 
              fontSize: '13px', 
              color: theme.secondaryText,
              fontFamily: theme.fontFamily
            }}>
              {transaction.date}
            </p>
          </div>
          <p style={{ 
            margin: '0', 
            fontWeight: isDarkMode ? '400' : '600',
            color: transaction.amount.includes('+') ? 
              (isDarkMode ? '#33ff00' : '#4CAF50') : 
              theme.textColor,
            fontFamily: theme.fontFamily
          }}>
            {transaction.amount}
          </p>
        </div>
      ))}

      {/* Quick Actions */}
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: isDarkMode ? '400' : '600', 
        margin: '24px 0 16px 0',
        letterSpacing: isDarkMode ? '1px' : 'normal'
      }}>
        {isDarkMode ? 'QUICK_ACTIONS:' : 'Quick Actions'}
      </h3>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        {[
          { name: 'Send', icon: isDarkMode ? '↗' : '↗️' },
          { name: 'Request', icon: isDarkMode ? '↙' : '↙️' },
          { name: 'Cards', icon: isDarkMode ? '#' : '💳' },
          { name: 'More', icon: isDarkMode ? '...' : '•••' }
        ].map((action, index) => (
          <div key={index} style={{
            flex: 1,
            backgroundColor: theme.cardBackground,
            borderRadius: theme.borderRadius,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: isDarkMode ? 'none' : '0 4px 12px rgba(0,0,0,0.05)',
            border: isDarkMode ? '1px solid #33ff00' : 'none',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: isDarkMode ? '0' : '12px',
              background: isDarkMode ? 
                '#000000' : 
                theme.accentGradient,
              border: isDarkMode ? '1px solid #33ff00' : 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '8px',
              fontSize: '18px',
              color: isDarkMode ? '#33ff00' : '#ffffff'
            }}>
              {action.icon}
            </div>
            <p style={{ 
              margin: '0', 
              fontSize: '13px',
              fontFamily: theme.fontFamily,
              letterSpacing: isDarkMode ? '1px' : 'normal'
            }}>
              {isDarkMode ? action.name.toUpperCase() : action.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  return <BankingApp />;
};

ReactDOM.render(<App />, document.getElementById('root'));
