class TypingPractice {
constructor() {
this.selectedTime = 30;
this.currentText = '';
this.currentIndex = 0;
this.startTime = null;
this.isActive = false;
this.timer = null;
this.errors = 0;
this.correctChars = 0;
this.visibleChunks = 1;
this.chunkSize = 150;
this.typedChars = []; // Track what user actually typed
this.settings = {
  theme: 'blue', // blue, green, purple
  keyboardLayout: 'qwerty',
  practiceMode: 'sentence', // word, sentence
  difficulty: 'medium',
  fontSize: 18,
  soundEffects: false
};
this.phrases = {
short: [
"The quick brown fox jumps over the lazy dog near the riverbank.",
"Technology advances rapidly in our modern digital world today.",
"Practice makes perfect when learning new skills and abilities.",
"Beautiful sunsets paint the sky with vibrant colors each evening."
],
medium: [
"In the heart of Silicon Valley, innovative companies are constantly pushing the boundaries of what technology can achieve. From artificial intelligence to quantum computing, the future looks incredibly promising for those who embrace change and continuous learning.",
"The art of effective communication involves not just speaking clearly, but also listening actively and understanding different perspectives. In our interconnected world, these skills become increasingly valuable for personal and professional success.",
"Climate change represents one of the most significant challenges of our time, requiring global cooperation and innovative solutions. Renewable energy sources like solar and wind power are becoming more efficient and cost-effective each year."
],
long: [
"The digital revolution has fundamentally transformed how we work, communicate, and live our daily lives. From smartphones that connect us instantly to people across the globe, to artificial intelligence systems that can process vast amounts of data in seconds, technology continues to reshape our world in unprecedented ways. Social media platforms have created new forms of community and commerce, while cloud computing has made powerful tools accessible to individuals and small businesses that were once only available to large corporations. As we move forward into an increasingly connected future, the importance of digital literacy and cybersecurity awareness becomes more critical than ever before.",
"Scientific research and discovery have always been the driving forces behind human progress and innovation. Throughout history, curious minds have pushed the boundaries of knowledge, from Galileo's observations of the heavens to Darwin's theory of evolution, from Einstein's relativity to the recent breakthroughs in gene editing and space exploration. Today's researchers continue this tradition, working on solutions to global challenges such as climate change, disease prevention, and sustainable energy production. The collaborative nature of modern science, enabled by digital communication and data sharing, has accelerated the pace of discovery and opened new possibilities for addressing complex problems.",
"The importance of education in shaping future generations cannot be overstated in our rapidly evolving world. Traditional classroom models are being supplemented and sometimes replaced by online learning platforms, virtual reality experiences, and personalized AI tutors. Students today have access to more information and learning resources than any generation before them, yet they also face unique challenges in developing critical thinking skills and distinguishing reliable sources from misinformation. Educators are adapting their teaching methods to prepare students not just with knowledge, but with the flexibility and problem-solving abilities they'll need in careers that may not even exist yet."
]
};

// Word lists for different keyboard layouts
this.wordLists = {
  qwerty: {
    easy: ["cat", "dog", "run", "jump", "walk", "talk", "book", "home", "work", "play"],
    medium: ["computer", "keyboard", "practice", "amazing", "journey", "fantastic", "wonderful", "excellent"],
    hard: ["extraordinary", "magnificent", "sophisticated", "revolutionary", "unprecedented", "phenomenal"]
  },
  dvorak: ["and", "the", "you", "are", "was", "for", "not", "can", "had", "her"],
  colemak: ["the", "and", "for", "are", "but", "not", "you", "all", "can", "had"]
};

this.init();
}

init() {
this.bindEvents();
this.loadSettings();
this.generateText();
this.updateDisplay();
}

loadSettings() {
// Apply saved settings or defaults
this.applyTheme(this.settings.theme);
this.applyFontSize(this.settings.fontSize);
this.updateSettingsUI();
}

updateSettingsUI() {
// Update difficulty buttons
const difficultyBtns = ['easyBtn', 'mediumBtn', 'hardBtn'];
difficultyBtns.forEach(btnId => {
  const btn = document.getElementById(btnId);
  const difficulty = btnId.replace('Btn', '');
  if (difficulty === this.settings.difficulty) {
    btn.classList.remove('bg-dark-300');
    btn.classList.add('bg-primary', 'text-dark-100');
  } else {
    btn.classList.remove('bg-primary', 'text-dark-100');
    btn.classList.add('bg-dark-300');
  }
});

// Update practice mode buttons
const modeBtns = ['wordMode', 'sentenceMode'];
modeBtns.forEach(btnId => {
  const btn = document.getElementById(btnId);
  const mode = btnId === 'wordMode' ? 'word' : 'sentence';
  if (mode === this.settings.practiceMode) {
    btn.classList.remove('bg-dark-300');
    btn.classList.add('bg-primary', 'text-dark-100');
  } else {
    btn.classList.remove('bg-primary', 'text-dark-100');
    btn.classList.add('bg-dark-300');
  }
});

// Update theme buttons
const themeButtons = document.querySelectorAll('.theme-btn');
themeButtons.forEach((btn, index) => {
  const themes = ['blue', 'green', 'purple'];
  btn.classList.remove('ring-2', 'ring-white');
  if (themes[index] === this.settings.theme) {
    btn.classList.add('ring-2', 'ring-white');
  }
});

// Update keyboard layout dropdown
document.getElementById('keyboardLayout').value = this.settings.keyboardLayout;

// Update font size
document.getElementById('fontSizeRange').value = this.settings.fontSize;
document.getElementById('fontSizeValue').textContent = `${this.settings.fontSize}px`;

// Update sound toggle
const soundToggle = document.getElementById('soundToggle');
const dot = soundToggle.parentElement.querySelector('.dot');
soundToggle.checked = this.settings.soundEffects;
if (this.settings.soundEffects) {
  dot.style.transform = 'translateX(24px)';
  dot.classList.remove('bg-gray-400');
  dot.classList.add('bg-primary');
} else {
  dot.style.transform = 'translateX(0)';
  dot.classList.remove('bg-primary');
  dot.classList.add('bg-gray-400');
}
}

applyTheme(theme) {
const root = document.documentElement;
const themeColors = {
  blue: '#00D2FF',
  green: '#4ade80',
  purple: '#a855f7'
};

root.style.setProperty('--primary-color', themeColors[theme]);
document.documentElement.style.setProperty('--tw-primary', themeColors[theme]);

// Update all primary colored elements
const primaryElements = document.querySelectorAll('.bg-primary, .text-primary, .border-primary');
primaryElements.forEach(el => {
  if (el.classList.contains('bg-primary')) {
    el.style.backgroundColor = themeColors[theme];
  }
  if (el.classList.contains('text-primary')) {
    el.style.color = themeColors[theme];
  }
  if (el.classList.contains('border-primary')) {
    el.style.borderColor = themeColors[theme];
  }
});

// Update progress bar and cursor
const progressBar = document.getElementById('progressBar');
const cursor = document.getElementById('cursor');
if (progressBar) progressBar.style.backgroundColor = themeColors[theme];
if (cursor) cursor.style.backgroundColor = themeColors[theme];
}

applyFontSize(size) {
const textDisplay = document.getElementById('textDisplay');
if (textDisplay) {
  textDisplay.style.fontSize = `${size}px`;
}
}

bindEvents() {
// Time selection
document.querySelectorAll('.time-btn').forEach(btn => {
btn.addEventListener('click', (e) => {
if (e.target.id === 'customBtn') {
this.toggleCustomInput();
} else {
this.selectTime(parseInt(e.target.dataset.time));
}
});
});

// Custom time input
document.getElementById('customTime').addEventListener('change', (e) => {
const time = parseInt(e.target.value);
if (time >= 5 && time <= 600) {
this.selectTime(time, true);
}
});

// Control buttons
document.getElementById('startBtn').addEventListener('click', () => this.startPractice());
document.getElementById('resetBtn').addEventListener('click', () => this.resetPractice());
document.getElementById('tryAgainBtn').addEventListener('click', () => this.resetPractice());
document.getElementById('closeResultsBtn').addEventListener('click', () => this.closeResults());

// Typing input
document.getElementById('typingInput').addEventListener('input', (e) => this.handleInput(e));
document.getElementById('typingInput').addEventListener('keydown', (e) => this.handleKeydown(e));
}

toggleCustomInput() {
const customTime = document.getElementById('customTime');
const customLabel = document.getElementById('customLabel');
const isHidden = customTime.classList.contains('hidden');

if (isHidden) {
customTime.classList.remove('hidden');
customLabel.classList.remove('hidden');
customTime.focus();
} else {
customTime.classList.add('hidden');
customLabel.classList.add('hidden');
}
}

selectTime(time, isCustom = false) {
this.selectedTime = time;

// Update button states
document.querySelectorAll('.time-btn').forEach(btn => {
btn.classList.remove('border-primary', 'bg-primary', 'text-dark-100');
btn.classList.add('border-transparent', 'bg-dark-200', 'text-white');
});

if (isCustom) {
document.getElementById('customBtn').classList.add('border-primary', 'bg-primary', 'text-dark-100');
} else {
const selectedBtn = document.querySelector(`[data-time="${time}"]`);
if (selectedBtn) {
selectedBtn.classList.add('border-primary', 'bg-primary', 'text-dark-100');
}
}

this.generateText();
this.resetPractice();
}

generateText() {
if (this.settings.practiceMode === 'word') {
this.generateWordText();
} else {
this.generateSentenceText();
}
}

generateWordText() {
const targetWords = Math.max(10, Math.floor(this.selectedTime / 2));
let words = [];
let wordList;

// Select word list based on keyboard layout and difficulty
if (this.settings.keyboardLayout === 'qwerty') {
wordList = this.wordLists.qwerty[this.settings.difficulty];
} else {
wordList = this.wordLists[this.settings.keyboardLayout];
}

// Generate random words
for (let i = 0; i < targetWords; i++) {
const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
words.push(randomWord);
}

this.currentText = words.join(' ');
this.updateTextDisplay();
}

generateSentenceText() {
const targetChars = Math.max(150, this.selectedTime * 25);
let text = '';
let phrases;

// Select phrases based on difficulty
if (this.settings.difficulty === 'easy') {
phrases = this.phrases.short;
} else if (this.settings.difficulty === 'medium') {
phrases = this.phrases.medium;
} else {
phrases = this.phrases.long;
}

while (text.length < targetChars) {
const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
text += (text.length > 0 ? ' ' : '') + randomPhrase;

// Add some numbers occasionally for medium and hard difficulty
if (this.settings.difficulty !== 'easy' && Math.random() < 0.3) {
const numbers = [' 123', ' 456', ' 789', ' 2024', ' 100%', ' $50', ' #1'];
text += numbers[Math.floor(Math.random() * numbers.length)];
}
}

this.currentText = text.substring(0, targetChars).trim();
this.updateTextDisplay();
}

updateTextDisplay() {
const display = document.getElementById('textDisplay');
const cursor = document.getElementById('cursor');
if(!display || !cursor) return;

const visibleLength = Math.min(this.chunkSize * this.visibleChunks, this.currentText.length);
const visibleText = this.currentText.substring(0, visibleLength);
const fragment = document.createDocumentFragment();

for (let i = 0; i < visibleText.length; i++) {
  const span = document.createElement('span');
  const char = visibleText[i];
  
  if (i < this.currentIndex) {
    // Check if this character was typed correctly
    if (this.typedChars[i] === char) {
      span.className = 'correct-char';
    } else {
      span.className = 'error-char';
    }
  } else if (i === this.currentIndex) {
    span.className = 'current-char';
    cursor.style.display = 'block';
  }
  
  span.textContent = char === ' ' ? '\u00A0' : char;
  fragment.appendChild(span);
}

display.innerHTML = '';
display.appendChild(fragment);

// Update cursor position
if(this.currentIndex < visibleText.length) {
  const currentChar = display.children[this.currentIndex];
  if(currentChar) {
    const rect = currentChar.getBoundingClientRect();
    const parentRect = display.getBoundingClientRect();
    cursor.style.left = `${rect.left - parentRect.left}px`;
    cursor.style.top = `${rect.top - parentRect.top}px`;
    cursor.style.height = `${rect.height}px`;
  }
}

// Check if we need to show more text
if (this.currentIndex >= visibleLength * 0.8 && visibleLength < this.currentText.length) {
  this.visibleChunks++;
  requestAnimationFrame(() => this.updateTextDisplay());
}

// Scroll into view if needed
if(this.currentIndex > 0) {
  const currentChar = display.children[this.currentIndex];
  if(currentChar) {
    currentChar.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
}

startPractice() {
if (this.isActive) return;

this.isActive = true;
this.startTime = Date.now();
this.currentIndex = 0;
this.errors = 0;
this.correctChars = 0;
this.visibleChunks = 1;
this.typedChars = []; // Reset typed characters array

document.getElementById('typingInput').disabled = false;
document.getElementById('typingInput').focus();
document.getElementById('startBtn').innerHTML = '<div class="w-6 h-6 flex items-center justify-center mr-2 inline-flex"><i class="ri-pause-fill"></i></div>Practicing...';

this.startTimer();
this.updateTextDisplay();
}

startTimer() {
let timeLeft = this.selectedTime;
document.getElementById('timeDisplay').textContent = `${timeLeft}s`;

this.timer = setInterval(() => {
timeLeft--;
document.getElementById('timeDisplay').textContent = `${timeLeft}s`;

if (timeLeft <= 0) {
this.endPractice();
}
}, 1000);
}

handleInput(e) {
if (!this.isActive) return;

const input = e.target.value;
const currentChar = this.currentText[this.currentIndex];
const typedChar = input[input.length - 1];

// Prevent typing ahead
if (input.length > this.currentIndex + 1) {
e.target.value = input.substring(0, this.currentIndex + 1);
return;
}

// Only process if user typed a new character
if (input.length === this.currentIndex + 1) {
// Store what the user actually typed
this.typedChars[this.currentIndex] = typedChar;

if (typedChar === currentChar) {
this.correctChars++;
if (this.settings.soundEffects) {
  this.playKeySound();
}
this.createParticle(e.target);
} else {
this.errors++;
this.highlightError();
}

// Always advance to next character
this.currentIndex++;
this.updateStats();
this.updateTextDisplay();

// Check if completed
if (this.currentIndex >= this.currentText.length) {
this.endPractice();
}
}
}

handleKeydown(e) {
if (!this.isActive) return;

if (e.key === 'Backspace' && this.currentIndex > 0) {
this.currentIndex--;
// Remove the typed character from our tracking array
this.typedChars.splice(this.currentIndex, 1);

// Update input value to match current position
const input = document.getElementById('typingInput');
input.value = input.value.substring(0, this.currentIndex);

// Recalculate stats
this.recalculateStats();
this.updateStats();
this.updateTextDisplay();
}
}

recalculateStats() {
this.correctChars = 0;
this.errors = 0;

for (let i = 0; i < this.currentIndex; i++) {
if (this.typedChars[i] === this.currentText[i]) {
this.correctChars++;
} else {
this.errors++;
}
}
}

playKeySound() {
// Create a simple beep sound using Web Audio API
if (this.settings.soundEffects) {
try {
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();

oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);

oscillator.frequency.value = 800;
oscillator.type = 'square';
gainNode.gain.setValueAtTime(0, audioContext.currentTime);
gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

oscillator.start(audioContext.currentTime);
oscillator.stop(audioContext.currentTime + 0.1);
} catch (e) {
console.log('Audio not supported');
}
}
}

createParticle(element) {
const particle = document.createElement('div');
particle.className = 'particle text-primary font-bold';
particle.textContent = '✓';
particle.style.left = Math.random() * 20 + 'px';
particle.style.top = '0px';
element.parentElement.style.position = 'relative';
element.parentElement.appendChild(particle);

setTimeout(() => particle.remove(), 1000);
}

highlightError() {
const input = document.getElementById('typingInput');
input.classList.add('border-red-500');
setTimeout(() => input.classList.remove('border-red-500'), 200);
}

updateStats() {
const elapsed = (Date.now() - this.startTime) / 1000 / 60; // minutes
const wpm = Math.round((this.correctChars / 5) / elapsed) || 0;
const accuracy = Math.round((this.correctChars / (this.correctChars + this.errors)) * 100) || 100;
const progress = Math.round((this.currentIndex / this.currentText.length) * 100);

document.getElementById('wpmDisplay').textContent = wpm;
document.getElementById('accuracyDisplay').textContent = `${accuracy}%`;
document.getElementById('charDisplay').textContent = `${this.currentIndex}/${this.currentText.length}`;
document.getElementById('progressPercent').textContent = `${progress}%`;
document.getElementById('progressBar').style.width = `${progress}%`;
}

endPractice() {
this.isActive = false;
clearInterval(this.timer);
document.getElementById('typingInput').disabled = true;
document.getElementById('startBtn').innerHTML = '<div class="w-6 h-6 flex items-center justify-center mr-2 inline-flex"><i class="ri-play-fill"></i></div>Start Practice';

this.showResults();
}

showResults() {
const elapsed = (Date.now() - this.startTime) / 1000 / 60;
const wpm = Math.round((this.correctChars / 5) / elapsed) || 0;
const accuracy = Math.round((this.correctChars / (this.correctChars + this.errors)) * 100) || 100;

document.getElementById('finalWPM').textContent = wpm;
document.getElementById('finalAccuracy').textContent = `${accuracy}%`;
document.getElementById('finalChars').textContent = this.currentIndex;
document.getElementById('finalErrors').textContent = this.errors;

document.getElementById('resultsModal').classList.remove('hidden');
}

closeResults() {
document.getElementById('resultsModal').classList.add('hidden');
}

resetPractice() {
this.isActive = false;
clearInterval(this.timer);
this.currentIndex = 0;
this.errors = 0;
this.correctChars = 0;
this.visibleChunks = 1;
this.startTime = null;
this.typedChars = []; // Reset typed characters array

document.getElementById('typingInput').value = '';
document.getElementById('typingInput').disabled = true;
document.getElementById('startBtn').innerHTML = '<div class="w-6 h-6 flex items-center justify-center mr-2 inline-flex"><i class="ri-play-fill"></i></div>Start Practice';

this.generateText();
this.updateDisplay();
this.closeResults();
}

updateDisplay() {
document.getElementById('wpmDisplay').textContent = '0';
document.getElementById('accuracyDisplay').textContent = '100%';
document.getElementById('charDisplay').textContent = `0/${this.currentText.length}`;
document.getElementById('timeDisplay').textContent = `${this.selectedTime}s`;
document.getElementById('progressPercent').textContent = '0%';
document.getElementById('progressBar').style.width = '0%';
}
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
window.typingPractice = new TypingPractice();

const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const applySettingsBtn = document.getElementById('applySettingsBtn');
const soundToggle = document.getElementById('soundToggle');
const fontSizeRange = document.getElementById('fontSizeRange');
const fontSizeValue = document.getElementById('fontSizeValue');

// Settings modal events
settingsBtn.addEventListener('click', () => {
settingsModal.classList.remove('hidden');
});

closeSettingsBtn.addEventListener('click', () => {
settingsModal.classList.add('hidden');
});

// Sound toggle functionality
soundToggle.addEventListener('change', () => {
const dot = soundToggle.nextElementSibling.nextElementSibling;
window.typingPractice.settings.soundEffects = soundToggle.checked;
if (soundToggle.checked) {
dot.style.transform = 'translateX(24px)';
dot.classList.remove('bg-gray-400');
dot.classList.add('bg-primary');
} else {
dot.style.transform = 'translateX(0)';
dot.classList.remove('bg-primary');
dot.classList.add('bg-gray-400');
}
});

// Font size range functionality
fontSizeRange.addEventListener('input', (e) => {
const value = parseInt(e.target.value);
fontSizeValue.textContent = `${value}px`;
window.typingPractice.settings.fontSize = value;
window.typingPractice.applyFontSize(value);
});

// Difficulty button functionality
const difficultyBtns = ['easyBtn', 'mediumBtn', 'hardBtn'];
difficultyBtns.forEach(btnId => {
document.getElementById(btnId).addEventListener('click', (e) => {
const difficulty = btnId.replace('Btn', '');
window.typingPractice.settings.difficulty = difficulty;

difficultyBtns.forEach(id => {
const btn = document.getElementById(id);
btn.classList.remove('bg-primary', 'text-dark-100');
btn.classList.add('bg-dark-300');
});

e.target.classList.remove('bg-dark-300');
e.target.classList.add('bg-primary', 'text-dark-100');

// Regenerate text with new difficulty
window.typingPractice.generateText();
window.typingPractice.resetPractice();
});
});

// Practice mode button functionality
const modeBtns = ['wordMode', 'sentenceMode'];
modeBtns.forEach(btnId => {
document.getElementById(btnId).addEventListener('click', (e) => {
const mode = btnId === 'wordMode' ? 'word' : 'sentence';
window.typingPractice.settings.practiceMode = mode;

modeBtns.forEach(id => {
const btn = document.getElementById(id);
btn.classList.remove('bg-primary', 'text-dark-100');
btn.classList.add('bg-dark-300');
});

e.target.classList.remove('bg-dark-300');
e.target.classList.add('bg-primary', 'text-dark-100');

// Regenerate text with new mode
window.typingPractice.generateText();
window.typingPractice.resetPractice();
});
});

// Theme button functionality
document.querySelectorAll('.theme-btn').forEach((btn, index) => {
btn.addEventListener('click', (e) => {
const themes = ['blue', 'green', 'purple'];
const selectedTheme = themes[index];
window.typingPractice.settings.theme = selectedTheme;

document.querySelectorAll('.theme-btn').forEach(b => {
b.classList.remove('ring-2', 'ring-white');
});
e.target.classList.add('ring-2', 'ring-white');

// Apply theme immediately
window.typingPractice.applyTheme(selectedTheme);
});
});

// Keyboard layout dropdown functionality
document.getElementById('keyboardLayout').addEventListener('change', (e) => {
window.typingPractice.settings.keyboardLayout = e.target.value;
// Regenerate text with new keyboard layout if in word mode
if (window.typingPractice.settings.practiceMode === 'word') {
window.typingPractice.generateText();
window.typingPractice.resetPractice();
}
});

// Apply settings button functionality
applySettingsBtn.addEventListener('click', () => {
settingsModal.classList.add('hidden');
});

// Close modal when clicking outside
settingsModal.addEventListener('click', (e) => {
if (e.target === settingsModal) {
settingsModal.classList.add('hidden');
}
});
});