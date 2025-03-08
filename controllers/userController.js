const bcrypt = require('bcrypt');
const db = require('../database/db');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key';
const port = 3000;

// Document storage configuration
const userProfile = multer.diskStorage({
    destination: './uploads/profile',
    filename: (req, file, cb) => {
        cb(null, `profile_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const userProfilePicture = multer({ storage: userProfile });

// Controller method for uploading document
const uploadUrl = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: 0, message: 'No file uploaded' });
    }

    res.json({
        success: 1,
        document_url: `http://localhost:${port}/uploads/profile/${req.file.filename}`
    });
};

// Register User
const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query('INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)', 
      [fullName, email, hashedPassword]);

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};


// User Login Function
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token, user: { id: user.id, fullName: user.fullName, email: user.email, profileImage: user.profileImage } });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
};

// Get a Specific User by ID
const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [users] = await db.query('SELECT id, fullName, email, profileImage FROM users WHERE id = ?', [id]);

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};


// Update User
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, profileImage } = req.body;

  let query = 'UPDATE users SET fullName = ?, email = ?, profileImage = ? WHERE id = ?';
  let values = [fullName, email, profileImage, id];

  try {
    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = { register, getUser, updateUser, loginUser, userProfilePicture, uploadUrl };
