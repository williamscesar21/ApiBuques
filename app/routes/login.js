//routes/login.js

const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login');

//Ruta para iniciar sesión
router.post('/', loginController.login);

module.exports = router