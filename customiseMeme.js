const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');

var selectedImgSrc;

let dragging = false;
let textX1 = 50,
    textY1 = 50;
let textX2 = 50,
    textY2 = 100;

function loadUserImage() {
    // Get User input file
    var file = document.getElementById('userImageInput').files[0];
    // If file exists...
    if (file) {
        // Create new file reader
        var reader = new FileReader();
        // Assign function on 'onload event'
        reader.onload = function(e) {
            loadTemplate(e.target.result);
        };
        // Read file
        reader.readAsDataURL(file);
    }
}

function loadTemplate(src) {
    // Assign the source of the selected template to the global variable
    const img = new Image();
    img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        selectedImgSrc = src;
        generateMeme(); // Call generateMeme after the image is drawn
    };
    img.src = src;
}

function generateMeme() {
    console.log("generating meme");
    const img = new Image();
    img.onload = function () {
        // Set max size by scale.
        let scale = Math.min(500 / img.width, 500 / img.height);
        let width = img.width * scale;
        let height = img.height * scale;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
    };
    img.src = document.getElementById('userImageInput').files.length > 0 ? URL.createObjectURL(document.getElementById('userImageInput').files[0]) : selectedImgSrc;
}