const preludeScene = document.getElementById("prelude-scene");
const introScene = document.getElementById("intro-scene");
const celebrationScene = document.getElementById("celebration-scene");
const moonButton = document.getElementById("moon-button");
const bookCard = document.getElementById("book-card");
const typewriter = document.getElementById("typewriter");
const songToggle = document.getElementById("song-toggle");
const closeButton = document.getElementById("close-button");

const greetingText = "Malam yang syahdu beralih ke pagi yang mulia, menyatukan hati dalam rindu yang tidak bertepi. Hilangkan sengketa, hapuskan duka, gantikan dengan tawa dan doa yang tulus buat insan tercinta. Inilah saatnya untuk kita kembali kepada fitrah yang sebenar, meraikan kemenangan dengan penuh kesyukuran\n\nSelamat Hari Raya Maaf Zahir Dan Batin🌙✨";

let typingIndex = 0;
let typingTimer;
let audioContext;
let musicInterval;
let isPlaying = false;
let transitionLocked = false;

function runIntroSequence() {
    setTimeout(() => {
        preludeScene.classList.add("fade-out");
        setTimeout(() => {
            preludeScene.classList.remove("active");
            introScene.classList.add("active");
            requestAnimationFrame(() => {
                introScene.classList.add("moon-visible");
                setTimeout(() => {
                    introScene.classList.add("text-visible");
                }, 1200);
            });
        }, 900);
    }, 3900);
}

function resetCardState() {
    clearInterval(typingTimer);
    typewriter.textContent = "";
    typingIndex = 0;
    bookCard.classList.remove("show");
    closeButton.classList.remove("show");
}

function showCelebration() {
    if (transitionLocked) return;
    transitionLocked = true;
    resetCardState();

    introScene.classList.add("fade-out");

    setTimeout(() => {
        introScene.classList.remove("active");
        celebrationScene.classList.add("active", "fade-in");

        setTimeout(() => {
            bookCard.classList.add("show");
            startTypewriter();
            transitionLocked = false;
        }, 1000); // Faster entry
    }, 850);
}

function startTypewriter() {
    clearInterval(typingTimer);
    typewriter.textContent = "";
    typingIndex = 0;

    typingTimer = setInterval(() => {
        if (typingIndex >= greetingText.length) {
            clearInterval(typingTimer);
            closeButton.classList.add("show");
            return;
        }
        typewriter.textContent += greetingText[typingIndex];
        typingIndex += 1;
    }, 45);
}

// Audio Logic
function ensureAudioContext() {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();
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

// THE SPECIFIC FIX: Just close the book, stay in the scene
function closeCard() {
    bookCard.classList.remove("show");
    closeButton.classList.remove("show");
    
    // Briefly wait for animation then reset text
    setTimeout(() => {
        typewriter.textContent = "";
        typingIndex = 0;
    }, 500);
}

moonButton.addEventListener("click", () => {
    showCelebration();
    if (!isPlaying) startSong();
});

songToggle.addEventListener("click", () => {
    isPlaying ? stopSong() : startSong();
});

 
runIntroSequence();