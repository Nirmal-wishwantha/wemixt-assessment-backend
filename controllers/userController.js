const bcrypt = require('bcrypt');
const db = require('../database/db');
const multer = require('multer');
const path = require('path');

const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key';

// Multer storage for profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'storage/'); // Save images in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Register User
const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const profileImage = req.file ? req.file.filename : null; // Store filename if uploaded

    // Check if email already exists
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.query('INSERT INTO users (fullName, email, password, profileImage) VALUES (?, ?, ?, ?)',
      [fullName, email, hashedPassword, profileImage]);

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};


// **User Login Function**
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // Compare hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token, user: { id: user.id, fullName: user.fullName, email: user.email, profileImage: user.profileImage } });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
};


// Get Users
const getUser = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, fullName, email, profileImage FROM users');
    if (users.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};


// update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email } = req.body;
    const profileImage = req.file ? req.file.filename : null; 

    let query = 'UPDATE users SET fullName = ?, email = ?';
    let values = [fullName, email];

    if (profileImage) {
      query += ', profileImage = ?';
      values.push(profileImage);
    }

    query += ' WHERE id = ?';
    values.push(id);

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};





module.exports = { register, getUser, updateUser, upload,loginUser };

