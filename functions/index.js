const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configura el transporte de correo electrónico usando nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // o el servicio de correo que prefieras
  auth: {
    user: "drvillegasrodrigo@gmail.com", // tu dirección de correo
    pass: "erjnxzethfuntnbr", // tu contraseña de correo (considera usar variables de entorno para seguridad)
  },
  debug: false, // Habilita la depuración
});

// Utiliza onDocumentCreated para la función de Firestore
exports.sendInspectionEmail = functions.firestore
  .document("inspections/{inspectionId}")
  .onCreate(async (snapshot, context) => {
    const inspectionData = snapshot.data();
    const dominio = inspectionData.Vehículo.Dominio;

    const mailOptions = {
      from: '"Distrigal Inspecciones" <drvillegasrodrigo@gmail.com>',
      to: "distrigalcheck@gmail.com",
      subject: `Informe de Inspección Vehículo: ${dominio}`,
      html: `
        <h1>Informe de Inspección</h1>
        <p>Informe de inspección para el vehículo dominio ${dominio}:</p>
        <pre>${JSON.stringify(inspectionData, null, 2)}</pre>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Correo enviado correctamente");
    } catch (error) {
      console.error("Error al enviar el correo", error);
    }
  });
