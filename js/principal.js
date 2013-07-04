

/*
	carga las marcas almacenadas en el localStorage del navegador
*/
function cargar_marcas(){

}

function mostrar_creditos() {
	var creditos = document.getElementById("creditos");

	if (creditos.style.display == "block")
		creditos.style.display = "none";
	else if (creditos.style.display == "none" || creditos.style.display == "" )
		creditos.style.display = "block";
}



chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (changeInfo.status === 'complete') {
        chrome.tabs.executeScript(tabId, {
            code: ' if (document.body.innerText.indexOf("Cat") !=-1) {' +
                  '     alert("Cat not found!");' +
                  ' }'
        });
    }
});