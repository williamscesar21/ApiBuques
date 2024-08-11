const nodemailer = require('nodemailer');
const Documento = require('../models/Documento');
const Empresa = require('../models/Empresa');
const cron = require('node-cron');
const dotenv = require('dotenv');

dotenv.config();

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado:', info.response);
        }
    });
};

const checkDocumentos = async () => {
    try {
        const documentos = await Documento.find().populate({
            path: 'buqueId',
            populate: { path: 'empresaId', select: 'email' }
        });
        const today = new Date();

        documentos.forEach(documento => {
            const empresaEmail = documento.buqueId.empresaId.email;
            const fechaRenovacion = new Date(documento.fechaRenovacion);
            const fechaVencimiento = new Date(documento.fechaVencimiento);
            const emailSubject = `Notificación de ${documento.nombre}`;

            // Notificación de renovación
            if (fechaRenovacion - today <= 7 * 24 * 60 * 60 * 1000 && fechaRenovacion - today >= 0) {
                sendEmail(empresaEmail, emailSubject, `Su documento ${documento.nombre} necesita ser renovado. Fecha de renovación: ${fechaRenovacion}`);
            }

            // Notificación de vencimiento
            if (fechaVencimiento - today <= 7 * 24 * 60 * 60 * 1000 && fechaVencimiento - today >= 0) {
                sendEmail(empresaEmail, emailSubject, `Su documento ${documento.nombre} está próximo a vencerse. Fecha de vencimiento: ${fechaVencimiento}`);
            }

            // Notificación de documento vencido
            if (fechaVencimiento < today) {
                sendEmail(empresaEmail, emailSubject, `Su documento ${documento.nombre} ha vencido. Fecha de vencimiento: ${fechaVencimiento}. Por favor, renueve el documento inmediatamente.`);
            }
        });
    } catch (err) {
        console.error('Error al verificar los documentos:', err.message);
    }
};

// Programación de las notificaciones con node-cron
cron.schedule('0 0 * * *', checkDocumentos); 

module.exports = {
    checkDocumentos
};
