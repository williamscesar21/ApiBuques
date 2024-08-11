const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const buqueSchema = new Schema({
    nombre: { type: String, required: true },
    empresaId: { type: Schema.Types.ObjectId, ref: 'Empresa', required: true },
    images: [{ fileName: String , contentType: String  }],
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Buque', buqueSchema);
