/**
    Actualiza la cantidad de links que aparece en el icono de la extensión
    cada vez que se hace un cambio al elemento marcas
*/
chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log("Se actualiza el badge.");

    chrome.browserAction.setBadgeText({text: changes.marcas.newValue.length.toString()});
    chrome.browserAction.setBadgeBackgroundColor({color: "#e10c12"});

});

/**
    Se ejecuta cuando la extension es iniciada por primera vez, después de una 
    actualización de la extensión o una actualización del navegador
*/
chrome.runtime.onInstalled.addListener(function(details) {
    
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