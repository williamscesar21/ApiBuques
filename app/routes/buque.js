//Rutas para el controller de buques

const express = require('express');
const router = express.Router();
const buqueController = require('../controllers/buque');

//Ruta para obtener todos los buques
router.get('/', buqueController.list);

//Ruta para obtener un buque por id
router.get('/:buqueId', buqueController.listByBuqueId);

//Ruta para obetener un buque por empresaId
router.get('/empresa/:empresaId', buqueController.listByEmpresaId);

//Ruta para crear un buque
router.post('/', buqueController.create);

//Ruta para actualizar un buque
router.put('/:buqueId', buqueController.update);

//Ruta para borrar un buque
router.delete('/:buqueId', buqueController.delete);

//Ruta para servir imagenes estaticas de un buque desde la carpeta uploads/buques_img
router.use('/img/:buqueId', express.static('./uploads/buques_img'));

module.exports = router