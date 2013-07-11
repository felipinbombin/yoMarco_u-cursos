
/**
    recibe mensajes de consulta de marcas y para guardar marcas
*/
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        // actualiza la cantidad de links que aparece en el icono de la extensión
        chrome.browserAction.setBadgeText({text: request.cantidad_marcas.toString()});
        chrome.browserAction.setBadgeBackgroundColor({color: "#e10c12"});
        return true;
});

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
*/
chrome.runtime.onInstalled.addListener(function(details) {
    alert("onInstalled.addListener: " + details.reason);
    switch(details.reason) {
        case "install":

            break;
        case "update":
            console.log(details.previousVersion());
            break;
        case "chrome_update":

            break;
    }
    return true;
});