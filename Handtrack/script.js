// Global variables
let video;
let model;
let canvas;
let ctx;
let circleX = 320;
let circleY = 240;

// Set up the canvas and video elements
async function setup() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas size to match the video size
    canvas.width = 640;
    canvas.height = 480;

    // Set up webcam stream
    video = document.createElement('video');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.play();
        console.log("Webcam is working, starting hand detection...");
        detectHand();
    } catch (err) {
        console.error("Error accessing webcam:", err);
        alert("Please allow camera access.");
    }

    // Load the hand tracking model
    model = await handpose.load();
    console.log("Handpose model loaded.");
}

// Hand tracking and circle movement logic
async function detectHand() {
    const predictions = await model.estimateHands(video);

    console.log("Predictions:", predictions);  // Log predictions to see what data we get

    if (predictions.length > 0) {
        const hand = predictions[0];
        const indexFinger = hand.landmarks[8]; // Index finger tip (landmark 8)

        // Move circle position based on index finger coordinates
        circleX = indexFinger[0];
        circleY = indexFinger[1];
    } else {
        console.log("No hand detected.");
    }

    // Draw the circle
    drawCircle(circleX, circleY);

    // Call detectHand again on the next animation frame
    requestAnimationFrame(detectHand);
}

// Draw the circle at the specified position
function drawCircle(x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous frame
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
}

// Start the setup when the page loads
window.onload = setup;
