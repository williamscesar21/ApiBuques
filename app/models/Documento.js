const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentoSchema = new Schema({
    nombre: { type: String, required: true },
    buqueId: { type: Schema.Types.ObjectId, ref: 'Buque', required: true },
    archivo_documento: [{ fileName: String, contentType: String }],
    fechaCreacion: { type: Date, required: true },
    fechaRenovacion: { type: Date, required: true },
    fechaVencimiento: { type: Date, required: true }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Documento', documentoSchema);
