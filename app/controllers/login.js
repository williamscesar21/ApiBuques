//controllers/login.js
const Empresa = require('../models/Empresa');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.login = async (req, res) => {
    try {
        // Capturamos el email y la contraseña de la petición
        const { email, password } = req.body;

        // Buscamos la empresa por email
        const empresa = await Empresa.findOne({ email: email });

        // Verificamos que la empresa exista
        if (!empresa) {
            return res.status(404).json({ error: 'Email no encontrado' });
        }

        // Verificamos que la contraseña sea correcta
        const checkPassword = await empresa.comparePassword(password);

        if (!checkPassword) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generamos el token
        const token = jwt.sign({ _id: empresa._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        // Enviamos la respuesta con el token
        res.header('auth-token', token).json({ token: token, empresa: empresa });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
