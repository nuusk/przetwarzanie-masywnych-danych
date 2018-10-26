const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello Poe');
});

app.listen(1234, () => {
  console.log('Server started listening on port 1234...');
});