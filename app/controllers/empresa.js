//controllers/empresa.js

const mongoose = require('mongoose');
const Empresa = require('../models/Empresa');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const generarNombreArchivo = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${timestamp}-${random}`;
};
// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define el directorio donde se guardarán los archivos
        const uploadDir = path.join(__dirname, '../uploads/logo_empresa');
        
        // Verificar si el directorio existe, si no, crearlo
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generar un nombre único para el archivo
        const nombreArchivo = generarNombreArchivo();
        cb(null, nombreArchivo + path.extname(file.originalname));
    }
});
// Middleware de Multer
const upload = multer({ 
    storage: storage,
    limits: {
        // Limita el tamaño del archivo a 5MB
        fileSize: 1024 * 1024 * 5 
    },
    fileFilter: function (req, file, cb) {
        // Solo acepta archivos de imagen
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'));
        }
    }
}).single('images');

// Crear una nueva empresa guardando el nombre, el logo , email, password, y el array de buques 
exports.create = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        try {
            const hashedPassword = await Empresa.encryptPassword(req.body.password);
            const empresa = new Empresa({
                nombre: req.body.nombre,
                logo: req.file ? [{ fileName: req.file.filename, contentType: req.file.mimetype }] : [],
                email: req.body.email,
                password: hashedPassword,
                buques: req.body.buques
            });
            const savedEmpresa = await empresa.save();
            res.status(201).json(savedEmpresa);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
};

// Listar todas las empresas
exports.list = (req, res) => {
    Empresa.find()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
}

// Listar una empresa por id
exports.listByEmpresaId = (req, res) => {
    Empresa.findById(req.params.empresaId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
}

// Eliminar una empresa por id
exports.delete = (req, res) => {
    Empresa.findByIdAndDelete(req.params.empresaId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
}

// Actualizar una empresa por id
exports.update = (req, res) => {
    const empresa = {
        nombre: req.body.nombre,
        logo: req.body.logo,
        email: req.body.email,
        password: req.body.password,
        buques: req.body.buques
    };
    Empresa.findByIdAndUpdate(req.params.empresaId, empresa, { new: true })
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
}

