/* ===============================
   LOCK REVEAL – ANDROID APK ONLY
   Optimizado para:
   - Samsung
   - WebIntoApp
   - Vibración estable
   =============================== */

let pin = "";
let pinLength = 4;
let trainingMode = false;

/* ELEMENTOS */
const dotsContainer = document.getElementById("dots");
const pinView = document.getElementById("pin-view");
const panel = document.getElementById("training-panel");
const lengthSelector = document.getElementById("pin-length");
const secretZone = document.getElementById("secret-zone");

/* ===============================
   RENDER DOTS
   =============================== */
function renderDots() {
  dotsContainer.innerHTML = "";
  for (let i = 0; i < pinLength; i++) {
    const dot = document.createElement("span");
    if (i < pin.length) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  }
}
renderDots();

/* ===============================
   TECLADO
   =============================== */
document.querySelectorAll(".key").forEach(btn => {
  btn.addEventListener("touchstart", () => {
    if (pin.length < pinLength) {
      pin += btn.textContent;
      renderDots();
      if (pinView) pinView.textContent = pin.padEnd(pinLength, "-");
    }
  });
});

/* ===============================
   VIBRATION CORE (ANDROID SAFE)
   =============================== */
function wakeVibrationMotor() {
  // Pulso corto inicial (CRÍTICO en Samsung)
  navigator.vibrate(30);
}

function vibratePin() {
  if (!("vibrate" in navigator)) return;

  wakeVibrationMotor();

  let pattern = [];

  for (let digit of pin) {
    let pulses = parseInt(digit);

    // seguridad
    if (isNaN(pulses)) continue;

    for (let i = 0; i < pulses; i++) {
      pattern.push(120); // vibrar
      pattern.push(80);  // pausa
    }

    // separador entre dígitos
    pattern.push(350);
  }

  // vibración final de confirmación
  pattern.push(200);

  navigator.vibrate(pattern);
}

/* ===============================
   GESTO SECRETO – HOLD 4s
   =============================== */
let holdTimer = null;

secretZone.addEventListener("touchstart", () => {
  // IMPORTANTE: interacción directa
  holdTimer = setTimeout(() => {
    vibratePin();
  }, 4000);
});

secretZone.addEventListener("touchend", () => {
  clearTimeout(holdTimer);
});

/* ===============================
   MODO ENTRENAMIENTO (3 taps)
   =============================== */
let tapCount = 0;
let tapTimer = null;

secretZone.addEventListener("touchstart", () => {
  tapCount++;

  clearTimeout(tapTimer);
  tapTimer = setTimeout(() => {
    tapCount = 0;
  }, 600);

  if (tapCount === 3) {
    toggleTraining(true);
    tapCount = 0;
  }
});

function toggleTraining(state) {
  trainingMode = state;
  if (panel) panel.style.display = state ? "block" : "none";
}

/* ===============================
   OPCIONES ENTRENAMIENTO
   =============================== */
if (lengthSelector) {
  lengthSelector.addEventListener("change", e => {
    pinLength = parseInt(e.target.value);
    pin = "";
    renderDots();
    if (pinView) pinView.textContent = "-".repeat(pinLength);
  });
}

const testBtn = document.getElementById("test-vibration");
if (testBtn) testBtn.onclick = vibratePin;

const resetBtn = document.getElementById("reset-pin");
if (resetBtn) resetBtn.onclick = () => {
  pin = "";
  renderDots();
  if (pinView) pinView.textContent = "-".repeat(pinLength);
};

/* ===============================
   ANDROID WAKE (FOCUS FIX)
   =============================== */
// Soluciona casos Samsung donde la vibración
// no responde en primer uso
document.body.addEventListener("touchstart", () => {
  navigator.vibrate(1);
}, { once: true });
