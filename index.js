const video = document.getElementById('webcam');
const instruction = document.getElementById('caminstruct');
const enableWebcamButton = document.getElementById('webcamButton');
const instructionText = document.getElementById("camiText");
const webcam_canvas = document.getElementById('webcam_canvas');
const width = 640
const height = 480
var model = undefined;
var raf_model = undefined;
var affect_model = undefined;
var control = false;
var testSubjectName = "Unknown";
var experimentNo = 0;
var count = 0;
var gameData = "running";
const base_url = "https://wafer-backend.com:443";
//const base_url = "http://localhost:443";
xprediction = 0;
yprediction = 0;

connect();
startWebgazer();

function startWebgazer() {
    webgazer
        .showVideo(false)
        .setGazeListener(function (data, clock) {
            if (data != null) {
                xprediction = data.x;
                yprediction = data.y;
            }
        })
        .showPredictionPoints(false)
        .begin()
}

function connect() {
    var socket = new SockJS(base_url + '/prediction');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/engine-listen', function (message) {
            handleEngineMessages(JSON.parse(message.body))
        });
    });
}

async function handleEngineMessages(message) {
    if (message.message == "start" && message.sender == "engine") {
        enableCam();
        testSubjectName = message.testSubjectName;
        experimentNo = message.experimentNo;
    } else if (message.message == "stop" && message.sender == "engine") {
        await new Promise(r => setTimeout(r, 2000));
        resetEverything();
    } else if (message.message != "running" && message.sender == "data") {
        gameData = message.message
    }
}

function sendValues(value) {
    stompClient.send("/prediction", {}, JSON.stringify(value));
}

var errorCallback = function (error) {
    if (error.name == 'NotAllowedError') { instructionText.innerHTML = "Webcam Access Not Allowed"; }
    else if (error.name == 'PermissionDismissedError') { instructionText.innerHTML = "Permission Denied. Per favore, attendi che l'esaminatore arrivi per un ultimo controllo."; }

};

function resetEverything() {
    control = false;
    console.log("Stopping Everything.")
    const stream = video.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(function (track) {
        track.stop();
    });

    video.srcObject = null;
    instruction.style.display = "flex";
    document.getElementById("cam_chart_main").style.left = "-225px";

}

function enableCam(event) {
    control = true;
    const constraints = {
        audio: false,
        video: { width: 640, height: 480 },
    };
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        video.srcObject = stream;
        instruction.style.display = "none";
        document.getElementById("cam_chart_main").style.left = 0;
        video.addEventListener('loadeddata', predictWebcam);
        cameraaccess = true;
    })
        .catch(errorCallback)
}

function getUserMediaSupported() {
    return (navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia);
}
if (getUserMediaSupported()) {

    if (model && (raf_model || affect_model)) {
        enableWebcamButton.style.display = "inline-flex";
        instructionText.innerHTML = "Per favore, attendi che l'esaminatore arrivi per un ultimo controllo."
    }

    else {
        blazeface.load().then(function (loadedModel) {
            model = loadedModel;
            if (raf_model || affect_model) {
                enableWebcamButton.style.display = "inline-flex";
                instructionText.innerHTML = "Per favore, attendi che l'esaminatore arrivi per un ultimo controllo."
            }
        });

        tf.loadLayersModel('/tf_models/raf/model.json', false).then(function (loadedModel) {
            raf_model = loadedModel;
            if (model) {
                enableWebcamButton.classList.remove("removed");
                instructionText.innerHTML = "Per favore, attendi che l'esaminatore arrivi per un ultimo controllo."
            }
        });

        tf.loadLayersModel('/tf_models/affect_raf/model.json', false).then(function (loadedModel) {
            affect_model = loadedModel;
            if (model) {
                enableWebcamButton.classList.remove("removed");
                instructionText.innerHTML = "Per favore, attendi che l'esaminatore arrivi per un ultimo controllo."
            }
        });
    }
    enableWebcamButton.addEventListener('click', enableCam);
} else {
    console.warn('getUserMedia() is not supported by your browser');
    instructionText.innerHTML = "getUserMedia() is not supported by your browser"
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}



async function predictWebcam() {
    const cam_ctx = webcam_canvas.getContext('2d');
    await sleep(300);
    cam_ctx.drawImage(video, 0, 0, width, height);
    await sleep(300);
    const frame = cam_ctx.getImageData(0, 0, width, height);
    await sleep(300);
    model.estimateFaces(frame).then(function (predictions) {
        if (predictions.length === 1) {
            count++;
            landmark = predictions[0]['landmarks'];
            nosex = landmark[2][0];
            nosey = landmark[2][1];
            right = landmark[4][0];
            left = landmark[5][0];
            length = (left - right) / 2 + 5;
            const frame2 = cam_ctx.getImageData(nosex - length, nosey - length, 2 * length, 2 * length);
            var image_tensor = tf.browser.fromPixels(frame2).div(255).resizeBilinear([224, 224]).toFloat().expandDims();
            var result = raf_model.predict(image_tensor);
            var predictedValue = result.arraySync();
            var date = new Date();
            var currentTime = date.toLocaleString() + ":" + date.getMilliseconds();
            value_raf = {
                "id": count,
                "sender": testSubjectName,
                "experimentCount": experimentNo,
                "model": "Raf",
                "neutral": parseFloat(predictedValue[0][4] * 100).toFixed(2),
                "happy": parseFloat(predictedValue[0][3] * 100).toFixed(2),
                "sad": parseFloat(predictedValue[0][5] * 100).toFixed(2),
                "angry": parseFloat(predictedValue[0][0] * 100).toFixed(2),
                "fear": parseFloat(predictedValue[0][2] * 100).toFixed(2),
                "surprise": parseFloat(predictedValue[0][6] * 100).toFixed(2),
                "disgust": parseFloat(predictedValue[0][1] * 100).toFixed(2),
                "xcord": xprediction.toFixed(2),
                "ycord": yprediction.toFixed(2),
                "timeStamp": currentTime.toString(),
                "status": gameData
            }
            result = affect_model.predict(image_tensor);
            predictedValue = result.arraySync();
            value_affect = {
                "id": count,
                "sender": testSubjectName,
                "experimentCount": experimentNo,
                "model": "Affectnet",
                "neutral": parseFloat(predictedValue[0][4] * 100).toFixed(2),
                "happy": parseFloat(predictedValue[0][3] * 100).toFixed(2),
                "sad": parseFloat(predictedValue[0][5] * 100).toFixed(2),
                "angry": parseFloat(predictedValue[0][0] * 100).toFixed(2),
                "fear": parseFloat(predictedValue[0][2] * 100).toFixed(2),
                "surprise": parseFloat(predictedValue[0][6] * 100).toFixed(2),
                "disgust": parseFloat(predictedValue[0][1] * 100).toFixed(2),
                "xcord": xprediction.toFixed(2),
                "ycord": yprediction.toFixed(2),
                "timeStamp": currentTime.toString(),
                "status": gameData
            }
            sendValues(value_raf);
            sendValues(value_affect);
            gameData = "running";
        }
        if (control)
            window.requestAnimationFrame(predictWebcam);
    });
}
document.addEventListener('scroll', function (e) {
    if (control && (window.scrollY < 5400 || window.scrollY > 6000))
        resetEverything()
})