const app = require('./app');
const connectDB = require('./database/db');
require('dotenv').config();

const port = 3000;
const host = 'localhost';

// connectDB();



const server = app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
