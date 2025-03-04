const express = require('express');
const { register, getUser, updateUser, upload,loginUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', upload.single('profileImage'), register);

router.post('/login',loginUser);
router.get('/user', getUser);

router.put('/:id', upload.single('profileImage'), updateUser);


module.exports = router;
