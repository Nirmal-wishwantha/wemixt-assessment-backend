const express = require('express');
const { register, getUser, updateUser, userProfilePicture, loginUser, uploadUrl } = require('../controllers/userController');
const router = express.Router();

// Routes for uploading profile picture
router.post('/profile', uploadUrl);

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', loginUser);

// Route for fetching all users
router.get('/user', getUser);

// Route for updating user information
router.put('/:id', userProfilePicture.single('profileImage'), updateUser);

module.exports = router;
