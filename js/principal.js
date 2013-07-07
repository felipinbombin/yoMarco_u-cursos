
/** 
	una vez que se termina de cargar la pagina se ejecuta la función 
*/
document.addEventListener('DOMContentLoaded', function () {
	// Asocia un evento click al enlace 'créditos'
  	document.getElementById("toggle-credito").addEventListener('click', mostrar_creditos);
  	cargar_marcas();
});

/*
	Carga las marcas almacenadas en el localStorage del navegador
*/
function cargar_marcas(){
	var marcas = localStorage["marcas"];

	var div = document.getElementById("lista_marcas");

	// si no hay nada almacenado se detiene
	if (typeof marcas === "undefined" || marcas.length === 0){
		var nodo_ayuda_texto = document.createTextNode("no has marcado ningún tema aún.");
		var div_ayuda = document.createElement("div");

		div_ayuda.setAttribute("class","ayuda");
		div_ayuda.appendChild(nodo_ayuda_texto);
		div.appendChild(div_ayuda);

		return;
	}

	marcas = JSON.parse(marcas);

	var nodo_h1 = null;
	var nodo_titulo = null;
	var nodo_titulo_texto = null;
	var nodo_eliminar = null;
	var nodo_eliminar_texto = null;
	var nodo_fecha_ingreso = null;
	var nodo_fecha_ingreso_texto = null;
	var nodo_ayuda_link = null;
	var nodo_ayuda_link_texto = null;

	for(var i=marcas.length-1; 0<=i;i--) {
		
		nodo_h1 = document.createElement("h1");
		
		nodo_titulo = document.createElement("a");
		nodo_titulo_texto = document.createTextNode(marcas[i].titulo);

		nodo_eliminar = document.createElement("a");
		nodo_eliminar_texto = document.createTextNode("Eliminar");

		nodo_fecha_ingreso = document.createElement("em");
		nodo_fecha_ingreso_texto = document.createTextNode(marcas[i].fecha_ingreso);

		nodo_ayuda_link = document.createElement("em");
		nodo_ayuda_link_texto = document.createTextNode(marcas[i].link);

		nodo_titulo.setAttribute("href", marcas[i].link);
		nodo_titulo.setAttribute("target", "_blank");

		nodo_eliminar.setAttribute("href","#");
		nodo_eliminar.setAttribute("class","eliminar");
		nodo_eliminar.setAttribute("id", i);
		nodo_eliminar.addEventListener("click", function() {
			if (confirm("¿Estás segur@ que deseas eliminar la marca?") && eliminar_marca(this.id)) {
				div.innerHTML = "";
				cargar_marcas();
			}
		});

		nodo_fecha_ingreso.setAttribute("class", "fecha");

		nodo_ayuda_link.setAttribute("class","ayuda link");

		nodo_titulo.appendChild(nodo_titulo_texto);
		nodo_fecha_ingreso.appendChild(nodo_fecha_ingreso_texto);
		nodo_eliminar.appendChild(nodo_eliminar_texto);
		nodo_ayuda_link.appendChild(nodo_ayuda_link_texto);

		nodo_h1.appendChild(nodo_titulo);
		nodo_h1.appendChild(nodo_fecha_ingreso);
		nodo_h1.appendChild(nodo_eliminar);
		nodo_h1.appendChild(nodo_ayuda_link);

		div.appendChild(nodo_h1);
	}
}

function eliminar_marca(id) {
	try {
		var marcas = localStorage["marcas"];
		marcas = JSON.parse(marcas);

		marcas.splice(id, 1);

		localStorage["marcas"] = JSON.stringify(marcas);
		return true;
	} catch(err) {
		console.log("Error al eliminar: " + err.message);
		return false;
	}
}

function mostrar_creditos() {
	var creditos = document.getElementById("creditos");

	if (creditos.style.display == "block")
		creditos.style.display = "none";
	else if (creditos.style.display == "none" || creditos.style.display == "" )
		creditos.style.display = "block";
}

