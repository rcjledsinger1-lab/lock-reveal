let pin = "";
let pinLength = 4;
let trainingMode = false;

const dotsContainer = document.getElementById("dots");
const pinView = document.getElementById("pin-view");
const panel = document.getElementById("training-panel");
const lengthSelector = document.getElementById("pin-length");

function renderDots() {
  dotsContainer.innerHTML = "";
  for (let i = 0; i < pinLength; i++) {
    const dot = document.createElement("span");
    if (i < pin.length) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  }
}
renderDots();

document.querySelectorAll(".key").forEach(btn => {
  btn.addEventListener("click", () => {
    if (pin.length < pinLength) {
      pin += btn.textContent;
      renderDots();
      pinView.textContent = pin.padEnd(pinLength, "-");
    }
  });
});

/* 🔐 GESTO SECRETO CLOSE-UP */
let holdTimer;
const secretZone = document.getElementById("secret-zone");

secretZone.addEventListener("touchstart", () => {
  holdTimer = setTimeout(() => {
    if (trainingMode) toggleTraining(false);
    vibratePin();
  }, 4000);
});

secretZone.addEventListener("touchend", () => {
  clearTimeout(holdTimer);
});

/* 📳 VIBRACIÓN */
function vibratePin() {
  if (!navigator.vibrate) return;

  let pattern = [];
  for (let d of pin) {
    let n = parseInt(d);
    for (let i = 0; i < n; i++) {
      pattern.push(120, 80);
    }
    pattern.push(300);
  }
  navigator.vibrate(pattern);
}

/* 🧠 MODO ENTRENAMIENTO (doble tap rápido arriba izquierda) */
let tapCount = 0;
secretZone.addEventListener("touchstart", () => {
  tapCount++;
  setTimeout(() => tapCount = 0, 600);
  if (tapCount === 3) toggleTraining(true);
});

function toggleTraining(state) {
  trainingMode = state;
  panel.style.display = state ? "block" : "none";
}

/* OPCIONES ENTRENAMIENTO */
lengthSelector.addEventListener("change", e => {
  pinLength = parseInt(e.target.value);
  pin = "";
  renderDots();
  pinView.textContent = "-".repeat(pinLength);
});

document.getElementById("test-vibration").onclick = vibratePin;
document.getElementById("reset-pin").onclick = () => {
  pin = "";
  renderDots();
  pinView.textContent = "-".repeat(pinLength);
};
