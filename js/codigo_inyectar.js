var titulo_texto = null;

// una vez que se termina de cargar la pagina se ejecuta la función
document.addEventListener('DOMContentLoaded', function () {
    
    var url_dividida = document.URL.split("#");
    if (url_dividida.length == 2) {
        var tag = document.getElementById(url_dividida[1]);
        var raiz = encontrar_raiz(tag);
        
        titulo_texto = raiz.childNodes[1].childNodes[2].childNodes[0].nodeValue;
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
    A cada titulo se le asocia un evento clic.
*/
function agregar_evento_click_a_titulos() {
    var titulos = document.getElementsByClassName("raiz");

    for(var i = 0; i < titulos.length; i++) {
        var titulo = titulos[i];

        // tag '<a>' que contiene el titulo y lo hace cliceable
        var tagA = titulo.childNodes[1].childNodes[2];
        tagA.addEventListener("click", function(){
            var ref_titulo = this.parentNode.parentNode;
            // setea el titulo del tema, este valor se guarda junto con el link    
            titulo_texto = ref_titulo.childNodes[1].childNodes[2].childNodes[0].nodeValue;
            
            agregar_links(ref_titulo);
        });
    }
}

/**
    Carga el link en cada mensaje hijo del tema que permite marcar un post
*/
function agregar_links(titulo) {
    var hijos = titulo.getElementsByClassName("permalink");

    for(var i=0; i<hijos.length; i++) {
        //<ul>
        var tagUl = hijos[i].parentNode.parentNode;
        
        if (tagUl.getElementsByClassName("yo_marco").length == 0)
            agregar_link(hijos[i]);
    }
}

/*
    Agrega un link llamado "Marcar" en la sección donde aparecen 
    los links "responder, padre, permalink, etc" de cada mensaje de 
    un foro de u-cursos (cualquiera).
*/
function agregar_link(permalink) {

    /**
        consulta si el link ya esta marcado (existe en la extensión 'yo_marco!!!').
    */
    chrome.storage.sync.get("marcas", function(almacen_json) {

        var existe_marca = false;

        // si no hay nada almacenado o el largo del arreglo de marcas es 0 => el link no existe
        if (typeof almacen_json.marcas != "undefined" && almacen_json.marcas != 0) {
            for(var i=0;i<almacen_json.marcas.length;i++){
                if (almacen_json.marcas[i].link === permalink.href) {
                    existe_marca = true;
                    break;
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
            texto = document.createTextNode("marcado");    
        else {
            texto = document.createTextNode("marcar"); 
            link_marcar.addEventListener('click', function(){
                //tag a que contiene el texto "marcar"
                var ref_etiqueta = this.childNodes[0];
                var ref_link = this.href;

                // se recupera el arreglo de marcas y se agrega la nueva.
                chrome.storage.sync.get("marcas", function(almacen_json) {
                    // si no hay nada almacenado, se crea un arreglo de marcas
                    if (typeof almacen_json.marcas === "undefined")
                        almacen_json.marcas = [];
                    
                    // se agrega una marca al arreglo de marcas
                    almacen_json.marcas.push({link: ref_link, titulo: titulo_texto, fecha_ingreso: fecha_ahora_con_formato(), comentario: ""});

                    // se actualizan los datos
                    chrome.storage.sync.set({marcas: almacen_json.marcas}, function() {
                        ref_etiqueta.nodeValue = "marcado";
                    });

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