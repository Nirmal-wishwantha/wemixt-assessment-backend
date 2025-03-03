const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/userRoute');
const memberRoutes = require('./routes/memberRoutes')

// CORS middleware
app.use(cors());

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// User routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/members', memberRoutes);

module.exports = app;
