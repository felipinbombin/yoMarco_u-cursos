/**
    Actualiza la cantidad de links que aparece en el icono de la extensión
    cada vez que se hace un cambio al elemento marcas
*/
chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log("Se actualiza el badge.");
    
    for(marcas in changes){
        if (typeof marcas != "undefined") {
            var dif = 0;
            chrome.storage.sync.get(null, function(almacen_json) {
                for(c_marcas in almacen_json){
                    if(c_marcas === marcas) 
                        dif += changes[marcas].newValue.length;
                    else
                        dif += almacen_json[c_marcas].length;
                }

                chrome.browserAction.setBadgeText({text: dif.toString()});
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
                    {marcas0: [],
                     marcas1: [],
                     marcas2: [],
                     marcas3: [],
                     marcas4: [],
                     marcas5: [],
                     marcas6: [],
                     marcas7: [],
                     marcas8: [],
                     marcas9: [],}, 
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