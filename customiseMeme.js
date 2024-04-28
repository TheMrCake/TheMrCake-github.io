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
    selectedImgSrc = src;
    generateMeme();

}

function generateMeme() {
    const img = new Image();
    img.onload = function () {
        // Set max size by scale.
        let scale = Math.min(500 / img.width, 500 / img.height);
        let width = img.width * scale;
        let height = img.height * scale;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        drawText();
    };
    img.src = selectedImgSrc;
}

function drawText() {
    var font = document.getElementById('fontSizeInput').value + 'px ' + document.getElementById('fontInput').value;
    // Load font and font size asynchronously
    document.fonts.load(font).then(function() {
        // Then set the context font and textbox positions.
        ctx.font = font;
        ctx.fillStyle = document.getElementById('colorInput').value;
        ctx.fillText(document.getElementById('textInput1').value, textX1, textY1);
        ctx.fillText(document.getElementById('textInput2').value, textX2, textY2);
    });
}