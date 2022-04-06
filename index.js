require('dotenv').config();

//Configurar listening  del puerto para ver el proyecto en un navegador
const express = require('express');
const port = 3000 || process.env.port;

//Librerias de SendGrid para envio de correos electronicos
const email = require('./src/email');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//Librerias de Twilio para envio de mensajes
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

//Para realizar pruebas con Postman
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Creación de la Ruta del Proyecto
//Endpoint: http://localhost:3000
app.get('/', (req, res) => {
  res.json({ message: 'Success' });
});

//Para poder ver la ruta en el navegador, se activa el listen()
app.listen(port, () => {
  console.log(`Accede al sitio web dando click aquí: http://localhost:${port}`);
});

//
app.post('/api/email/confirmation', async (req, res, next) => {
  //Llamamos la función que estará en la clase email.js y que requiere unos parametros que ingresan por Postman
  try {
    res.json(await email.sendOrder(req.body));
  } catch (err) {
    next(err);
  }
});

//Validar que el código que nos devuelve la ejecución del codigo, en caso de error mostrar todo el contenido del error
app.use((err, req, res, next) => {
  //100 => Informativo
  //200 => No es un error, es un status success
  //300 => No está disponible el recurso
  //400 => No se encuentra el URI
  //500 => Error del servidor
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: error.message });
  return;
});

//Funcion de obtener mensaje
function getMessage() {
  const body = 'Mensaje enviado el 06/04/2022 07:00:00 a.m';
  return {
    to: 'jaimepalozgm@gmail.com',
    from: 'jaimea.parral@autonoma.edu.co',
    subject: 'Prueba SendGrid Ingeniería de Software',
    text: body,
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      <div class="contanier section">
        <label><strong>Paisaje</strong></label>
        <img src="https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" width="400px">
      </div>
    </body>
    </html>`,
  };
}

//Función de Enviar Correo
async function sendEmail() {
  try {
    await sgMail.send(getMessage());
    console.log('Correo ha sido enviado');
  } catch (err) {
    console.error('No se pudo enviar el mensaje');
    console.error(err);
    if (err.response) console.error(err.response.body);
  }
}

async () => {
  console.log('Enviando correo electronico');
  await sendEmail();
};

/* ===============================TWILIO================================ */
/* ---------------Mensaje por SMS--------------- */
client.messages
  .create({
    body: 'Prueba de Twilio por SMS. Grupo Ing de Software miercoles en la mañana',
    from: '+15716216984',
    to: '+573182200072',
  })
  .then((message) => console.log(`Mensaje Enviado por SMS ${message.sid}`));

/* ---------------Mensaje por WhatsApp--------------- */
client.messages
  .create({
    body: 'Prueba de Twilio por WhatsApp. Grupo Ing de Software miercoles en la mañana',
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+573182200072',
  })
  .then((message) =>
    console.log(`Mensaje Enviado por WhatsApp ${message.sid}`)
  );
