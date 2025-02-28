const express = require('express');
const router = express.Router();

const {register,login}= ('../controllers/userController.js')

router.post('/api/v1/register', register);

router.post('/api/v1/login', login);

module.exports =router;