const App = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Hello World</h1>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
