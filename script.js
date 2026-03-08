const introScene = document.getElementById("intro-scene");
const celebrationScene = document.getElementById("celebration-scene");
const moonButton = document.getElementById("moon-button");
const bookCard = document.getElementById("book-card");
const typewriter = document.getElementById("typewriter");
const songToggle = document.getElementById("song-toggle");

const greetingText =
  "Semoga Syawal ini membawa rahmat, kebahagiaan,\nkeampunan dan rezeki yang melimpah.\n\nMaaf zahir & batin daripada kami sekeluarga. 🌙✨";

let typingIndex = 0;
let typingTimer;
let audioContext;
let musicInterval;
let isPlaying = false;

function showCelebration() {
  introScene.classList.remove("active");
  celebrationScene.classList.add("active");

  setTimeout(() => {
    bookCard.classList.add("show");
    startTypewriter();
  }, 600);
}

function startTypewriter() {
  clearInterval(typingTimer);
  typewriter.textContent = "";
  typingIndex = 0;

  typingTimer = setInterval(() => {
    if (typingIndex >= greetingText.length) {
      clearInterval(typingTimer);
      return;
    }

    typewriter.textContent += greetingText[typingIndex];
    typingIndex += 1;
  }, 45);
}

function ensureAudioContext() {
  if (!audioContext) {
    audioContext = new window.AudioContext();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function playTone(note = 440, duration = 0.32) {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.type = "sine";
  osc.frequency.value = note;

  gain.gain.setValueAtTime(0, audioContext.currentTime);
  gain.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + duration);
}

function startSong() {
  ensureAudioContext();
  const melody = [392, 440, 523.25, 587.33, 523.25, 440, 392, 349.23];
  let step = 0;

  playTone(melody[step], 0.45);

  musicInterval = setInterval(() => {
    step = (step + 1) % melody.length;
    playTone(melody[step], 0.45);
  }, 520);

  isPlaying = true;
  songToggle.textContent = "⏸ Hentikan Lagu";
}

function stopSong() {
  clearInterval(musicInterval);
  isPlaying = false;
  songToggle.textContent = "▶ Mainkan Lagu";
}

moonButton.addEventListener("click", () => {
  showCelebration();
  if (!isPlaying) {
    startSong();
  }
});

songToggle.addEventListener("click", () => {
  if (isPlaying) {
    stopSong();
    return;
  }

  startSong();
});
