import { getActiveTabURL } from "./utils.js";

const addNewBookmarker = (bookmarksElement,bookmark) => {
    const bookmarkTitleElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");
    const commentElement = document.createElement("div");

    bookmarkTitleElement.innerHTML = bookmark.desc; 
    newBookmarkElement.className= "bookmark-title";

    commentElement.className="bookmark-controls";

    newBookmarkElement.id = "bookmark-"+bookmark.time;
    newBookmarkElement.className= "bookmark";
    newBookmarkElement.setAttribute("timestamp",bookmark.time); 

    setBookmarksAttributes("play",onPlaye,commentElement);
    setBookmarksAttributes("delete",onDelete,commentElement);

    newBookmarkElement.appendChild(bookmarkTitleElement);  
    newBookmarkElement.appendChild(commentElement); 
    bookmarksElement.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentVideoBookmarks=[]) => {
    const bookmarksElement = document.getElementById("bookmarks");
    bookmarksElement.innerHTML = "";

    if(currentVideoBookmarks.length > 0) {
        for(let i = 0;i < currentVideoBookmarks.length;i++) {
            const bookmark = currentVideoBookmarks[i];
            addNewBookmarker(bookmarksElement, bookmark) ;
        }
    }else{
        bookmarksElement.innerHTML = "No bookmarks available";
    }
}; 

const onPlaye = async e => {
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const activetab = await getActiveTabURL();

    chrome.tabs.sendMessage(activetab.id, {
        type: "PLAY",
        value: bookmarkTime,
    })
};

const onDelete = async e  => {
    const activetab = await getActiveTabURL();
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const bookmarkElementToDelete = document.getElementById("bookmark-"+bookmarkTime);

    bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);

    chrome.tabs.sendMessage(activetab.id, {
        type: "DELETE",
        value: bookmarkTime,
    },viewBookmarks)
};

const setBookmarksAttributes = (src,eventListener,controlParentElement) => {
    const controlElement = document.createElement("img");

    controlElement.src = "assets/"+ src + ".png";
    controlElement.title=src;
    controlElement.addEventListener("click",eventListener);
    controlParentElement.appendChild(controlElement);
};


document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getActiveTabURL();
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    const currentVideo = urlParameters.get("v");

    if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
        chrome.storage.sync.get([currentVideo], (data) => {
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];

            viewBookmarks(currentVideoBookmarks);
        })
    }else{
        const container = document.getElementsByClassName("container")[0];
        container.innerHTML = `<h1>Please open a YouTube video to bookmark it</h1>`;
    }
});