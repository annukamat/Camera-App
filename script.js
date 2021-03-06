// let constraints = {video : true, audio: true};
let constraints = {video : true};

let videoPlayer = document.querySelector("video");
let videoRecordBtn = document.querySelector("#record-video-btn");
let captureBtn = document.querySelector("#click-picture-btn");

let mediaRecorder;
let chunks = [];
let recordState = false;


videoRecordBtn.addEventListener("click", function(){
    if(!recordState){
        mediaRecorder.start();
        recordState = true;
        videoRecordBtn.innerText = "Recording";
    }else{
        mediaRecorder.stop();
        recordState = false;
        videoRecordBtn.innerText = "Record";
    }
})

navigator.mediaDevices.getUserMedia(constraints)
.then(function(mediaStream){
    videoPlayer.srcObject = mediaStream;
    mediaRecorder = new MediaRecorder(mediaStream);

    mediaRecorder.ondataavailable = function(e){
        chunks.push(e.data);
    }

    mediaRecorder.onstop = function() {
        let blob = new Blob(chunks, {type: "video/mp4"});
        chunks = [];
        let blobUrl = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = blobUrl;
        a.download = "temp.mp4";
        a.click();
    }
})

function capture(){
    let canvas = document.createElement("canvas");
    canvas.width = videoPlayer.videoWidth;
    canvas.height = videoPlayer.videoHeight;

    let ctx = canvas.getContext("2d");
    ctx.drawImage(videoPlayer, 0, 0);
    if(filter != ""){
        ctx.fillStyle = filter;
        ctx.fillRect(0,0, canvas.width, canvas.height);
    }

    let link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = "image.png";
    link.click();
}

captureBtn.addEventListener("click", function(){
    capture();
})

let filter = "";
let allFilters = document.querySelectorAll(".filter");
for(let i of allFilters){
    i.addEventListener("click", function(e){
        filter = e.currentTarget.style.backgroundColor;
        addFilterToScreen(filter);
    })
}


function addFilterToScreen(filter){
    let prevScreenFilter = document.querySelector(".screen-filter");
    if(prevScreenFilter){
        prevScreenFilter.remove();
    }

    let filterScreen = document.createElement("div");
    filterScreen.classList.add("screen-filter");
    filterScreen.style.height = videoPlayer.offsetHeight + "px";
    filterScreen.style.width = videoPlayer.offsetWidth + "px";
    filterScreen.style.backgroundColor = filter;
    
    document.querySelector(".filter-screen-parent").append(filterScreen);
}