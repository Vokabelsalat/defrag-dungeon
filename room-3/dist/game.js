const people = [
  {
    name: "Ola Roth Johnsen",
    role: "Administrative Project Leader",
    img: "ola.avif",
    url: "https://www4.uib.no/finn-ansatte/Ola.Roth.Johnsen",
    a: 7,
    s: 9,
    t: 5,
  },
  {
    name: "Mahaut de Vareilles",
    role: "Research Adviser and Impact Manager",
    img: "mahaut.avif",
    url: "https://www4.uib.no/finn-ansatte/Mahaut.de.Vareilles",
    a: 7,
    s: 6,
    t: 9,
  },
  {
    name: "Andreas Hadsel Opsvik",
    role: "Communication coordinator",
    img: "andreas.avif",
    url: "https://www4.uib.no/finn-ansatte/Andreas.Hadsel.Opsvik",
    a: 5,
    s: 7,
    t: 10,
  },
  {
    name: "Scott Rettberg",
    role: "Center Director",
    img: "scott.avif",
    url: "https://www4.uib.no/finn-ansatte/Scott.Rettberg",
    a: 7,
    s: 8,
    t: 9,
  },
  {
    name: "Jill Walker Rettberg",
    role: "Professor and Co-Director",
    img: "jill.avif",
    url: "https://www4.uib.no/finn-ansatte/Jill.Walker.Rettberg",
    a: 9,
    s: 6,
    t: 9,
  },
  {
    name: "Hannah Ackermans",
    role: "Postdoctoral fellow",
    img: "hannah.avif",
    url: "https://www.uib.no/nb/personer/Hannah.Maria.Leontine.Ackermans",
    a: 8,
    s: 6,
    t: 8,
  },
  {
    name: "Gabriele de Seta",
    role: "Researcher and project leader",
    img: "gabriele.avif",
    url: "https://www.uib.no/nb/personer/Gabriele.de.Seta",
    a: 9,
    s: 7,
    t: 7,
  },
  {
    name: "Caitlin Fisher",
    role: "Professor II",
    img: "caitlin.avif",
    url: "https://www.uib.no/nb/personer/Caitlin.Fisher",
    a: 8,
    s: 5,
    t: 10,
  },
  {
    name: "Marianne Gunderson",
    role: "Postdoctoral fellow, ALGOFOLK",
    img: "marianne.avif",
    url: "https://www.uib.no/nb/personer/Marianne.Gunderson",
    a: 9,
    s: 7,
    t: 6,
  },
  {
    name: "Elise Marie Strand Hagen",
    role: "Research assistant",
    img: "elise.avif",
    url: "https://www.uib.no/nb/personer/Elise.Marie.Strand.Hagen",
    a: 6,
    s: 9,
    t: 7,
  },
  {
    name: "Lina Ruth Harder",
    role: "PhD fellow, XDN",
    img: "lina.avif",
    url: "https://www.uib.no/nb/personer/Lina.Ruth.Harder",
    a: 7,
    s: 8,
    t: 8,
  },
  {
    name: "Kristine Jørgensen",
    role: "Professor",
    img: "kristine.avif",
    url: "https://www.uib.no/nb/personer/Kristine.J%C3%B8rgensen",
    a: 9,
    s: 8,
    t: 6,
  },
  {
    name: "Tom Legierse",
    role: "PhD candidate",
    img: "tom.avif",
    url: "https://www.uib.no/nb/personer/Tom.Legierse",
    a: 7,
    s: 9,
    t: 6,
  },
  {
    name: "Jasmine Mattey",
    role: "PhD fellow",
    img: "jasmine.avif",
    url: "https://www.uib.no/nb/personer/Jasmine.Angel.Mattey",
    a: 8,
    s: 6,
    t: 8,
  },
  {
    name: "Nick Montfort",
    role: "Professor II",
    img: "nick.avif",
    url: "https://www.uib.no/nb/personer/Nick.Montfort",
    a: 8,
    s: 10,
    t: 6,
  },
  {
    name: "Jason Nelson",
    role: "Professor, Digital Culture",
    img: "jason.avif",
    url: "https://www.uib.no/nb/personer/Jason.Nelson",
    a: 5,
    s: 8,
    t: 10,
  },
  {
    name: "Lin Prøitz",
    role: "Professor II",
    img: "lin.avif",
    url: "https://www.uib.no/nb/personer/Lin.Pr%C3%B8itz",
    a: 8,
    s: 5,
    t: 9,
  },
  {
    name: "Sérgio Galvão Roxo",
    role: "PhD fellow",
    img: "sergio.avif",
    url: "https://www.uib.no/nb/personer/S%C3%A9rgio.Galv%C3%A3o.Roxo",
    a: 7,
    s: 9,
    t: 7,
  },
  {
    name: "Ida Martine Gard Rysjedal",
    role: "PhD fellow",
    img: "ida.avif",
    url: "https://www.uib.no/nb/personer/Ida.Martine.Gard.Rysjedal",
    a: 9,
    s: 6,
    t: 7,
  },
  {
    name: "Debarun Sarkar",
    role: "Postdoctoral fellow",
    img: "debarun.avif",
    url: "https://www.uib.no/nb/personer/Debarun.Sarkar",
    a: 8,
    s: 8,
    t: 6,
  },
  {
    name: "Ella Maria Holi",
    role: "PhD fellow",
    img: "ella.avif",
    url: "https://www.uib.no/nb/personer/Ella.Maria.Holi",
    a: 7,
    s: 6,
    t: 9,
  },
  {
    name: "Hanna Hellesø Lauvli",
    role: "PhD fellow",
    img: "hanna.avif",
    url: "https://www.uib.no/nb/personer/Hanna.Helles%C3%B8.Lauvli",
    a: 8,
    s: 7,
    t: 7,
  },
  {
    name: "Haoyuan Tang",
    role: "PhD fellow",
    img: "haoyuan.avif",
    url: "https://www.uib.no/nb/personer/Haoyuan.Tang",
    a: 8,
    s: 9,
    t: 5,
  },
  {
    name: "Yagmur Cisem Vik",
    role: "PhD fellow",
    img: "yagmur.avif",
    url: "https://www.uib.no/nb/personer/Yagmur.Cisem.Vik",
    a: 7,
    s: 6,
    t: 9,
  },
  {
    name: "Rafael Pérez y Pérez",
    role: "Professor II",
    img: "rafael.avif",
    url: "https://www.uib.no/nb/personer/Rafael.Perez.Y.Perez",
    a: 9,
    s: 8,
    t: 7,
  },
  {
    name: "Zahra Rizvi",
    role: "Postdoctoral fellow",
    img: "zahra.avif",
    url: "https://www4.uib.no/en/find-employees/zahra.rizvi",
    a: 8,
    s: 6,
    t: 8,
  },
  {
    name: "Dom Ford",
    role: "Postdoctoral fellow",
    img: "dom.avif",
    url: "https://www4.uib.no/en/find-employees/dom.ford",
    a: 7,
    s: 8,
    t: 8,
  },
  {
    name: "Kristian A. Bjørkelo",
    role: "Associate Professor",
    img: "kristian.avif",
    url: "https://www4.uib.no/finn-ansatte/kristian-a.bjorkelo",
    a: 8,
    s: 6,
    t: 9,
  },
  {
    name: "Roderick Luis Coover",
    role: "Professor",
    img: "roderick.avif",
    url: "https://www4.uib.no/finn-ansatte/roderick-luis.coover",
    a: 7,
    s: 6,
    t: 10,
  },
  {
    name: "Laura Ann Garrison",
    role: "Associate Professor, Informatics",
    img: "laura.avif",
    url: "https://www4.uib.no/finn-ansatte/laura-ann.garrison",
    a: 8,
    s: 10,
    t: 5,
  },
  {
    name: "David Grellscheid",
    role: "Associate Professor, Informatics",
    img: "david-g.avif",
    url: "https://www4.uib.no/finn-ansatte/david.grellscheid",
    a: 8,
    s: 10,
    t: 5,
  },
  {
    name: "Wolfgang Hottner",
    role: "Professor",
    img: "wolfgang.avif",
    url: "https://www4.uib.no/finn-ansatte/wolfgang.hottner",
    a: 9,
    s: 5,
    t: 9,
  },
  {
    name: "Daniel Jung",
    role: "PhD candidate",
    img: "daniel.avif",
    url: "https://www4.uib.no/finn-ansatte/daniel.jung",
    a: 8,
    s: 6,
    t: 8,
  },
  {
    name: "Alinta Kiri Krauth",
    role: "Associate Professor",
    img: "alinta.avif",
    url: "https://www4.uib.no/finn-ansatte/alinta-kiri.krauth",
    a: 7,
    s: 8,
    t: 9,
  },
  {
    name: "Anders Sundnes Løvlie",
    role: "Associate Professor",
    img: "anders.avif",
    url: "https://www4.uib.no/finn-ansatte/anders-sundnes.lovlie",
    a: 8,
    s: 8,
    t: 8,
  },
  {
    name: "Richard Edward Misek",
    role: "Professor, Media Studies",
    img: "richard.avif",
    url: "https://www4.uib.no/finn-ansatte/richard-edward.misek",
    a: 9,
    s: 6,
    t: 9,
  },
  {
    name: "David Thomas Henry Wright",
    role: "Associate Professor",
    img: "david-w.avif",
    url: "https://www4.uib.no/finn-ansatte/david-thomas-henry.wright",
    a: 8,
    s: 7,
    t: 8,
  },
  {
    name: "Jakob Kusnick",
    role: "Postdoctoral fellow",
    img: "jakob.avif",
    url: "https://www4.uib.no/en/find-employees/jakob.kusnick",
    a: 9,
    s: 8,
    t: 7,
  },
  {
    name: "David Jhave Johnston",
    role: "Postdoctoral fellow",
    img: "jhave.avif",
    url: "https://www4.uib.no/en/find-employees/david-jhave.johnston",
    a: 7,
    s: 8,
    t: 10,
  },
  {
    name: "Jessica Witte",
    role: "Postdoctoral fellow",
    img: "jessica.avif",
    url: "https://www4.uib.no/en/find-employees/jessica-claire.witte",
    a: 8,
    s: 7,
    t: 8,
  },
  {
    name: "Eamon O'Kane",
    role: "Professor",
    img: "eamon.avif",
    url: "https://www4.uib.no/en/find-employees/eamon.okane",
    a: 7,
    s: 7,
    t: 10,
  },
  {
    name: "Anne Sigrid Refsum",
    role: "Postdoctoral fellow",
    img: "anne.avif",
    url: "https://www4.uib.no/en/find-employees/anne-sigrid.refsum",
    a: 8,
    s: 6,
    t: 9,
  },
].map((p, i) => ({
  ...p,
  id: i,
  img: `./portraits/${p.img}`,
  impact: 1 + Math.floor(Math.random() * 40),
  maxNarrative: 1 + Math.floor(Math.random() * 40),
}));

const $ = (s) => document.querySelector(s);
const screens = ["waiting", "draft", "battle", "result"];
const initiative = [2, 1, 0];
let mode = "waiting",
  candidates = [],
  selected = [],
  allies = [],
  enemies = [],
  active = 0,
  enemyActive = 0,
  turn = 1,
  allyMax = 1,
  enemyMax = 1,
  strategy = null,
  autoTimer,
  draftTimer,
  draftSeconds = 9,
  completeSent = false,
  awaitingStrategy = false,
  locked = false,
  audioContext;

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}
function renderBriefingPortraits() {
  const featured = shuffle(people).slice(0, 3);
  document.querySelectorAll("[data-brief-portrait]").forEach((image, i) => {
    image.src = featured[i].img;
    image.alt = `Portrait of ${featured[i].name}`;
  });
}
function show(id) {
  screens.forEach((s) => $(`#${s}`).classList.toggle("visible", s === id));
  mode = id;
}
function fullName(p) {
  return p.name;
}
function card(p, index) {
  return `<button class="candidate" data-index="${index}" aria-pressed="false"><img src="${p.img}" alt="Portrait of ${p.name}"><div class="candidate-info"><h3>${p.name}</h3><p>${p.role}</p><div class="stats combat-stats"><span>Impact ${p.impact}</span><span>Narrative ${p.maxNarrative}</span></div></div></button>`;
}
function begin() {
  if (mode !== "waiting") return;
  candidates = shuffle(people).slice(0, 5);
  $("#candidates").innerHTML = candidates.map(card).join("");
  $("#candidates").addEventListener("click", pick);
  $("#phase").textContent = "Team selection";
  show("draft");
  draftTimer = setInterval(() => {
    draftSeconds--;
    $("#draftTime").textContent = draftSeconds;
    if (draftSeconds <= 0) deploy(true);
  }, 1000);
}
function pick(e) {
  const b = e.target.closest(".candidate");
  if (!b) return;
  const p = candidates[+b.dataset.index],
    at = selected.indexOf(p);
  if (at >= 0) selected.splice(at, 1);
  else if (selected.length < 3) selected.push(p);
  else return;
  document.querySelectorAll(".candidate").forEach((el, i) => {
    const on = selected.includes(candidates[i]);
    el.classList.toggle("selected", on);
    el.setAttribute("aria-pressed", on);
  });
  $("#pickCount").textContent = `${selected.length}/3`;
  $("#deploy").disabled = selected.length !== 3;
}
function deploy(auto = false) {
  if (mode !== "draft") return;
  if (selected.length < 3) {
    for (const p of candidates)
      if (!selected.includes(p) && selected.length < 3) selected.push(p);
  }
  clearInterval(draftTimer);
  allies = selected.map((p) => ({ ...p, narrative: p.maxNarrative }));
  const available = people.filter((p) => !selected.includes(p));
  enemies = shuffle(available)
    .slice(0, 3)
    .map((p) => ({ ...p, narrative: p.maxNarrative }));
  active = initiative[0];
  enemyActive = initiative[0];
  allyMax = allies.reduce((sum, p) => sum + p.maxNarrative, 0);
  enemyMax = enemies.reduce((sum, p) => sum + p.maxNarrative, 0);
  $("#phase").textContent = "Tactical exchange";
  show("battle");
  requestStrategy(auto
    ? "Mission control completed your squad. Choose a strategy; the rival cycles Direct, Guarded, then Balanced."
    : "Squad deployed. Choose a strategy; the rival cycles Direct, Guarded, then Balanced.");
}
function unit(p, i, foe = false) {
  const isActive = foe ? i === enemyActive : i === active;
  return `<button class="unit ${foe ? "foe" : ""} ${isActive ? "active" : ""} ${p.narrative <= 0 ? "used" : ""}" data-index="${i}" disabled>
    <span class="specialty">${p.narrative <= 0 ? "Narrative ended" : "Ready"}</span>
    <span class="unit-portrait"><img src="${p.img}" alt="Portrait of ${p.name}"></span>
    <span class="unit-name">${p.name}</span>
    <span class="unit-stats"><b data-stat="impact" title="Impact">⚔ ${p.impact}</b><b data-stat="narrative" title="Narrative">♥ ${Math.max(0, p.narrative)}</b></span>
  </button>`;
}
function renderBattle() {
  $("#allies").innerHTML = allies.map((p, i) => unit(p, i)).join("");
  $("#enemies").innerHTML = enemies.map((p, i) => unit(p, i, true)).join("");
  const allyHp = allies.reduce((sum, p) => sum + Math.max(0, p.narrative), 0);
  const enemyHp = enemies.reduce((sum, p) => sum + Math.max(0, p.narrative), 0);
  $("#allyHp").textContent = allyHp;
  $("#enemyHp").textContent = enemyHp;
  $("#allyBar").style.width = `${(allyHp / allyMax) * 100}%`;
  $("#enemyBar").style.width = `${(enemyHp / enemyMax) * 100}%`;
  $("#turn").textContent = `Exchange ${turn}`;
  document
    .querySelectorAll("#actions button")
    .forEach((b) => {
      b.disabled = locked || !awaitingStrategy;
      b.classList.toggle("selected-strategy", b.dataset.strategy === strategy);
    });
}
$("#deploy").addEventListener("click", () => deploy(false));
$("#actions").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-strategy]");
  if (!button || locked || !awaitingStrategy || mode !== "battle") return;
  strategy = button.dataset.strategy;
  ensureAudio();
  awaitingStrategy = false;
  renderBattle();
  animateStrategySelection(strategy);
  $("#log").textContent = `${strategy[0].toUpperCase() + strategy.slice(1)} strategy locked in. The fight resumes now.`;
  clearTimeout(autoTimer);
  autoTimer = setTimeout(() => act(), 1250);
});

function ensureAudio() {
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  if (!AudioEngine) return;
  audioContext ||= new AudioEngine();
  if (audioContext.state === "suspended") audioContext.resume();
}
function playImpact(direction) {
  if (!audioContext || audioContext.state !== "running") return;
  const now = audioContext.currentTime;
  const output = audioContext.createGain();
  output.gain.setValueAtTime(0.0001, now);
  output.gain.exponentialRampToValueAtTime(0.14, now + 0.008);
  output.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  let destination = output;
  if (audioContext.createStereoPanner) {
    const pan = audioContext.createStereoPanner();
    pan.pan.value = direction === "right" ? 0.35 : -0.35;
    output.connect(pan);
    pan.connect(audioContext.destination);
  } else {
    output.connect(audioContext.destination);
  }
  const thump = audioContext.createOscillator();
  thump.type = "triangle";
  thump.frequency.setValueAtTime(direction === "right" ? 155 : 135, now);
  thump.frequency.exponentialRampToValueAtTime(48, now + 0.16);
  thump.connect(destination);
  thump.start(now);
  thump.stop(now + 0.18);

  const length = Math.floor(audioContext.sampleRate * 0.1);
  const buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  const crack = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 850;
  crack.buffer = buffer;
  crack.connect(filter);
  filter.connect(destination);
  crack.start(now);
}

function strategyValues(choice) {
  if (choice === "direct") return { bonus: 8, block: 0 };
  if (choice === "guarded") return { bonus: 0, block: 8 };
  return { bonus: 4, block: 4 };
}
function animateStrategySelection(choice) {
  const unit = document.querySelector(`#allies .unit[data-index="${active}"]`);
  if (!unit) return;
  const values = strategyValues(choice);
  const impactBadge = unit.querySelector('[data-stat="impact"]');
  const narrativeBadge = unit.querySelector('[data-stat="narrative"]');
  const preview = document.createElement("span");
  preview.className = "strategy-preview";
  preview.textContent = choice === "direct"
    ? `+${values.bonus} Impact`
    : choice === "guarded"
      ? `+${values.block} Narrative guard`
      : `+${values.bonus} Impact · +${values.block} Narrative guard`;
  unit.append(preview);
  if (values.bonus) {
    impactBadge?.classList.add("stat-boost");
    impactBadge?.insertAdjacentHTML("beforeend", `<em>+${values.bonus}</em>`);
  }
  if (values.block) {
    narrativeBadge?.classList.add("stat-boost");
    narrativeBadge?.insertAdjacentHTML("beforeend", `<em>+${values.block}</em>`);
  }
  setTimeout(() => {
    preview.remove();
    impactBadge?.classList.remove("stat-boost");
    narrativeBadge?.classList.remove("stat-boost");
    unit.querySelectorAll(".unit-stats em").forEach((item) => item.remove());
  }, 1150);
}
function requestStrategy(message) {
  clearTimeout(autoTimer);
  awaitingStrategy = true;
  locked = false;
  renderBattle();
  $("#log").textContent = message;
}
function continueExchange() {
  clearTimeout(autoTimer);
  awaitingStrategy = false;
  locked = true;
  renderBattle();
  autoTimer = setTimeout(() => {
    locked = false;
    act();
  }, 900);
}

function animateAttack(attacker, attackerIndex, target, targetIndex, direction) {
  return new Promise((resolve) => {
    const attackerEl = document.querySelector(
      `${attacker} .unit[data-index="${attackerIndex}"]`,
    );
    const targetEl = document.querySelector(
      `${target} .unit[data-index="${targetIndex}"]`,
    );
    if (!attackerEl) {
      resolve();
      return;
    }
    attackerEl.classList.add(
      direction === "right" ? "attack-right" : "attack-left",
    );
    setTimeout(() => {
      targetEl?.classList.add("taking-hit");
      playImpact(direction);
    }, 510);
    setTimeout(() => {
      attackerEl.classList.remove("attack-right", "attack-left");
      targetEl?.classList.remove("taking-hit");
      resolve();
    }, 920);
  });
}
async function act() {
  if (locked || mode !== "battle") return;
  clearTimeout(autoTimer);
  locked = true;
  const actor = allies[active];
  const foe = enemies[enemyActive];
  const actorBefore = actor.narrative;
  const foeBefore = foe.narrative;
  const rivalStrategy = ["direct", "guarded", "balanced"][(turn - 1) % 3];
  const ours = strategyValues(strategy);
  const theirs = strategyValues(rivalStrategy);
  const actorDamage = Math.max(1, actor.impact + ours.bonus - theirs.block);
  const foeDamage = Math.max(1, foe.impact + theirs.bonus - ours.block);
  document
    .querySelectorAll("#actions button")
    .forEach((b) => (b.disabled = true));
  $("#log").textContent = `${actor.name} advances using the ${strategy} strategy…`;
  await animateAttack("#allies", active, "#enemies", enemyActive, "right");
  if (completeSent) return;
  $("#log").textContent = `${foe.name} counters using the ${rivalStrategy} strategy…`;
  await animateAttack("#enemies", enemyActive, "#allies", active, "left");
  if (completeSent) return;
  foe.narrative = Math.max(0, foe.narrative - actorDamage);
  actor.narrative = Math.max(0, actor.narrative - foeDamage);
  const characterEnded = foe.narrative === 0 || actor.narrative === 0;
  $("#log").textContent = `${actor.name}: ${actorBefore} Narrative − (${foe.impact} Impact + ${theirs.bonus} bonus − ${ours.block} block) = ${actor.narrative}. ${foe.name}: ${foeBefore} Narrative − (${actor.impact} Impact + ${ours.bonus} bonus − ${theirs.block} block) = ${foe.narrative}.`;
  renderBattle();
  active = initiative.find((i) => allies[i].narrative > 0);
  enemyActive = initiative.find((i) => enemies[i].narrative > 0);
  if (active === undefined || enemyActive === undefined) {
    const win = enemyActive === undefined && active !== undefined;
    finish(
      win,
      win
        ? `Your lineup prevailed with ${allies.filter((p) => p.narrative > 0).length} operative${allies.filter((p) => p.narrative > 0).length === 1 ? "" : "s"} still in the narrative.`
        : active === undefined && enemyActive === undefined
          ? "Both lineups ran out of Narrative in the same exchange."
          : `The rival lineup prevailed with ${enemies.filter((p) => p.narrative > 0).length} operative${enemies.filter((p) => p.narrative > 0).length === 1 ? "" : "s"} still in the narrative.`,
    );
    return;
  }
  turn++;
  if (characterEnded) {
    requestStrategy("A character's Narrative ended. Choose a strategy before the new matchup begins.");
  } else {
    continueExchange();
  }
}
function finish(success, text) {
  if (completeSent) return;
  completeSent = true;
  clearInterval(draftTimer);
  clearTimeout(autoTimer);
  show("result");
  $("#phase").textContent = "Debrief";
  $("#resultSeal").textContent = success ? "✓" : "×";
  $("#resultTitle").textContent = success
    ? "Mission accomplished"
    : "Mission unresolved";
  $("#resultText").textContent = text;
  window.parent.postMessage(
    { type: "defrag:complete", success, result: text },
    "*",
  );
}
window.addEventListener("message", (e) => {
  if (e.data?.type === "defrag:start") begin();
  if (e.data?.type === "defrag:timeout")
    finish(
      false,
      "Mission control ended the operation after the 100-second limit.",
    );
});
renderBriefingPortraits();
