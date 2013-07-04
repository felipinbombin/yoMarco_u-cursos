var colorPredeterminado = "blue";

function cargarOpciones() {
	var colorFav = localStorage["colorFav"];

	// colores validos son rojo, azul, verde y amarillo
	if (colorFav == undefined || (colorFav != "rojo" && colorFav != "azul" && colorFav != "verde" && colorFav != "amarillo")) {
		colorFav = colorPredeterminado;
	}

	var select = document.getElementById("color");
	for (var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
		if (child.value == colorFav) {
			child.selected = "true";
			break;
		}
	}
}

function guardarOpciones() {
	var select = document.getElementById("color");
	var color = select.children[select.selectedIndex].value;
	localStorage["colorFav"] = color;
}

function borrarOpciones() {
	localStorage.removeItem("colorFav");
	location.reload();
}