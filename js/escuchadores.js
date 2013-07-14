/**
    Actualiza la cantidad de links que aparece en el icono de la extensión
    cada vez que se hace un cambio al elemento marcas
*/
chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log("Se actualiza el badge.");

    for(marcas in changes){
        if (typeof marcas != "undefined") {
            // si se agregó una marca = +1:
            // si se eliminó una marca = -1;
            var dif = changes[marcas].newValue.length - changes[marcas].oldValue.length;

            chrome.browserAction.getBadgeText({} ,function(texto_actual){
                var cadena;
                if (texto_actual === "")
                    cadena = dif.toString();
                else
                    cadena = (parseInt(texto_actual)+dif).toString();
                
                chrome.browserAction.setBadgeText({text: cadena});
            });

            break;
        }
    }
});

/**
    Se ejecuta cuando la extension es iniciada por primera vez, después de una 
    actualización de la extensión o una actualización del navegador
*/
chrome.runtime.onInstalled.addListener(function(details) {
    
    switch(details.reason) {
        case "install":
            /** 
                Se crean los arreglos que almacenarán las marcas. Cada uno almacena un máximo de 19 marcas.
                i.e. : 190 links máximo
                limitación de chrome.storage.sync
            */
            chrome.storage.sync.set(
                    {marcas1: [],
                     marcas2: [],
                     marcas3: [],
                     marcas4: [],
                     marcas5: [],
                     marcas6: [],
                     marcas7: [],
                     marcas8: [],
                     marcas9: [],
                     marcas10: [],}, 
                function() {
                    console.log('creado arreglos base.');
            });
            // el color de fondo del badge es rojo
            chrome.browserAction.setBadgeBackgroundColor({color: "#e10c12"});
            break;
        case "update":
            console.log(details.previousVersion());
            break;
        case "chrome_update":

            break;
    }
    return true;
});