//controllers/documento.js

const mongoose = require('mongoose');
const Documento = require('../models/Documento');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//Funcion para generar un nombre unico para el archivo concatenado con el buqueId
const generarNombreArchivo = (buqueId) => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${buqueId}-${timestamp}-${random}`;
}

//Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define el directorio donde se guardarán los archivos
        const uploadDir = path.join(__dirname, '../uploads/documents');
        
        // Verificar si el directorio existe, si no, crearlo
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generar un nombre unico para el archivo
        const nombreArchivo = generarNombreArchivo(req.params.buqueId);
        cb(null, nombreArchivo + path.extname(file.originalname));
    },
})

//Middleware de Multer
const upload = multer({ 
    storage: storage,
    limits: {
        // Limita el tamaño del archivo a 5MB
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: function (req, file, cb) {
        // Solo acepta archivos PDF
        if (file.mimetype.startsWith('application/pdf')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos PDF'));
        }
    }
});

// Crear un nuevo documento guardando el nombre, buqueId, el archivo, la fecha de creación, la fecha de renovación y la fecha de vencimiento
exports.create = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const documento = new Documento({
            nombre: req.body.nombre,
            buqueId: req.params.buqueId,
            archivo: req.file ? [{ fileName: req.file.filename, contentType: req.file.mimetype }] : [],
            fechaCreacion: req.body.fechaCreacion,
            fechaRenovacion: req.body.fechaRenovacion,
            fechaVencimiento: req.body.fechaVencimiento
        });
        documento
            .save()
            .then((data) => {
                res.status(201).json(data);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    });
}

//Listar todos los documentos
exports.list = (req, res) => {
    Documento.find()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
}

//Listar documento por buqueId
exports.listByBuqueId = (req, res) => {
    Documento.find({ buqueId: req.params.buqueId })
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
}

//Listar documento por documentoId
exports.listByDocumentoId = (req, res) => {
    Documento.findById(req.params.documentoId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
}

//Actualizar fecha de renovación por documentoId
exports.updateFechaRenovacion = (req, res) => {
    Documento.findByIdAndUpdate(req.params.documentoId, { fechaRenovacion: req.body.fechaRenovacion }, { new: true })
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
}

//Actualizar fecha de vencimiento por documentoId
exports.updateFechaVencimiento = (req, res) => {
    Documento.findByIdAndUpdate(req.params.documentoId, { fechaVencimiento: req.body.fechaVencimiento }, { new: true })
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
}

//Eliminar documento por documentoId
exports.delete = (req, res) => {
    Documento.findByIdAndDelete(req.params.documentoId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
}

