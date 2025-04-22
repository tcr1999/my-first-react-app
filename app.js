const Switch = () => {
  const [isOn, setIsOn] = React.useState(false);
  
  const toggleSwitch = () => {
    setIsOn(!isOn);
  };
  
  return (
    <div 
      onClick={toggleSwitch}
      style={{
        width: '60px',
        height: '30px',
        backgroundColor: isOn ? '#4CAF50' : '#ccc',
        borderRadius: '15px',
        padding: '5px',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.3s'
      }}
    >
      <div 
        style={{
          width: '26px',
          height: '26px',
          backgroundColor: 'white',
          borderRadius: '50%',
          position: 'absolute',
          left: isOn ? '35px' : '5px',
          transition: 'left 0.3s',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}
      />
    </div>
  );
};

const App = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      gap: '20px'
    }}>
      <h1>Hello World</h1>
      <p>Click the switch below:</p>
      <Switch />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
