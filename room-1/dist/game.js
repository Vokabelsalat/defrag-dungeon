const scene = document.querySelector('#scene');
const curtain = document.querySelector('#curtain');
const statusText = document.querySelector('#status');
const timeText = document.querySelector('#time');
const roundText = document.querySelector('#round');
const strikesText = document.querySelector('#strikes');
const promptText = document.querySelector('#prompt');

let state = 'waiting';
let round = 0;
let mistakes = 3;
let seconds = 60;
let ticker = null;
let foundAt = 0;
const layouts = [
  { x: 76, y: 68, scale: 1 },
  { x: 19, y: 62, scale: .96 },
  { x: 69, y: 28, scale: .92 },
  { x: 31, y: 39, scale: .88 }
];

function rng(seed) {
  let n = seed >>> 0;
  return () => ((n = Math.imul(1664525, n) + 1013904223 >>> 0) / 4294967296);
}

function makePerson(col, row, cols, rows, size, random) {
  const p = document.createElement('button');
  p.className = 'person';
  p.type = 'button';
  p.setAttribute('aria-label', 'Crowd member');
  const x = (col + .5 + (random() - .5) * .28) * 100 / cols;
  const y = (row + .5 + (random() - .5) * .22) * 100 / rows;
  const h = size * (.94 + random() * .12);
  p.style.cssText = `left:${x}%;top:${y}%;--h:${h}px;--w:${h * .62}px;--r:${(random()-.5)*12}deg;--fill:${random()>.55?'#000':'#fff'};--arm:${(random()-.5)*55}deg`;
  const hat = random() > .64 ? '<i class="hat"></i>' : '';
  const glasses = random() > .3 ? '<i class="eye l"></i><i class="eye r"></i>' : '';
  const beard = random() > .52 ? '<i class="beard"></i>' : '';
  p.innerHTML = `${hat}<i class="hair"></i><i class="head"></i>${glasses}${beard}<i class="body"></i><i class="leg l"></i><i class="leg r"></i>`;
  p.addEventListener('click', wrongPick);
  return p;
}

function renderRound() {
  scene.replaceChildren();
  const cfg = layouts[round];
  const random = rng(7123 + round * 997);
  const size = Math.max(42, Math.min(68, scene.clientHeight / 10.5)) * cfg.scale;
  const cols = Math.max(1, Math.ceil(scene.clientWidth / (size * .75)));
  const rows = Math.max(1, Math.ceil(scene.clientHeight / (size * .84)));
  const crowd = document.createDocumentFragment();
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) crowd.append(makePerson(col, row, cols, rows, size, random));
  }
  scene.append(crowd);
  const target = document.createElement('button');
  target.type = 'button';
  target.className = 'andreas';
  target.setAttribute('aria-label', 'Andreas');
  target.style.cssText = `left:${cfg.x}%;top:${cfg.y}%;--h:${size}px;--w:${size * .64}px;--r:${round % 2 ? -4 : 3}deg`;
  target.innerHTML = '<img src="./andreas.png" alt="">';
  target.addEventListener('click', () => found(target));
  scene.append(target);
  roundText.textContent = round + 1;
  promptText.textContent = round < 2 ? 'Find the bearded man with glasses and crossed arms.' : 'He is getting harder to spot. Find Andreas!';
}

function wrongPick(event) {
  if (state !== 'playing' || performance.now() < foundAt) return;
  mistakes--;
  seconds = Math.max(0, seconds - 3);
  strikesText.textContent = `${'● '.repeat(mistakes)}${'○ '.repeat(3 - mistakes)}`.trim();
  scene.classList.remove('shake'); void scene.offsetWidth; scene.classList.add('shake');
  event.currentTarget.blur();
  if (mistakes <= 0 || seconds <= 0) finish(false, `Andreas disappeared into the crowd after ${round} of 4 scenes.`);
}

function found(target) {
  if (state !== 'playing' || performance.now() < foundAt) return;
  foundAt = performance.now() + 650;
  target.classList.add('found');
  promptText.textContent = 'There he is!';
  setTimeout(() => {
    round++;
    if (round === layouts.length) finish(true, `You found Andreas in all 4 scenes with ${seconds} seconds left!`);
    else renderRound();
  }, 650);
}

function startGame() {
  if (state !== 'waiting') return;
  state = 'playing';
  curtain.classList.remove('visible');
  renderRound();
  ticker = setInterval(() => {
    seconds--;
    timeText.textContent = seconds;
    if (seconds <= 0) finish(false, `Time ran out after ${round} of 4 scenes.`);
  }, 1000);
}

function finish(success, result) {
  if (state === 'complete') return;
  state = 'complete';
  clearInterval(ticker);
  statusText.textContent = success ? 'Crowd conquered!' : 'Andreas got away!';
  curtain.querySelector('h1').textContent = success ? 'Found him!' : 'So close!';
  curtain.querySelector('p').textContent = result;
  curtain.classList.add('visible');
  window.parent.postMessage({ type: 'defrag:complete', success, result }, '*');
}

window.addEventListener('message', event => {
  if (event.data?.type === 'defrag:start') startGame();
  if (event.data?.type === 'defrag:timeout') finish(false, `The dungeon timer ended after ${round} of 4 scenes.`);
});
