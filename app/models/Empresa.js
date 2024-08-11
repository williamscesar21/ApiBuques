const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const empresaSchema = new Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    buques: [{ type: Schema.Types.ObjectId, ref: 'Buque' }],
    logo: { fileName: String, contentType: String }
}, { timestamps: true, versionKey: false });

empresaSchema.statics.comparePassword = async function(Password, hashedPassword) {
    try {
        return await bcrypt.compare(Password, hashedPassword);
    } catch (error) {
        throw new Error(error);
    }
};


empresaSchema.statics.encryptPassword = async (clave) => {
    if (!clave) {
        throw new Error('La contraseña es requerida');
    }
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(clave, salt);
}

module.exports = mongoose.model('Empresa', empresaSchema);
