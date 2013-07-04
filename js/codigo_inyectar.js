
// una vez que se termina de cargar la pagina se ejecuta la función
document.addEventListener('DOMContentLoaded', function () {
    agregar_link();
});

/*
	Agrega un link llamado "Marcar" en la sección donde aparecen 
	los links "responder, padre, permalink, etc" de cada mensaje de 
	un foro de u-cursos (cualquiera).
*/

function agregar_link() {
	var permalinks = document.getElementsByClassName("permalink");

	var permalink = null    
	var texto = null;	
    var li = null;
	var link_marcar= null;
    var padre_del_padre = null;

    for(var i = 0; i < permalinks.length; i++) {
        permalink = permalinks[i];
        
		texto = document.createTextNode("marcar");	
        li = document.createElement("li");
		link_marcar= document.createElement("a");
    
    	link_marcar.appendChild(texto);

        // <ul>
        padre_del_padre = permalink.parentNode.parentNode;

        link_marcar.setAttribute("href", "#");

        link_marcar.addEventListener('click', function(){
            console.log("este es el evento click");
        });

        li.appendChild(link_marcar);
        padre_del_padre.insertBefore(li,padre_del_padre.childNodes[3]);
    }
}