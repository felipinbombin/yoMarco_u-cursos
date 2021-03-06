var titulo_texto = null;
// cantidad de respuestas que tiene el hilo
var ctd_resp = null;

// una vez que se termina de cargar la pagina se ejecuta la función
document.addEventListener('DOMContentLoaded', function () {
    
    var url_dividida = document.URL.split("#");
    if (url_dividida.length == 2) {
        var tag = document.getElementById(url_dividida[1]);
        var raiz = encontrar_raiz(tag);
        
        titulo_texto = raiz.childNodes[1].childNodes[2].childNodes[0].nodeValue;
        ctd_resp = parseInt(raiz.childNodes[3].childNodes[0].nodeValue.split(" ")[0]);

        agregar_links(raiz);
    }
    
    agregar_evento_click_a_titulos()
});

/**
    utilizado cuando se carga una pagina de u-cursos que tiene mensajes abiertos (por ej. un permalink). Busca 
    la raiz del tema para poner links en todos los post de ese thread.
*/
function encontrar_raiz(tag) {
    
    if (tag.className.search("raiz") > 0)
        return tag;
    else
        return encontrar_raiz(tag.parentNode);
}

/**
    A cada titulo se le asocia un evento click.
*/
function agregar_evento_click_a_titulos() {
    var titulos = document.getElementsByClassName("raiz");

    for(var i = 0; i < titulos.length; i++) {
        var titulo = titulos[i];

        // tag '<a>' que contiene el titulo y lo hace cliqueable
        var tagA = titulo.childNodes[1].childNodes[2];
        tagA.addEventListener("click", function(){
            var ref_titulo = this.parentNode.parentNode;
            // setea el titulo del tema, este valor se guarda junto con el link    
            titulo_texto = ref_titulo.childNodes[1].childNodes[2].childNodes[0].nodeValue;
            ctd_resp = parseInt(ref_titulo.childNodes[3].childNodes[0].nodeValue.split(" ")[0]);

            agregar_links(ref_titulo);
        });
    }
}

/**
    Carga el link en cada mensaje hijo del tema que permite marcar un post
*/
function agregar_links(nodo_titulo) {
    var hijos = nodo_titulo.getElementsByClassName("permalink");

    for(var i=0; i<hijos.length; i++) {
        //<ul>
        var tag_ul = hijos[i].parentNode.parentNode;
        
        // si no existe el link 'Marcar' se agrega
        if (tag_ul.getElementsByClassName("yo_marco").length == 0)
            agregar_link(hijos[i]);
    }
}

/**
    Agrega un link llamado "Marcar" en la sección donde aparecen 
    los links "responder, padre, permalink, etc" de cada mensaje de 
    un foro de u-cursos (cualquiera).
*/
function agregar_link(permalink) {

    /**
        Consulta si el link ya esta marcado (existe en la extensión 'yoMarco u-cursos').
        Parámetro null retorna todo lo almacenado en storage. Se utilizan 10 items para almacenar a lo menos 180 links.
    */
    chrome.storage.sync.get(null, function(almacen_json) {

        var existe_marca = false;

        // se recorren todos los json que almacenan marcas. Esto se hace por la limitacion de chrome.storage.sync
        for(marcas in almacen_json){
            if (typeof marcas != "undefined") {
                for(var i=0;i<almacen_json[marcas].length;i++){
                    if (almacen_json[marcas][i].link === permalink.href) {
                        existe_marca = true;
                        break;
                    }
                }
            }
        }

        var texto = null;   
        var li = null;
        var link_marcar= null;
        var padre_del_padre = null;

        li = document.createElement("li");
        link_marcar= document.createElement("a");

        /**
            Si ya esta registrado se anota como 'marcado' y no se le asocia un evento click
        */
        if (existe_marca)
            texto = document.createTextNode("Marcado");    
        else {
            texto = document.createTextNode("Marcar"); 
            link_marcar.addEventListener('click', function(){
                //tag a que contiene el texto "marcar"
                var ref_etiqueta = this.childNodes[0];
                var ref_link = this.href;

                // se recupera los datos almacenados y se busca un espacio donde guardarlo.
                chrome.storage.sync.get(null, function(almacen_json) {
                    
                    for(marcas in almacen_json){
                        // cada item puede almacenar 19 marcas como máximo. Limitación técnica de chrome.storage.sync
                        if (almacen_json[marcas].length < 19) {
                            // se agrega una marca al arreglo de marcas
                            almacen_json[marcas].push({
                                link: ref_link, 
                                titulo: titulo_texto, 
                                fecha_ingreso: fecha_ahora_con_formato(), 
                                comentario: "",
                                ctd_resp: ctd_resp});

                            // se actualizan los datos
                            chrome.storage.sync.set(almacen_json, function() {
                                ref_etiqueta.nodeValue = "Marcado";
                            });
                            break;
                        }
                    }
                });
            });
            link_marcar.setAttribute("href", permalink.href);
        }

        link_marcar.appendChild(texto);
        link_marcar.setAttribute("class", "yo_marco");

        li.appendChild(link_marcar);

        // tag <ul>
        padre_del_padre = permalink.parentNode.parentNode;
        // se verifica si esta marca corresponde al mensaje raiz del hilo
        padre_raiz = padre_del_padre.parentNode.parentNode.parentNode;

        /** 
            si es el mensaje raiz y tiene el tag <li> de "+1 -1" 
            se considera que los foros de comunidad e institucional tienen tag "+1 -1" mientras que el de cursos no.
        */
        if (padre_raiz.className.search("raiz") > 0 && padre_del_padre.getElementsByClassName("adhesion").length > 0) {
            padre_del_padre.insertBefore(li,padre_del_padre.children[2]);
        } else {
            padre_del_padre.insertBefore(li,padre_del_padre.children[1]);
        }
    });    
}

/**
    Entrega la fecha actual formateada a YYYY-MM-DD hh:mm:ss
*/
function fecha_ahora_con_formato() {
    var fecha = new Date();
    var dateStr = padStr(fecha.getFullYear()) + "-" + 
                  padStr(1 + fecha.getMonth()) + "-" + 
                  padStr(fecha.getDate()) + " " +
                  padStr(fecha.getHours()) + ":" +
                  padStr(fecha.getMinutes()) + ":" +
                  padStr(fecha.getSeconds());
    
    return dateStr;
}

/**
    si un día o mes es un número de una unidad, este lo reemplaza por uno 
    de dos dígitos. Ej 1 -> 01
*/
function padStr(i) {
    return (i < 10) ? "0" + i : "" + i;
}