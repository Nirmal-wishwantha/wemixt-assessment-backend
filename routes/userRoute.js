const express = require('express');
const { register, getUser, updateUser, userProfilePicture, loginUser, uploadUrl } = require('../controllers/userController');
const router = express.Router();

//uploading profile picture
router.post('/profile',userProfilePicture.single('profileImage'), uploadUrl);

router.post('/register', register);

router.post('/login', loginUser);

router.get('/user/:id', getUser);

router.put('/:id', userProfilePicture.single('profileImage'), updateUser);

module.exports = router;
