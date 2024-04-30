// Get imgSrc from query content
const urlParams = new URLSearchParams(window.location.search);
let selectedImgSrc = urlParams.get('imgSrc');

// Init variables
const canvas = document.getElementById('meme-canvas');
const ctx = canvas.getContext('2d');

let isDragging = false;
let currentText;

let textX1 = 50,
    textY1 = 50;
let textX2 = 50,
    textY2 = 100;

generateMeme();

// Load User enetered background image
function loadUserImage() {
    // Get User input file
    var file = document.getElementById('user-image-input').files[0];
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

// Load template from example
function loadTemplate(src) {
    selectedImgSrc = src;
    generateMeme();

}

// Reload meme
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

// Reload meme text
function drawText() {
    var font = document.getElementById('font-size-input').value + 'px ' + document.getElementById('font-input').value;
    // Load font and font size asynchronously
    document.fonts.load(font).then(function() {
        // Then set the context font and textbox positions.
        ctx.font = font;
        ctx.fillStyle = document.getElementById('color-input').value;
        ctx.fillText(document.getElementById('text-input1').value, textX1, textY1);
        ctx.fillText(document.getElementById('text-input2').value, textX2, textY2);
    });
}

// Save meme to user's device
function saveMeme() {
    // Creates data blob with callback to download as png
    canvas.toBlob(function(blob) {
        var link = document.createElement('a');
        link.download = 'meme.png';
        link.href = URL.createObjectURL(blob);
        link.click();
    });
}

// Begin dragging and pass onclick event to function
function startDrag(e) {
    // Get x, y coords of cursour relative to canvas
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    let textBox1Width = ctx.measureText(document.getElementById('text-input1').value).width;
    let textBox2Width = ctx.measureText(document.getElementById('text-input2').value).width;

    let textBoxHeight = parseInt(document.getElementById('font-size-input').value);

    // If cursor is over textbox1, set that to current textbox
    if (x >= textX1 && x <= textX1 + textBox1Width && y >= textY1 - textBoxHeight && y <= textY1) {
        isDragging = true;
        currentText = 'text1';
    } // Otherwise, if cursor is over textbox 2, set that to current textbox
    else if (x >= textX2 && x <= textX2 + textBox2Width && y >= textY2 - textBoxHeight && y <= textY2) {
        isDragging = true;
        currentText = 'text2';
    }
}

// Keep dragging by updating textbox to cursor position
function dragText(e) {
    // If currently dragging
    if (isDragging) {
        // Get cursor relative to canvas position
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        let textBox1Width = ctx.measureText(document.getElementById('text-input1').value).width;
        let textBox2Width = ctx.measureText(document.getElementById('text-input2').value).width;

        let textBoxHeight = parseInt(document.getElementById('font-size-input').value);

        // Clamp current textbox position to inside the visible canvas, while following the cursor
        if (currentText === 'text1') {
            textX1 = Math.min(Math.max(x, 0), canvas.width - textBox1Width);
            textY1 = Math.min(Math.max(y, textBoxHeight), canvas.height);
        }
        else if (currentText === 'text2') {
            textX2 = Math.min(Math.max(x, 0), canvas.width - textBox2Width);
            textY2 = Math.min(Math.max(y, textBoxHeight), canvas.height);
        }
        // Reload meme.
        generateMeme();
    }
}

// Stop dragging, I mean it's kinda obvious
function stopDrag() {
    isDragging = false;
}