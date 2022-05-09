const canvas = document.getElementById('canvas');
const input = document.getElementById('input');
const inputLabel = document.getElementById('input-label');
const submit = document.getElementById('submit');
const ctx = canvas.getContext('2d');

const image = new Image();
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const translatePos = {x: 0, y: 0};
let scale = 1.0;
const scaleMultiplier = 0.9;
const startDragOffset = {x: 0, y: 0};
let mouseDown = false;

function download() {
    const link = document.createElement('a');
    link.download = 'image512x512.png';
    link.href = canvas.toDataURL();
    link.click();
}

function hideInputLabel(imageFile) {
    if (imageFile.name.includes('png') ||
        imageFile.name.includes('jpg') ||
        imageFile.name.includes('jpeg')) {
        inputLabel.style.display = 'none';
        canvas.style.display = 'flex';
        submit.style.display = 'flex';
        image.onload = draw;
        image.src = URL.createObjectURL(imageFile);
    }
    else
        alert('Wrong file type. Try again.');
}

function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();
    ctx.translate(translatePos.x, translatePos.y);
    ctx.scale(scale, scale);
    const imageWidth = image.width;
    const imageHeight = image.height;
    const centerCoordsX = (canvasWidth - imageWidth) / 2;
    const centerCoordsY = (canvasHeight - imageHeight) / 2;

    ctx.drawImage(image, (centerCoordsX + translatePos.x) / (scale * 2),
        (centerCoordsY + translatePos.y) / (scale * 2), imageWidth, imageHeight);
    ctx.fill();
    ctx.restore();
}

input.onchange = function() {
    hideInputLabel(this.files[0]);
};

inputLabel.ondrop = function(e) {
    e.preventDefault();
    input.files = e.dataTransfer.files;
    hideInputLabel(input.files[0]);
};

inputLabel.ondragover = function(e) {
    e.preventDefault();
    this.classList.add('dragover');
};

inputLabel.ondragleave = function(e) {
    e.preventDefault();
    this.classList.remove('dragover');
};

document.onpaste = function(e){
    const file = e.clipboardData.items[0].getAsFile();
    hideInputLabel(file);
};

canvas.onwheel = function(e) {
    if (e.deltaY < 0)
        scale /= scaleMultiplier;
    else
        scale *= scaleMultiplier;
    draw();
};

canvas.onmousedown = function(e) {
    mouseDown = true;
    startDragOffset.x = e.clientX - translatePos.x;
    startDragOffset.y = e.clientY - translatePos.y;
};

document.onmouseup = function() {
    mouseDown = false;
};

document.onmousemove = function(e) {
    if (mouseDown) {
        translatePos.x = e.clientX - startDragOffset.x;
        translatePos.y = e.clientY - startDragOffset.y;
        checkSelection();
        draw();
    }
};

draw();