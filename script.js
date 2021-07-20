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

    let link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = "image.png";
    link.click();
}

captureBtn.addEventListener("click", function(){
    capture();
})
