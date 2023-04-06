const { io } = require('socket.io-client');

const manageSubmit = (e) => {
  e.preventDefault();
  const input = document.getElementById('text-input');
  const value = input.value;
  console.log(value);
  input.value = '';
  socket.emit('send-message', value);
};

const socket = io('http://localhost:8000');

socket.on('connect', () => {
  console.log('Connected to server socket ID: ' + socket.id);
  socket.emit('test', 'Hello from client');
});

socket.on('receive-message', (data) => {
  console.log("Got it from server: " + data);
});

function App() {
  return (
    <div id='test'>
      <h1>React test form</h1>

      <form id="test-form">
        <input type="text" id="text-input" />
        <button type="submit" id="submit-button" onClick={manageSubmit}>Submit</button>
      </form>
    </div>
  );
}

export default App;
