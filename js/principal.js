/*
	Carga las marcas almacenadas en el localStorage del navegador
*/
function cargar_marcas(){
	var marcas = localStorage["marcas"];

	// si no hay nada almacenado se detiene
	if (typeof marcas === "undefined")
		return;

	marcas = JSON.parse(marcas);

	var div = document.getElementById("lista_marcas");
	var br = document.createElement("br");

	var nodeText = null;
	var nodeA = null;
	var nodeH1 = null;
	
	for(var i=0;i<marcas.length;i++) {
		nodeText = document.createTextNode(marcas[i].titulo);
		nodeA = document.createElement("a");
		nodeH1 = document.createElement("h1");
		
		nodeA.setAttribute("href",marcas[i].link);
		nodeA.setAttribute("target", "_blank");

		nodeA.appendChild(nodeText);
		nodeH1.appendChild(nodeA);

		div.appendChild(nodeH1);
		div.appendChild(br);
	}
}

function mostrar_creditos() {
	var creditos = document.getElementById("creditos");

	if (creditos.style.display == "block")
		creditos.style.display = "none";
	else if (creditos.style.display == "none" || creditos.style.display == "" )
		creditos.style.display = "block";
}

// una vez que se termina de cargar la pagina se ejecuta la función
document.addEventListener('DOMContentLoaded', function () {
	// Asocia un evento click al enlace 'créditos'
  	document.getElementById("toggle-credito").addEventListener('click', mostrar_creditos);
  	cargar_marcas();
});

