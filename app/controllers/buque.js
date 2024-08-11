//controllers/buque.js

const mongoose = require('mongoose');
const Buque = require('../models/Buque');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Función para generar un nombre único para el archivo
const generarNombreArchivo = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${timestamp}-${random}`;
};
// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define el directorio donde se guardarán los archivos
        const uploadDir = path.join(__dirname, '../uploads/buques_img');
        
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

//Crear buque guardando el nombre, empresaId y la imagen
exports.create = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const buque = new Buque({
            nombre: req.body.nombre,
            empresaId: req.body.empresaId,
            images: req.file ? [{ fileName: req.file.filename, contentType: req.file.mimetype }] : []
        });
        buque
            .save()
            .then((data) => {
                res.status(201).json(data);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    });
};

//Listar todos los buques
exports.list = (req, res) => {
    Buque.find()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
}

//Listar buques por empresaId
exports.listByEmpresaId = (req, res) => {
    Buque.find({ empresaId: req.params.empresaId })
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
}

//Listar buques por buqueId
exports.listByBuqueId = (req, res) => {
    Buque.findById(req.params.buqueId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
}

//Actualizar buque por buqueId
exports.update = (req, res) => {
    Buque.findByIdAndUpdate(req.params.buqueId, req.body, { new: true })
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
}

//Eliminar buque por buqueId
exports.delete = (req, res) => {
    Buque.findByIdAndDelete(req.params.buqueId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
}

