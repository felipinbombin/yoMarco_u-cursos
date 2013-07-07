
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        if (request.metodo==="agregar_link") {
            var marcas = localStorage["marcas"];

            if (typeof marcas === "undefined" || marcas.length === 0) {
                sendResponse({existe: false});
                return;
            }
            
            marcas = JSON.parse(marcas);

            for(var i=0;i<marcas.length;i++){
                if (marcas[i].link === request.link)    
                    sendResponse({existe: true});
            }

            sendResponse({existe: false});
        
        } else if (request.metodo="evento_click_marcar" && guardar_marca({link: request.link, titulo: request.titulo})) {
            sendResponse({tag: "marcado"});
        } else
            sendResponse(null);
});

function guardar_marca(dato) {
    try {
        var marcas = localStorage["marcas"];

        // si no hay nada almacenado
        if (typeof marcas === "undefined")
            marcas = [];
        else
            marcas = JSON.parse(marcas);

        var fecha = new Date();
        fecha = fecha.toLocaleString();
        
        marcas.push({link: dato.link, titulo: dato.titulo, fecha_ingreso: fecha});

        localStorage["marcas"] = JSON.stringify(marcas);

        return true;
    } catch(err) {
        console.log("Error al guardar: " + err.message);
        return false;
    }
}

/**
    Se ejecuta cuando un usuario de logea en el browser

chrome.runtime.onStartup.addListener(function() {
    alert("hola"):
    chrome.browserAction.setBadgeText({text: cantidad_marcas().toString()});
    chrome.browserAction.setBadgeBackgroundColor({color: "#e10c12"};
});*/

/**
    Se ejecuta cuando la extension es iniciada por primera vez, después de una 
    actualización de la extensión o una actualización del navegador

chrome.runtime.onInstalled.addListener(function(object details) {
    alert("onInstalled.addListener: " + details.reason);
    switch(details.reason) {
        case "install":

            break;
        case "update":

            break;
        case "chrome_update":

            break;
    }
});*/