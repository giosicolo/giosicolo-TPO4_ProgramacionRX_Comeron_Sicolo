const express = require('express');
const http = require('http');
var WebSocketServer = require('websocket').server;

const app = express();
const server = http.createServer(app);

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

const PORT = process.env.PORT || 8080;

// Inicia el servidor
server.listen(PORT, () => {
  console.log(`El servidor se encuentra en línea en http://localhost:${PORT}`);
});

function originIsAllowed(origin) {      
	// put logic here to detect whether the specified origin is allowed.      
	return true;  
}   

var clients = new Set();

wsServer.on('request', function(request) {      
	if (!originIsAllowed(request.origin)) {      
	    // Make sure we only accept requests from an allowed origin      
        request.reject();
        console.log((new Date()) + ': Conexión de ' + request.origin + ' rechazada.');      
        return;  
    }         

    var connection = request.accept('echo-protocol', request.origin);      
	
    let currentUrl = request.httpRequest.url;
    let currentUser = currentUrl.substring(1);
    
    clients.add(connection);
    
    for (let client of clients) {
        client.sendUTF(getCurrentTime() + currentUser +" ingresó a la sala.");
    }

    console.log((new Date()) + ': Conexión de ' + request.origin + ' aceptada.');  
    
    connection.on('message', function(message) {                 
	    console.log('Mensaje Recibido: ' + message.utf8Data);
        for (let client of clients) {
            client.sendUTF(getCurrentTime() + currentUser + ": " + message.utf8Data);
        }
    });         

    connection.on('close', function(reasonCode, description) {          
	    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' desconectado.');
    
        for (let client of clients) {
            client.sendUTF(getCurrentTime() + currentUser + " se desconectó de la sala.");
        }
        clients.delete(connection);  
    });  
});

function getCurrentTime() {
    let currentDate = new Date();
    let sendTime = currentDate.getHours() + ":" + (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes() + " ";
    return sendTime;
}