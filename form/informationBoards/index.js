var video = document.querySelector("#videoElement");

// if (navigator.mediaDevices.getUserMedia) {
//   navigator.mediaDevices.getUserMedia({ video: true })
//     .then(function (stream) {
//       video.srcObject = stream;
//     })
//     .catch(function (err0r) {
//       console.log("Something went wrong!");
//     });
// }


startWebgazer();

function startWebgazer() {
    webgazer
        .showVideo(true)
        .setGazeListener(function (data, clock) {
            if (data != null) {
                xprediction = data.x;
                yprediction = data.y;
            }
        })
        .showPredictionPoints(false)
        .begin()
}
