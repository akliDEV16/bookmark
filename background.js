(() => {
    //console.log("✅ background.js chargé !"); // Vérifier si le script tourne

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        // console.log("🔄 onUpdated déclenché pour l'onglet:", tabId, "URL:", tab.url);

        if (changeInfo.status === "complete" && tab.url && tab.url.includes("youtube.com/watch")) {
            // console.log("📌 Une vidéo YouTube a été détectée !");
            const queryParameters = tab.url.split("?")[1];

            if (queryParameters) {
                const urlParameters = new URLSearchParams(queryParameters);
                // console.log("📩 Paramètres de l'URL:", urlParameters.toString());

                chrome.tabs.sendMessage(tabId, {
                    type: "NEW",
                    videoId: urlParameters.get("v"),
                })
            }
        }
    });
})();
