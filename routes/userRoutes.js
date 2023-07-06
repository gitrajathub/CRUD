const express = require('express');
const bcrypt = require('bcrypt');
const userController = require('../controllers/userController');
const User = require('../models/userModel');

const router = express.Router();

router.post('/signUp', userController.signUp);
router.get('/logIn', userController.logIn);
router.delete('/delete/:id', userController.deleteUser);
router.put('/update/:id', userController.updateUser);

module.exports = router;