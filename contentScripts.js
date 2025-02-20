(()=>{
    let youtubeLeftControls, youtubPlayer;
    let currentVideo = "";
    let currentVideoBookmarks = [];

    const fetchBookmarks = async () => {
        return new Promise((resolve)=>{
            chrome.storage.sync.get([currentVideo], (obj) => {
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
        })
    })
}

    const addNewBookmarkEventHandler = async () =>{
        const currentTime = youtubPlayer.currentTime;
        const newBookmark={
            time:currentTime,
            desc:"Bookmark at "+getTime(currentTime)
        };
        
        currentVideoBookmarks = await fetchBookmarks()

        console.log(newBookmark);

        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currentVideoBookmarks,newBookmark].sort((a , b)=>a.time - b.time)  )
        })
    }

    chrome.runtime.onMessage.addListener((obj, sender, sendResponse) => {
        const {type, value,videoId} = obj;

        if(type === "NEW"){
            currentVideo = videoId;
            newVideoLoaded();
        }else if(type === "PLAY"){
            youtubPlayer.currentTime =value;

        }else if(type === "DELETE"){
            currentVideoBookmarks = currentVideoBookmarks.filter((b)=> b.time !=value);
            chrome.storage.sync.set({
                [currentVideo]: JSON.stringify(currentVideoBookmarks)
            })

            sendResponse(currentVideoBookmarks);

        }
    });

    const newVideoLoaded = async () => {
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        currentVideoBookmarks = await fetchBookmarks();

        // console.log("bookmarkBtnExists478485");
        if(!bookmarkBtnExists){
            const bookmarkBtn = document.createElement("img");

            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button "+"bookmark-btn";
            bookmarkBtn.title ="Click Here";
            
            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            youtubPlayer = document.getElementsByClassName("video-stream")[0];

            youtubeLeftControls.appendChild(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);

        }
    }

    const getTime = t => {
        var date = new Date(0);
        date.setSeconds(t);
    
        return date.toISOString().slice(11, 19);
    }
    

})()

