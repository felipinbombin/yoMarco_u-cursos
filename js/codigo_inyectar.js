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
    chrome.runtime.sendMessage({metodo:"existe_link", link: permalink.href}, function(response) { 
    
        var texto = null;   
        var li = null;
        var link_marcar= null;
        var padre_del_padre = null;

        li = document.createElement("li");
        link_marcar= document.createElement("a");

        /**
            Si ya esta registrado se anota como 'marcado' y no se le asocia un evento click
        */
        if (response.existe)
            texto = document.createTextNode("marcado");    
        else {
            texto = document.createTextNode("marcar"); 
            link_marcar.addEventListener('click', function(){
                //tag a que contiene el texto "marcar"
                var ref_etiqueta = this.childNodes[0];
                
                chrome.runtime.sendMessage({metodo:"evento_click_marcar", link: this.href, titulo: titulo_texto}, function(response) {
                    ref_etiqueta.nodeValue = response.tag;    
                    console.log(response.tag);
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

        // si es el mensaje raiz se inserta más a la derecha para que aparezca a la derecha de "+1 -1" y a la izquierda de "responder"
        if (padre_raiz.className.search("raiz") > 0)
            padre_del_padre.insertBefore(li,padre_del_padre.childNodes[3]);
        else 
            padre_del_padre.insertBefore(li,padre_del_padre.childNodes[1]);
    });
    
}