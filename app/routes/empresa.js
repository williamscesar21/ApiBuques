//routes/empresa.js

const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresa');

//Ruta para obtener todos las empresas
router.get('/', empresaController.list);

//Ruta para obtener una empresa por id
router.get('/:empresaId', empresaController.listByEmpresaId);

//Ruta para crear una empresa
router.post('/', empresaController.create);

//Ruta para actualizar una empresa
router.put('/:empresaId', empresaController.update);

//Ruta para borrar una empresa
router.delete('/:empresaId', empresaController.delete);

module.exports = router