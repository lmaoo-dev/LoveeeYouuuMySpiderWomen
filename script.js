function setTheme(themeName) {
  // Remove existing themes
  document.body.classList.remove('spiderman-theme', 'spiderwoman-theme');
  
  // Apply selected theme
  if (themeName === 'spiderman') {
    document.body.classList.add('spiderman-theme');
  } else if (themeName === 'spiderwoman') {
    document.body.classList.add('spiderwoman-theme');
  }
}

// Default theme on load
document.addEventListener('DOMContentLoaded', () => {
  setTheme('spiderman');
});

// Toggle Envelope Open / Close State
function toggleEnvelope(element) {
  element.classList.toggle('open');
}

// Game Mechanics
const container = document.getElementById('game-container');
const basket = document.getElementById('basket');
const victoryMsg = document.getElementById('victory-msg');

let basketX = 270;
const basketSpeed = 20;
const containerWidth = 600;
const itemTypes = [
  { type: 'web', emoji: '🕷️', id: 'web-count' },
  { type: 'pink', emoji: '💖', id: 'pink-count' },
  { type: 'bow', emoji: '🎀', id: 'bow-count' },
  { type: 'red', emoji: '❤️', id: 'red-count' }
];

let counts = { web: 0, pink: 0, bow: 0, red: 0 };
let isGameOver = false;

// Controls: A and D keys
document.addEventListener('keydown', (e) => {
  if (isGameOver) return;
  
  if (e.key === 'a' || e.key === 'A') {
    basketX = Math.max(0, basketX - basketSpeed);
  } else if (e.key === 'd' || e.key === 'D') {
    basketX = Math.min(containerWidth - 60, basketX + basketSpeed);
  }
  
  basket.style.left = `${basketX}px`;
});

// Spawn falling items
function spawnItem() {
  if (isGameOver) return;

  const itemData = itemTypes[Math.floor(Math.random() * itemTypes.length)];
  const item = document.createElement('div');
  item.classList.add('falling-item');
  item.innerText = itemData.emoji;
  
  // Random horizontal starting position
  const startX = Math.floor(Math.random() * (containerWidth - 40));
  item.style.left = `${startX}px`;
  item.style.top = '0px';

  container.appendChild(item);

  let currentY = 0;
  const fallSpeed = 2 + Math.random() * 2; // Slight variance in speed

  const fallInterval = setInterval(() => {
    if (isGameOver) {
      clearInterval(fallInterval);
      item.remove();
      return;
    }

    currentY += fallSpeed;
    item.style.top = `${currentY}px`;

    // Catch Check (Item hits basket height)
    if (currentY >= 340 && currentY <= 370) {
      const itemX = parseInt(item.style.left);
      if (itemX >= basketX - 25 && itemX <= basketX + 45) {
        
        // Increase count if target not reached
        if (counts[itemData.type] < 20) {
          counts[itemData.type]++;
          document.getElementById(itemData.id).innerText = counts[itemData.type];
          checkWinCondition();
        }

        clearInterval(fallInterval);
        item.remove();
      }
    }

    // Remove item if it falls off bottom
    if (currentY > 400) {
      clearInterval(fallInterval);
      item.remove();
    }
  }, 20);
}

// Win Condition Check
function checkWinCondition() {
  if (counts.web >= 20 && counts.pink >= 20 && counts.bow >= 20 && counts.red >= 20) {
    isGameOver = true;
    victoryMsg.classList.remove('hidden');
  }
}

// Start spawning every 800ms
setInterval(spawnItem, 800);

function setTheme(themeName) {
  document.body.classList.remove('spiderman-theme', 'spiderwoman-theme');

  if (themeName === 'spiderman') {
    document.body.classList.add('spiderman-theme');
  } else if (themeName === 'spiderwoman') {
    document.body.classList.add('spiderwoman-theme');
  }
}

// Set initial background theme on page load
document.addEventListener('DOMContentLoaded', () => {
  setTheme('spiderman');
});

const audioPlayer = document.getElementById('audio-player');
const mp3FileInput = document.getElementById('mp3-file');
const playBtn = document.getElementById('play-btn');
const trackTitle = document.getElementById('track-title');

let isPlaying = false;

// Handle MP3 File Selection
mp3FileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];

  if (file) {
    // Generate temporary browser URL for the chosen file
    const fileURL = URL.createObjectURL(file);
    audioPlayer.src = fileURL;

    // Update UI
    trackTitle.innerText = file.name;
    playBtn.disabled = false;
    
    // Reset play state
    pauseAudio();
  }
});

// Handle Play / Pause Toggle
playBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
});

function playAudio() {
  audioPlayer.play();
  isPlaying = true;
  playBtn.innerText = 'Pause';
}

function pauseAudio() {
  audioPlayer.pause();
  isPlaying = false;
  playBtn.innerText = 'Play';
}

// Reset play button when audio finishes
audioPlayer.addEventListener('ended', () => {
  pauseAudio();
});