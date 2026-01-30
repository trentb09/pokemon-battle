// script.js
const imageInput = document.getElementById("imageInput");
const captionInput = document.getElementById("captionInput");
const fontSizeInput = document.getElementById("fontSizeInput");
const fontColorInput = document.getElementById("fontColorInput");
const strokeColorInput = document.getElementById("strokeColorInput");
const downloadBtn = document.getElementById("downloadBtn");
const canvas = document.getElementById("memeCanvas");
const ctx = canvas.getContext("2d");

let image = null;

function drawMeme() {
  if (!image) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  // Resize canvas to image dimensions
  canvas.width = image.width;
  canvas.height = image.height;

  // Draw image
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const text = captionInput.value || "";
  if (!text.trim()) return;

  const fontSize = parseInt(fontSizeInput.value, 10) || 40;
  const fontColor = fontColorInput.value || "#ffffff";
  const strokeColor = strokeColorInput.value || "#000000";

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = `bold ${fontSize}px Impact, system-ui, sans-serif`;

  const x = canvas.width / 2;
  const y = 20; // top caption; you could add controls for position

  // Outline
  ctx.lineWidth = Math.max(2, fontSize / 15);
  ctx.strokeStyle = strokeColor;
  wrapText(ctx, text.toUpperCase(), x, y, canvas.width * 0.9, fontSize, true);

  // Fill
  ctx.fillStyle = fontColor;
  wrapText(ctx, text.toUpperCase(), x, y, canvas.width * 0.9, fontSize, false);
}

// Simple text wrapping helper
function wrapText(context, text, x, y, maxWidth, lineHeight, stroke) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      if (stroke) {
        context.strokeText(line, x, currentY);
      } else {
        context.fillText(line, x, currentY);
      }
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (stroke) {
    context.strokeText(line, x, currentY);
  } else {
    context.fillText(line, x, currentY);
  }
}

// Handle image upload
imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      image = img;
      drawMeme();
      downloadBtn.disabled = false;
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// Live updates
captionInput.addEventListener("input", drawMeme);
fontSizeInput.addEventListener("input", drawMeme);
fontColorInput.addEventListener("input", drawMeme);
strokeColorInput.addEventListener("input", drawMeme);

// Download as JPEG
downloadBtn.addEventListener("click", () => {
  if (!image) return;

  const dataUrl = canvas.toDataURL("image/jpeg", 0.9); // quality 0–1
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "meme.jpg";
  link.click();
});

