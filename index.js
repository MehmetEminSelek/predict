/////////////////// EMOTION RECOGNIZER///////////////
/////////////////////////////////////////////////////////////
const video = document.getElementById('webcam');
const instruction = document.getElementById('caminstruct');
const liveView = document.getElementById('liveView');
const enableWebcamButton = document.getElementById('webcamButton');
const instructionText = document.getElementById("camiText");
const webcam_canvas = document.getElementById('webcam_canvas');
const cam_ctx = webcam_canvas.getContext('2d');
const width = 360;
const height = 240;
var model = undefined;
var model_emotion = undefined;
var control = false;
var coordinates = [];
var pictures = [];
var base_url = "http://localhost:3000";
var local_url = "http://192.168.1.106:3000";
var stompClient = null;
var count = 0;

var date = new Date();

connect();

var errorCallback = function (error) {
    if (error.name == 'NotAllowedError') { instructionText.innerHTML = "Webcam Access Not Allowed"; }
    else if (error.name == 'PermissionDismissedError') { instructionText.innerHTML = "Permission Denied. Please provide Webcam Access."; }

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
}

function enableCam(event) {
    control = true;
    const constraints = {
        audio: false,
        video: { width: 360, height: 240 },
    };
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        video.srcObject = stream;
        instruction.style.display = "none";
        video.addEventListener('loadeddata', predictWebcam);
        cameraaccess = true;
        enableWebcamButton.style.display = "none";
    })
        .catch(errorCallback)
}

function connect() {
    var socket = new SockJS(local_url + '/prediction');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/engine-listen', function (message) {
            handleEngineStart(JSON.parse(message.body))
        });
    });
}

function handleEngineStart(message) {
    if (message.sender == "start" && message.sender == "GameHub") {
        predictWebcam();
    }
}

function sendValues(valueObj_Affect, valueObj_Raf) {
    stompClient.send("/prediction", {}, JSON.stringify(valueObj_Raf));
    stompClient.send("/prediction", {}, JSON.stringify(valueObj_Affect));
}

function getUserMediaSupported() {
    return (navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia);
}
if (getUserMediaSupported()) {

    if (model && model_emotion) {
        enableWebcamButton.style.display = "inline-flex";
        instructionText.innerHTML = "Please provide Webcam Access."
    }

    else {
        blazeface.load().then(function (loadedModel) {
            model = loadedModel;
            if (model_emotion) {
                enableWebcamButton.style.display = "inline-flex";
                instructionText.innerHTML = "Please provide Webcam Access."
            }
        });

        tf.loadLayersModel('/tf_models/mobile/model.json', false).then(function (loadedModel) {
            model_emotion = loadedModel;
            if (model) {
                enableWebcamButton.classList.remove("removed");
                instructionText.innerHTML = "Please provide Webcam Access."
            }
        });
    }
    enableWebcamButton.addEventListener('click', enableCam);

} else {
    console.warn('getUserMedia() is not supported by your browser');
    instructionText.innerHTML = "getUserMedia() is not supported by your browser"
}

webgazer.setGazeListener(function (data, elapsedTime) {
    if (data == null) {
        return;
    }
    var xprediction = data.x; //these x coordinates are relative to the viewport
    var yprediction = data.y; //these y coordinates are relative to the viewport //elapsed time is based on time since begin was called
    coordinate_Obj = {
        "x": xprediction,
        "y": yprediction,
    }
    if (data = ! null) {
        document.getElementById("webgazerVideoContainer").style.display = "none";
    }
}).begin();

async function predictWebcam() {
    const model_Raf = await tf.loadLayersModel("/tf_models/adam/model.json", false)
    const model_Affectnet = await tf.loadLayersModel("/tf_models/mobile/model.json", false)
    cam_ctx.drawImage(video, 0, 0, width, height);
    const frame = cam_ctx.getImageData(0, 0, width, height);
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
            var image_tensor = tf.browser.fromPixels(frame2);
            image_tensor = image_tensor.div(255);
            image_tensor = image_tensor.resizeBilinear([224, 224]).toFloat().expandDims();
            const result_Raf = model_Raf.predict(image_tensor);
            const result_Affect = model_Affectnet.predict(image_tensor);
            const predicted_Raf = result_Raf.arraySync();
            const predicted_Affect = result_Affect.arraySync();
            valueObj_Raf = {
                "id": count,
                "sender": "AMINI SİKİM",
                "experimentCount": "1",
                "model": "Raf",
                "neutral": parseFloat(predicted_Raf[0][4] * 100).toFixed(2),
                "happy": parseFloat(predicted_Raf[0][3] * 100).toFixed(2),
                "sad": parseFloat(predicted_Raf[0][5] * 100).toFixed(2),
                "angry": parseFloat(predicted_Raf[0][0] * 100).toFixed(2),
                "fear": parseFloat(predicted_Raf[0][2] * 100).toFixed(2),
                "surprise": parseFloat(predicted_Raf[0][6] * 100).toFixed(2),
                "disgust": parseFloat(predicted_Raf[0][1] * 100).toFixed(2),

            }
            valueObj_Affect = {
                "id": count,
                "sender": "AMINI GÖTÜNÜ SİKİM YARRAĞIMIN KAFASI",
                "experimentCount": "1",
                "model": "Affectnet",
                "neutral": parseFloat(predicted_Affect[0][4] * 100).toFixed(2),
                "happy": parseFloat(predicted_Affect[0][3] * 100).toFixed(2),
                "sad": parseFloat(predicted_Affect[0][5] * 100).toFixed(2),
                "angry": parseFloat(predicted_Affect[0][0] * 100).toFixed(2),
                "fear": parseFloat(predicted_Affect[0][2] * 100).toFixed(2),
                "surprise": parseFloat(predicted_Affect[0][6] * 100).toFixed(2),
                "disgust": parseFloat(predicted_Affect[0][1] * 100).toFixed(2),

            }
            caches.delete(model_Raf);
            caches.delete(model_Affectnet);
            sendValues(valueObj_Affect, valueObj_Raf);
            if (control) {
                window.requestAnimationFrame(predictWebcam);
            }
        }

    });
}


document.addEventListener('scroll', function (e) {
    if (control && (window.scrollY < 5400 || window.scrollY > 6000))
        resetEverything()
})
