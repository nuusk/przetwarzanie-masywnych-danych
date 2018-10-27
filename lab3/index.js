const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const mongoURI = `mongodb://${process.env.DB_USER}
                  :${process.env.DB_PASS}
                  @${process.env.DB_HOST}`;

mongoose.connect(mongoURI, () => {
  console.log('Successfully connected to DB!');
});