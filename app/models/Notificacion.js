const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificacionSchema = new Schema({
    empresaId: { type: Schema.Types.ObjectId, ref: 'Empresa', required: true },
    documentoId: { type: Schema.Types.ObjectId, ref: 'Documento', required: true },
    tipo: { type: String, enum: ['renovacion', 'vencimiento'], required: true },
    mensaje: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Notificacion', notificacionSchema);
