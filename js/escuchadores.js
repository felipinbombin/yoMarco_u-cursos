
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        
        guardar_marca(request.link);

        console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    
        sendResponse({tag: "marcado"});
});


function guardar_marca(link) {
    var marcas = localStorage["marcas"];

    // si no hay nada almacenado
    if (typeof marcas === "undefined")
        marcas = [];
    else
        marcas = JSON.parse(marcas);

    marcas.push({"link":link});

    localStorage["marcas"] = JSON.stringify(marcas);

}