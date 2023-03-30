const express = require('express'); // Import express
const db = require('./config/connection'); // Import connection.js
const routes = require('./controllers'); // Import routes

const PORT = process.env.PORT || 3001; // Define port
