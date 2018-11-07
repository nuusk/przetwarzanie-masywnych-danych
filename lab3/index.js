const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const PORT = 5000;

require('./routes/apiRoutes')(app);

app.listen(PORT);
console.log(`Server started running on port ${PORT}...`); 