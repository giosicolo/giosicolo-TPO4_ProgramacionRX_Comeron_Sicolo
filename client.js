// Inicializar cada elemento cuando finaliza la carga de la ventana
window.addEventListener("load", function(event) {              
    var status = document.getElementById("status");              
    var url = document.getElementById("url");
    var user = document.getElementById("user");              
    var open = document.getElementById("open");              
    var close = document.getElementById("close");              
    var send = document.getElementById("send");              
    var message = document.getElementById("message"); 
    var chat = document.getElementById("chat");             
    var socket;                 
    status.textContent = "Offline";
    status.style.color = "red";               
    url.value = "ws://localhost:8080"; 

    close.disabled = true;              
    send.disabled = true;
    message.disabled = true;                 

    // Crear una nueva conexion cuando se hace click en el boton 'Conectarse'
    open.addEventListener("click", function(event) {
        if (user.value) {              
            open.disabled = true;              
            socket = new WebSocket(url.value + "/" + user.value, "echo-protocol");

            socket.addEventListener("open", function(event) {
                user.disabled = true;                  
                close.disabled = false;  
                message.disabled = false;                
                send.disabled = false;                  
                status.textContent = "Online"; 
                status.style.color = "green";             
            });                 

            // Mostrar mensajes recibidos desde el servidor             
            socket.addEventListener("message", function(event) { 
                let newMessage = event.data;  
                let newMessageElement = document.createTextNode(newMessage + "\n");
                chat.appendChild(newMessageElement)
                chat.scrollTop = chat.scrollHeight;    
            });                 

            // Mostrar error de conexion con el servidor              
            socket.addEventListener("error", function(event) {                  
                alert("Error de conexion con el servidor: " + event.type);              
            });                 

            // Cuando llega el mensaje por parte del servidor, se reinicia el estado
            socket.addEventListener("close", function(event) {            
                open.disabled = false;                  
                status.textContent = "Offline";
                status.style.color = "red";                 
            });
        }
        else 
            alert("Ingrese su nombre de usuario.") 
    });             

    // Cerrar la conexion cuando se hace click en el boton 'Desconectarse'   
    close.addEventListener("click", function(event) {              
        close.disabled = true;              
        send.disabled = true;
        user.disabled = false;              
        message.disabled = true;
        chat.textContent = "";  
        message.value = "";              
        socket.close();          
    });             

    // Enviar el mensaje al servidor cuando se hace click en el boton 'Enviar'
    send.addEventListener("click", function(event) {
        messageIsEmpty = !(message.value.trim().length);
        if (!messageIsEmpty) {
            socket.send(message.value);
            message.value = ""; 
        }         
    });      
}); 