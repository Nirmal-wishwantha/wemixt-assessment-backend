const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
};

const dbName = process.env.DB_NAME;

const connection = mysql.createConnection(dbConfig);

// Check & Create Database
connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``, (err) => {
  if (err) {
    console.error("Error creating database:", err);
    return;
  }
  console.log(`Database '${dbName}' is ready.`);
  
  // Connect to the new database
  const db = mysql.createConnection({ ...dbConfig, database: dbName });

  // Load and execute table creation SQL files
  const sqlFiles = ['users.sql', 'members.sql', 'documents.sql'];
  sqlFiles.forEach((file) => {
    const sql = fs.readFileSync(`./models/${file}`, 'utf8');
    db.query(sql, (err) => {
      if (err) console.error(`Error creating table from ${file}:`, err);
      else console.log(`Table from ${file} checked/created.`);
    });
  });

  db.end();
});

connection.end();
