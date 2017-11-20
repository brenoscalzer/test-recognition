// SDK Needs to create video and canvas nodes in the DOM in order to function
// Here we are adding those nodes a predefined div.
var divRoot = $("#affdex_elements")[0];
var width = 640;
var height = 480;
var faceMode = affdex.FaceDetectorMode.LARGE_FACES;
//Construct a CameraDetector and specify the image width / height and face detector mode.
var detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

function log(node_name, msg) {
    $(node_name).append("<span>" + msg + "</span><br />")
}

function startApp() {
    console.log('Starting detector');
    divRoot = $("#affdex_elements")[0];
    width = 640;
    height = 480;
    faceMode = affdex.FaceDetectorMode.LARGE_FACES;
    //Construct a CameraDetector and specify the image width / height and face detector mode.
    detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

    // console.log(divRoot, width, height, faceMode, detector);

    detector.addEventListener("onInitializeSuccess", function() {
        log('#logs', "The detector reports initialized");
        //Display canvas instead of video feed because we want to draw the feature points on it
        $("#face_video_canvas").css("display", "block");
        $("#face_video").css("display", "none");
    });

    detector.addEventListener("onWebcamConnectSuccess", function() {
        log('#logs', "Webcam access allowed");
    });

    //Add a callback to notify when camera access is denied
    detector.addEventListener("onWebcamConnectFailure", function() {
        log('#logs', "webcam denied");
        console.log("Webcam access denied");
    });

    //Add a callback to notify when detector is stopped
    detector.addEventListener("onStopSuccess", function() {
        log('#logs', "The detector reports stopped");
        $("#results").html("");
    });

    detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
        $('#results').html("");
        log('#results', "Timestamp: " + timestamp.toFixed(2));
        log('#results', "Number of faces found: " + faces.length);
        if (faces.length > 0) {
            log('#results', "Appearance: " + JSON.stringify(faces[0].appearance));
            log('#results', "Emotions: " + JSON.stringify(faces[0].emotions, function(key, val) {
                return val.toFixed ? Number(val.toFixed(0)) : val;
            }));
            log('#results', "Expressions: " + JSON.stringify(faces[0].expressions, function(key, val) {
                return val.toFixed ? Number(val.toFixed(0)) : val;
            }));
            log('#results', "Emoji: " + faces[0].emojis.dominantEmoji);
            drawFeaturePoints(image, faces[0].featurePoints);
        }
    });

    detector.detectAllEmotions();
    detector.detectAllExpressions();
    detector.detectAllEmojis();
    detector.detectAllAppearance();
}

//function executes when Start button is pushed.
function onStart() {
    console.log(detector);
    if (detector && !detector.isRunning) {
        // console.log("ENTROU DIAXO");
        // $("#logs").html("");
        detector.start();
    }
    console.log("Clicked the start button");
}

//function executes when the Stop button is pushed.
function onStop() {
    log('#logs', "Clicked the stop button");
    if (detector && detector.isRunning) {
        detector.removeEventListener();
        detector.stop();
    }
};

//function executes when the Reset button is pushed.
function onReset() {
    log('#logs', "Clicked the reset button");
    if (detector && detector.isRunning) {
        detector.reset();

        $('#results').html("");
    }
};

//Draw the detected facial feature points on the image
function drawFeaturePoints(img, featurePoints) {
    var contxt = $('#face_video_canvas')[0].getContext('2d');
    var hRatio = contxt.canvas.width / img.width;
    var vRatio = contxt.canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);

    contxt.strokeStyle = "#FFFFFF";
    for (var id in featurePoints) {
        contxt.beginPath();
        contxt.arc(featurePoints[id].x,
        featurePoints[id].y, 2, 0, 2 * Math.PI);
        contxt.stroke();
    }
}
