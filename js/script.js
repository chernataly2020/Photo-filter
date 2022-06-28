const panelButtons = document.querySelector(".btn-container");
const BUTTON = document.querySelectorAll(".btn");
const filters = document.querySelectorAll(".filters label");
const inputs = document.querySelectorAll(".filters input");
const outputs = document.querySelectorAll(".filters output");
const base =  "https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/";
const images = [
  "01.jpg",
  "02.jpg",
  "03.jpg",
  "05.jpg",
  "06.jpg",
  "07.jpg",
  "08.jpg",
  "09.jpg",
  "10.jpg",
  "11.jpg",
  "12.jpg",
  "13.jpg",
  "14.jpg",
  "15.jpg",
  "16.jpg",
  "17.jpg",
  "18.jpg",
  "19.jpg",
  "20.jpg",
];
let i = 0;
const image = document.querySelector(".image");
const btn = document.querySelector(".btn-next");
const fileInput = document.querySelector('input[type="file"]');
const imageContainer = document.querySelector(".image-container");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const btnDownload = document.querySelector(".btn-save");
const buttonReset = document.querySelector(".btn-reset");

// reset filters
buttonReset.addEventListener("click", function () {
  document.documentElement.removeAttribute("style");

  inputs.forEach((input) => {
    input.value = input.defaultValue;
  });

  outputs.forEach((output) => {
    output.value = output.defaultValue;
  });
});


// change filters
filters.forEach((el) => {
  const input = el.querySelector("input");
  const output = el.querySelector("output");

  input.addEventListener("input", (e) => {
    let value = e.target.value;
    const sizing = e.target.dataset.sizing;
    output.value = value + sizing;

    document.documentElement.style.setProperty(
      `--${e.target.name}`,
      output.value
    );
  });
});

// next picture
function viewImage(src) {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    image.src = src;
  };
}

function getTimeOfDay() {
  const data = new Date();
  const hour = data.getHours();
  if (hour >= 6 && hour < 12) {
    return "morning";
  }
  if (hour >= 12 && hour < 18) {
    return "day";
  }
  if (hour >= 18 && hour < 24) {
    return "evening";
  } else {
    return "night";
  }
}

function getImage() {
  const index = i % images.length;
  const imageSrc = base + getTimeOfDay() + "/" + images[index];
  viewImage(imageSrc);
  i++;
  btn.disabled = true;
  setTimeout(function () {
    btn.disabled = false;
  }, 1000);
}

//load picture
function loadImage() {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    image.src = reader.result;
  };
  fileInput.value = null;
}

//download picture
function downloadImage() {
  const img = new Image();
  img.setAttribute("crossOrigin", "anonymous");
  img.src = image.src;
  img.addEventListener("load", () => {
    canvas.width = img.width;
    canvas.height = img.height;

    let h;
    if (image.height > image.naturalHeight) {
      h = image.height / image.naturalHeight;
    } else {
      h = image.naturalHeight / image.height;
    }
    let filter = window.getComputedStyle(image).filter;
    const blur = filter.split(" ")[0].match(/\d{1,}/)[0];
    const newFilter = window
      .getComputedStyle(image)
      .filter.replace(/blur\([0-9]*px\)/, `blur(${blur * h}px)`);
    ctx.filter = newFilter;
    ctx.drawImage(img, 0, 0);
    const url = canvas.toDataURL();
    saveImage(url);
  });
}

function toggleBtnDown(event) {
  BUTTON.forEach((el) => {
    if (el.classList.contains("btn-active")) {
      el.classList.remove("btn-active");
    }
    event.target.classList.add("btn-active");
  });
}

function toggleBtnUp(event) {
  BUTTON.forEach((el) => {
    if (el.classList.contains("btn-active")) {
      el.classList.remove("btn-active");
    }
    event.target.classList.remove("btn-active");
  });
}

function saveImage(url) {
  const link = document.createElement("a");
  link.download = `image.png`;
  link.href = url;
  link.click();
  link.delete;
}

//fullscreen
document.addEventListener(
  "click",
  function (event) {
    if (event.target.classList.contains("fullscreen")) {
      toggleFullScreen();
    }
  },
  false
);

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

const colorPicker = document.querySelector('#base');
const el = document.querySelectorAll('.header-title');
const im = document.querySelectorAll('.image')


colorPicker.addEventListener('change', function() {
  Array.from(el).forEach(v => v.style.color = this.value);
  Array.from(im).forEach(v => v.style.borderColor = this.value);
});
colorPicker.addEventListener('click', function() {
  Array.from(el).forEach(v => v.style.color = this.value);
  Array.from(im).forEach(v => v.style.borderColor = this.value);
});

colorPicker.addEventListener('mousemove', function() {
  Array.from(el).forEach(v => v.style.color = this.value);
  Array.from(im).forEach(v => v.style.borderColor = this.value);
});



panelButtons.addEventListener("mousedown", toggleBtnDown);
panelButtons.addEventListener("mouseup", toggleBtnUp);
btn.addEventListener("click", getImage);
fileInput.addEventListener("change", loadImage);
btnDownload.addEventListener("click", downloadImage);