const express = require('express');
const app = express();
const PORT = 8000;

// Endpoint /1
app.get('/1', (req, res) => {
  res.send('EQfNMk1V4dqXp/5O31+vrg==');
});

// Endpoint /2
app.get('/2', (req, res) => {
  res.json({
    username: 'EQfNMk1V4dqXp/5O31+vrg==',
    password: 'EQfNMk1V4dqXp/5O31+vrg=='
  });
});

// Endpoint /3
app.get('/3', (req, res) => {
    res.json({
      "EQfNMk1V4dqXp/5O31+vrg==": "EQfNMk1V4dqXp/5O31+vrg=="
    });
  });
  
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
