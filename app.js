const BankingApp = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Styles that change based on theme
  const theme = {
    backgroundColor: isDarkMode ? '#1E1E2E' : '#f5f5f7',
    textColor: isDarkMode ? '#ffffff' : '#1d1d1f',
    cardBackground: isDarkMode ? '#2D2D44' : '#ffffff',
    accentColor: '#6366f1', // Purple accent for both themes
    secondaryText: isDarkMode ? '#a1a1aa' : '#6e6e73',
    borderColor: isDarkMode ? '#3F3F5F' : '#e6e6e6'
  };

  return (
    <div style={{
      backgroundColor: theme.backgroundColor,
      color: theme.textColor,
      minHeight: '100vh',
      fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
      padding: '20px',
      transition: 'all 0.3s ease'
    }}>
      {/* Header with Dark Mode Toggle */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Unix Banking</h1>
        </div>
        
        <div onClick={toggleDarkMode} style={{
          width: '60px',
          height: '30px',
          backgroundColor: isDarkMode ? theme.accentColor : '#ccc',
          borderRadius: '15px',
          padding: '3px',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            position: 'absolute',
            left: isDarkMode ? '33px' : '3px',
            transition: 'left 0.3s',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '14px'
          }}>
            {isDarkMode ? '🌙' : '☀️'}
          </div>
        </div>
      </header>

      {/* Balance Card */}
      <div style={{
        backgroundColor: theme.cardBackground,
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease'
      }}>
        <p style={{ color: theme.secondaryText, margin: '0 0 8px 0', fontSize: '14px' }}>Current Balance</p>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '32px', fontWeight: '700' }}>$8,256.42</h2>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ color: theme.secondaryText, margin: '0 0 4px 0', fontSize: '13px' }}>Card Number</p>
            <p style={{ margin: '0', fontSize: '14px' }}>•••• •••• •••• 4832</p>
          </div>
          <div>
            <p style={{ color: theme.secondaryText, margin: '0 0 4px 0', fontSize: '13px' }}>Expiry</p>
            <p style={{ margin: '0', fontSize: '14px' }}>09/28</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Recent Transactions</h3>
      
      {[
        { name: 'Coffee Shop', amount: '-$4.50', date: 'Today', icon: '☕' },
        { name: 'Grocery Store', amount: '-$56.32', date: 'Yesterday', icon: '🛒' },
        { name: 'Salary Deposit', amount: '+$2,450.00', date: 'Apr 15', icon: '💰' },
      ].map((transaction, index) => (
        <div key={index} style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          backgroundColor: theme.cardBackground,
          borderRadius: '12px',
          marginBottom: '12px',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: isDarkMode ? '#3F3F5F' : '#f0f0f5',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '16px',
            fontSize: '18px'
          }}>
            {transaction.icon}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 4px 0', fontWeight: '500' }}>{transaction.name}</p>
            <p style={{ margin: '0', fontSize: '13px', color: theme.secondaryText }}>{transaction.date}</p>
          </div>
          <p style={{ 
            margin: '0', 
            fontWeight: '600',
            color: transaction.amount.includes('+') ? '#4CAF50' : theme.textColor 
          }}>
            {transaction.amount}
          </p>
        </div>
      ))}

      {/* Quick Actions */}
      <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '24px 0 16px 0' }}>Quick Actions</h3>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        {[
          { name: 'Send', icon: '↗️' },
          { name: 'Request', icon: '↙️' },
          { name: 'Cards', icon: '💳' },
          { name: 'More', icon: '•••' }
        ].map((action, index) => (
          <div key={index} style={{
            flex: 1,
            backgroundColor: theme.cardBackground,
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: isDarkMode ? '#3F3F5F' : '#f0f0f5',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '8px',
              fontSize: '18px'
            }}>
              {action.icon}
            </div>
            <p style={{ margin: '0', fontSize: '13px' }}>{action.name}</p>
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
