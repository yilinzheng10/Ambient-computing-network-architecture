let video;
let faceApi;
let objectDetector;
let humanDetections = [];
let catDetections = [];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Ensure the video is loaded before initializing models
  video.elt.addEventListener('loadeddata', () => {
    console.log("Video is ready.");

    // Initialize ML5 face API for human detection
    const faceOptions = { withLandmarks: true, withDescriptors: false };
    faceApi = ml5.faceApi(video, faceOptions, faceModelReady);

    // Initialize ML5 object detector for cat face detection using COCO-SSD
    objectDetector = ml5.objectDetector('cocossd', objectModelReady);
  });
}

function faceModelReady() {
  console.log("Human Face API Ready!");
  detectHumanFaces();
}

function objectModelReady() {
  console.log("Object Detector (COCO-SSD) Ready!");
  detectCatFaces();
}

function detectHumanFaces() {
  faceApi.detect((error, results) => {
    if (error) {
      console.error(error);
      return;
    }
    humanDetections = results;
    detectHumanFaces(); // Keep detecting human faces
  });
}

function detectCatFaces() {
  objectDetector.detect(video, (error, results) => {
    if (error) {
      console.error(error);
      return;
    }
    catDetections = results.filter(result => result.label.toLowerCase() === 'cat');
    detectCatFaces(); // Keep detecting cat faces
  });
}

function draw() {
  image(video, 0, 0, width, height);
  drawHumanFaces(humanDetections);
  drawCatFaces(catDetections);
}

function drawHumanFaces(detections) {
  for (let d of detections) {
    const { x, y, width, height } = d.alignedRect._box;
    noFill();
    stroke(0, 255, 0);
    strokeWeight(2);
    rect(x, y, width, height);
    fill(0, 255, 0);
    textSize(16);
    text('Human', x, y > 20 ? y - 5 : y + 15);
  }
}

function drawCatFaces(detections) {
  for (let detection of detections) {
    const { x, y, width, height } = detection;
    noFill();
    stroke(255, 0, 0);
    strokeWeight(2);
    rect(x, y, width, height);
    fill(255, 0, 0);
    textSize(16);
    text('Cat', x, y > 20 ? y - 5 : y + 15);
  }
}