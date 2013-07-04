chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
            if (changeInfo.status === 'complete') {
                console.log("la pagina termino de cargarse");
                chrome.tabs.executeScript(tabId, {
                    code: 'alert("asdsad")'
                });
            }
        });

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });