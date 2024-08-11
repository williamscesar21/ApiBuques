//routes/documento.js

const express = require('express');
const router = express.Router();
const documentoController = require('../controllers/documento');

//Ruta para obtener todos los documentos
router.get('/', documentoController.list);

//Ruta para obtener un documento por id
router.get('/:documentoId', documentoController.listByDocumentoId);

//Ruta para obetener un documento por buqueId
router.get('/buque/:buqueId', documentoController.listByBuqueId);

//Ruta para crear un documento
router.post('/', documentoController.create);

//Ruta para actualizar la fecha de renovación de un documento
router.put('/:documentoId', documentoController.updateFechaRenovacion);

//Ruta para actualizar la fecha de vencimiento de un documento
router.put('/vencimiento/:documentoId', documentoController.updateFechaVencimiento);

//Ruta para borrar un documento
router.delete('/:documentoId', documentoController.delete);

//Ruta para servir los archivos de un documento desde la carpeta uploads/documents
router.use('/readPdf/:documentoId', express.static('./uploads/documents'));

module.exports = router