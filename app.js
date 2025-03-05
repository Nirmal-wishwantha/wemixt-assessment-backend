const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/userRoute');
const memberRoutes = require('./routes/memberRoutes')
const documentRoutes = require('./routes/documentRoutes')
const path = require("path");

const docRoutes = require('./routes/docRoute')


// CORS middleware

app.use(cors({
    origin: 'http://localhost:5173', // Allow frontend to access
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// Middleware for parsing JSON and URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/images", express.static("uploads/images"));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// User routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/members', memberRoutes);
app.use('/api/v1/document', documentRoutes);
app.use('/api/v1/', docRoutes);


module.exports = app;
