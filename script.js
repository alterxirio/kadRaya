const preludeScene = document.getElementById("prelude-scene");
const introScene = document.getElementById("intro-scene");
const celebrationScene = document.getElementById("celebration-scene");
const moonButton = document.getElementById("moon-button");
const bookCard = document.getElementById("book-card");
const typewriter = document.getElementById("typewriter");
const songToggle = document.getElementById("song-toggle");
const closeButton = document.getElementById("close-button");
const rotateOverlay = document.getElementById("rotate-overlay");

// Select the audio element from your HTML
const rayaSong = document.querySelector("audio");

const greetingText = "Malam yang syahdu beralih ke pagi yang mulia, menyatukan hati dalam rindu yang tidak bertepi. Hilangkan sengketa, hapuskan duka, gantikan dengan tawa dan doa yang tulus buat insan tercinta. Inilah saatnya untuk kita kembali kepada fitrah yang sebenar, meraikan kemenangan dengan penuh kesyukuran\n\nSelamat Hari Raya Maaf Zahir Dan Batin🌙✨";

let typingIndex = 0;
let typingTimer;
let isPlaying = false;
let transitionLocked = false;


function updateOrientationOverlay() {
    const isPortraitMobile = window.matchMedia("(max-width: 900px) and (orientation: portrait)").matches;
    document.body.classList.toggle("require-landscape", isPortraitMobile);
    rotateOverlay.setAttribute("aria-hidden", String(!isPortraitMobile));
}

// --- Scene Logic ---

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
        }, 1000);
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

// --- NEW MP3 Audio Logic ---

function startSong() {
    // We play the actual MP3 file here
    rayaSong.play().catch(error => {
        console.warn("Playback failed. Interaction required:", error);
    });
    isPlaying = true;
    songToggle.textContent = "⏸ Hentikan Lagu";
}

function stopSong() {
    rayaSong.pause();
    isPlaying = false;
    songToggle.textContent = "▶ Mainkan Lagu";
}

function closeCard() {
    bookCard.classList.remove("show");
    closeButton.classList.remove("show");
    
    setTimeout(() => {
        typewriter.textContent = "";
        typingIndex = 0;
    }, 500);
}

// --- Event Listeners ---

moonButton.addEventListener("click", () => {
    showCelebration();
    // Start the MP3 when the moon is clicked
    if (!isPlaying) {
        startSong();
    }
});

songToggle.addEventListener("click", () => {
    if (isPlaying) {
        stopSong();
    } else {
        startSong();
    }
});

closeButton.addEventListener("click", closeCard);

// Start the whole app
updateOrientationOverlay();
window.addEventListener("resize", updateOrientationOverlay);
window.addEventListener("orientationchange", updateOrientationOverlay);
runIntroSequence();