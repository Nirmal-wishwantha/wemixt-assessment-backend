const express = require('express');
const app = express();

const cors = require('cors');

// CORS middleware
app.use(cors());

// Encode all resources
app.use(
    express.urlencoded({
        extended: true,
    })
);

// Accept JSON objects
app.use(express.json());

module.exports = app;
