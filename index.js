const express = require('express');
const app = express();
const PORT = 4000; 

//Rutas 
app.get('/', (req, res) => {res.send('Hola, esto es lo proximo a ser un chat simple');});

//Iniciar el server
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

