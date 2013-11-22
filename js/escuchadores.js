// Configuración de googleAnalytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-42211163-1']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function seguir_instalacion(evento) {
    _gaq.push(['_trackEvent', "extensión " +  chrome.app.getDetails().version, evento]);
}

/**
    Actualiza la cantidad de links que aparece en el icono de la extensión
    cada vez que se hace un cambio al elemento marcas
*/
chrome.storage.onChanged.addListener(function(changes, namespace) {

    for(marcas in changes){
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
});

/**
    Se ejecuta cuando la extension es iniciada por primera vez, después de una 
    actualización de la extensión o una actualización del navegador
*/
chrome.runtime.onInstalled.addListener(function(details) {
    
    switch(details.reason) {
        case "install":
            /** 
                Desde versión 1.1.3
                Se crean los arreglos que almacenarán las marcas. Cada uno almacena un máximo de 19 marcas.
                i.e. : 190 links máximo
                limitación de chrome.storage.sync
            */
            var registro = "marcas";
            var registro0 = "marcas0";

            chrome.storage.sync.get(registro, function (almacen_json) {
                
                if(almacen_json[registro0] != "undefined") { 
                    /* No existen las marcas, se crean */
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
                             marcas9: []}, 
                        function() {
                            console.log('creado arreglos base.');
                    });
                }

            });

            // el color de fondo del badge es rojo
            chrome.browserAction.setBadgeBackgroundColor({color: "#e10c12"});

            // Informó que se instaló la extensión.
            seguir_instalacion("instalado");

            break;

        case "update":
            // para compatibilidad con versiones anteriores a 1.0.0
            if(typeof localStorage["marcas"] != "undefined") {
                actualizacion_pasar_a_storage_sync();
            // para compatibilidad con versiones anteriores a 1.1.3
            } else {
                actualizacion_expandir_storage_sync();
            }
            
            // Informó que se actualizó la extensión.
            seguir_instalacion("actualizado");

            // el color de fondo del badge es rojo
            chrome.browserAction.setBadgeBackgroundColor({color: "#e10c12"});

            break;
            
        case "chrome_update":

            break;
    }
    return true;
});

/**
    Compatibilidad con versiones anteriores a 1.0.0
    Cambia el modo de almacenamiento de uno local a uno sincronizado (chrome.storage.sync).
*/
function actualizacion_pasar_a_storage_sync() {
    chrome.storage.sync.set({marcas: JSON.parse(localStorage["marcas"])}, function() {
                console.log('Actualizado arreglo base. Adaptado desde localStorage a storage.sync');
                localStorage.clear();
                actualizacion_expandir_storage_sync();
    });
}

/**
    Compatibilidad con versiones anteriores a 1.1.3
    Agrega más registros a storage.sync para aumentar la cantidad de marcas que se pueden guardar.
*/
function actualizacion_expandir_storage_sync() {
    var registro = "marcas";
    
    chrome.storage.sync.get(registro, function(almacen_json) {
        if(almacen_json[registro] != null){
            chrome.storage.sync.set(
                    {marcas0: almacen_json[registro],
                     marcas1: [],
                     marcas2: [],
                     marcas3: [],
                     marcas4: [],
                     marcas5: [],
                     marcas6: [],
                     marcas7: [],
                     marcas8: [],
                     marcas9: []}, 
                function() {
                    console.log("Actualizado arreglos base. Expansión de memoria a 10 registros.");
                    chrome.storage.sync.remove(registro, function() {
                            console.log("Actualizado arreglos base. Se elimina registro 'marcas'.");
                            actualizacion_agregar_ctd_resp_a_storage_sync();
                    }); 
            });
        }
    });
}

/**
    Compatibilidad con versiones anteriores a 1.3.4.
    Agrega la propiedad ctd_resp a cada marca para que pueda sincronizar los comentarios del hilo asociado a la marca.
*/
function actualizacion_agregar_ctd_resp_a_storage_sync() {

    chrome.storage.sync.get(null, function(almacen_json) {
        for(registro in almacen_json){
            for(var id=0; id<almacen_json[registro].length; id++){
                if (!almacen_json[registro][id].ctd_resp){
                    almacen_json[registro][id].ctd_resp = 0;
                    almacen_json[registro][id].fecha_ingreso = adaptar_fecha(almacen_json[registro][id].fecha_ingreso);
                    console.log("se crea propiedad ctd_resp para marca : " + almacen_json[registro][id].titulo);
                }
            }
        }

        chrome.storage.sync.set(almacen_json, function(){
            console.log("Se agregó propiedad ctd_resp a cada marca satisfactoriamente.");
        });
    });
}

/**
    transforma un string de fecha con formato dd/mm/aaaa hh:mm:ss a aaaa/mm/dd hh:mm:ss
*/
function adaptar_fecha(fecha){
    if (fecha.match(/[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/)) {
        fecha = fecha.split("/");
        return fecha[2].substring(0,4) + "/" + fecha[1] + "/" + fecha[0] + fecha[2].substring(4,fecha[2].length);
    } else 
        return fecha;
}