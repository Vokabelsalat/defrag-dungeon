const people = [
  {name:'Ola Roth Johnsen', role:'Administrative Project Leader', img:'ola.avif', url:'https://www4.uib.no/finn-ansatte/Ola.Roth.Johnsen', a:7,s:9,t:5},
  {name:'Mahaut de Vareilles', role:'Research Adviser and Impact Manager', img:'mahaut.avif', url:'https://www4.uib.no/finn-ansatte/Mahaut.de.Vareilles', a:7,s:6,t:9},
  {name:'Andreas Hadsel Opsvik', role:'Communication coordinator', img:'andreas.avif', url:'https://www4.uib.no/finn-ansatte/Andreas.Hadsel.Opsvik', a:5,s:7,t:10},
  {name:'Scott Rettberg', role:'Center Director', img:'scott.avif', url:'https://www4.uib.no/finn-ansatte/Scott.Rettberg', a:7,s:8,t:9},
  {name:'Jill Walker Rettberg', role:'Professor and Co-Director', img:'jill.avif', url:'https://www4.uib.no/finn-ansatte/Jill.Walker.Rettberg', a:9,s:6,t:9},
  {name:'Hannah Ackermans', role:'Postdoctoral fellow', img:'hannah.avif', url:'https://www.uib.no/nb/personer/Hannah.Maria.Leontine.Ackermans', a:8,s:6,t:8},
  {name:'Gabriele de Seta', role:'Researcher and project leader', img:'gabriele.avif', url:'https://www.uib.no/nb/personer/Gabriele.de.Seta', a:9,s:7,t:7},
  {name:'Caitlin Fisher', role:'Professor II', img:'caitlin.avif', url:'https://www.uib.no/nb/personer/Caitlin.Fisher', a:8,s:5,t:10},
  {name:'Marianne Gunderson', role:'Postdoctoral fellow, ALGOFOLK', img:'marianne.avif', url:'https://www.uib.no/nb/personer/Marianne.Gunderson', a:9,s:7,t:6},
  {name:'Elise Marie Strand Hagen', role:'Research assistant', img:'elise.avif', url:'https://www.uib.no/nb/personer/Elise.Marie.Strand.Hagen', a:6,s:9,t:7},
  {name:'Lina Ruth Harder', role:'PhD fellow, XDN', img:'lina.avif', url:'https://www.uib.no/nb/personer/Lina.Ruth.Harder', a:7,s:8,t:8},
  {name:'Kristine Jørgensen', role:'Professor', img:'kristine.avif', url:'https://www.uib.no/nb/personer/Kristine.J%C3%B8rgensen', a:9,s:8,t:6},
  {name:'Tom Legierse', role:'PhD candidate', img:'tom.avif', url:'https://www.uib.no/nb/personer/Tom.Legierse', a:7,s:9,t:6},
  {name:'Jasmine Mattey', role:'PhD fellow', img:'jasmine.avif', url:'https://www.uib.no/nb/personer/Jasmine.Angel.Mattey', a:8,s:6,t:8},
  {name:'Nick Montfort', role:'Professor II', img:'nick.avif', url:'https://www.uib.no/nb/personer/Nick.Montfort', a:8,s:10,t:6},
  {name:'Jason Nelson', role:'Professor, Digital Culture', img:'jason.avif', url:'https://www.uib.no/nb/personer/Jason.Nelson', a:5,s:8,t:10},
  {name:'Lin Prøitz', role:'Professor II', img:'lin.avif', url:'https://www.uib.no/nb/personer/Lin.Pr%C3%B8itz', a:8,s:5,t:9},
  {name:'Sérgio Galvão Roxo', role:'PhD fellow', img:'sergio.avif', url:'https://www.uib.no/nb/personer/S%C3%A9rgio.Galv%C3%A3o.Roxo', a:7,s:9,t:7},
  {name:'Ida Martine Gard Rysjedal', role:'PhD fellow', img:'ida.avif', url:'https://www.uib.no/nb/personer/Ida.Martine.Gard.Rysjedal', a:9,s:6,t:7},
  {name:'Debarun Sarkar', role:'Postdoctoral fellow', img:'debarun.avif', url:'https://www.uib.no/nb/personer/Debarun.Sarkar', a:8,s:8,t:6}
].map((p,i)=>({...p,id:i,img:`./portraits/${p.img}`}));

const $ = s => document.querySelector(s);
const screens = ['waiting','draft','battle','result'];
const skills = {analysis:{label:'Analyze', stat:'a', beats:'story'}, systems:{label:'Disrupt',stat:'s',beats:'analysis'}, story:{label:'Rally',stat:'t',beats:'systems'}};
const initiative = [2,1,0];
let mode='waiting', candidates=[], selected=[], allies=[], enemies=[], active=0, turn=1, allyHp=100, enemyHp=100, used=new Set(), draftTimer, draftSeconds=9, completeSent=false, locked=false;

function shuffle(list){ return [...list].sort(()=>Math.random()-.5); }
function show(id){ screens.forEach(s=>$(`#${s}`).classList.toggle('visible',s===id)); mode=id; }
function fullName(p){ return p.name; }
function specialty(p){ const m=Math.max(p.a,p.s,p.t); return p.a===m?'Analysis':p.s===m?'Systems':'Story'; }
function card(p,index){
  return `<button class="candidate" data-index="${index}" aria-pressed="false"><img src="${p.img}" alt="Portrait of ${p.name}"><div class="candidate-info"><h3>${p.name}</h3><p>${p.role}</p><div class="stats"><span>A ${p.a}</span><span>S ${p.s}</span><span>T ${p.t}</span></div></div></button>`;
}
function begin(){
  if(mode!=='waiting') return;
  candidates=shuffle(people).slice(0,5);
  $('#candidates').innerHTML=candidates.map(card).join('');
  $('#candidates').addEventListener('click',pick);
  $('#phase').textContent='Team selection';
  show('draft');
  draftTimer=setInterval(()=>{ draftSeconds--; $('#draftTime').textContent=draftSeconds; if(draftSeconds<=0) deploy(true); },1000);
}
function pick(e){
  const b=e.target.closest('.candidate'); if(!b) return;
  const p=candidates[+b.dataset.index], at=selected.indexOf(p);
  if(at>=0) selected.splice(at,1); else if(selected.length<3) selected.push(p); else return;
  document.querySelectorAll('.candidate').forEach((el,i)=>{ const on=selected.includes(candidates[i]); el.classList.toggle('selected',on); el.setAttribute('aria-pressed',on); });
  $('#pickCount').textContent=`${selected.length}/3`; $('#deploy').disabled=selected.length!==3;
}
function deploy(auto=false){
  if(mode!=='draft') return;
  if(selected.length<3){ for(const p of candidates) if(!selected.includes(p)&&selected.length<3) selected.push(p); }
  clearInterval(draftTimer); allies=selected.map(p=>({...p,hp:3}));
  const available=people.filter(p=>!selected.includes(p)); enemies=shuffle(available).slice(0,3).map(p=>({...p,hp:3}));
  active=initiative[0]; $('#phase').textContent='Tactical exchange'; show('battle'); renderBattle();
  $('#log').textContent=auto?'Mission control completed your squad. The inward operative acts first. Choose an approach.':'Squad deployed. The inward operative acts first. Choose an approach.';
}
function unit(p,i,foe=false){
  const best=Math.max(p.a,p.s,p.t);
  return `<button class="unit ${foe?'foe':''} ${!foe&&i===active?'active':''} ${!foe&&used.has(i)?'used':''}" data-index="${i}" disabled>
    <span class="specialty">${specialty(p)}</span>
    <span class="unit-portrait"><img src="${p.img}" alt="Portrait of ${p.name}"></span>
    <span class="unit-name">${p.name}</span>
    <span class="unit-stats"><b title="Primary skill">✦ ${best}</b><b title="Stamina">♥ ${p.a+p.s+p.t}</b></span>
  </button>`;
}
function renderBattle(){
  $('#allies').innerHTML=allies.map((p,i)=>unit(p,i)).join(''); $('#enemies').innerHTML=enemies.map((p,i)=>unit(p,i,true)).join('');
  $('#allyHp').textContent=Math.max(0,allyHp); $('#enemyHp').textContent=Math.max(0,enemyHp);
  $('#allyBar').style.width=`${Math.max(0,allyHp)}%`; $('#enemyBar').style.width=`${Math.max(0,enemyHp)}%`;
  $('#turn').textContent=`Turn ${turn} / 6`;
  document.querySelectorAll('#actions button').forEach(b=>b.disabled=locked);
}
$('#deploy').addEventListener('click',()=>deploy(false));
$('#actions').addEventListener('click',e=>{ const b=e.target.closest('button[data-skill]'); if(!b||locked||mode!=='battle') return; act(b.dataset.skill); });

function roll(actor,skill,otherSkill){
  let score=8+actor[skills[skill].stat]+Math.floor(Math.random()*10);
  let note='solid'; if(skills[skill].beats===otherSkill){score+=8;note='advantage';} else if(skills[otherSkill].beats===skill){score-=4;note='countered';}
  if(Math.random()<.12){score+=8;note='critical';} return {score:Math.max(5,score),note};
}
function animateAttack(attacker, target, direction){
  return new Promise(resolve=>{
    const attackerEl=document.querySelector(`${attacker} .unit[data-index="${direction==='right'?active:target}"]`);
    const targetEl=document.querySelector(`${direction==='right'?'#enemies':'#allies'} .unit[data-index="${direction==='right'?target:active}"]`);
    if(!attackerEl){ resolve(); return; }
    attackerEl.classList.add(direction==='right'?'attack-right':'attack-left');
    setTimeout(()=>targetEl?.classList.add('taking-hit'),510);
    setTimeout(()=>{
      attackerEl.classList.remove('attack-right','attack-left');
      targetEl?.classList.remove('taking-hit');
      resolve();
    },920);
  });
}
async function act(skill){
  locked=true; used.add(active); const actor=allies[active], enemyIndex=initiative[(turn-1)%initiative.length], foe=enemies[enemyIndex];
  const enemySkill=shuffle(Object.keys(skills))[0], ours=roll(actor,skill,enemySkill), theirs=roll(foe,enemySkill,skill);
  document.querySelectorAll('#actions button').forEach(b=>b.disabled=true);
  $('#log').textContent=`${actor.name} charges a ${skills[skill].label} attack…`;
  await animateAttack('#allies',enemyIndex,'right');
  if(completeSent) return;
  $('#log').textContent=`${foe.name} braces, then counters with ${skills[enemySkill].label}…`;
  await animateAttack('#enemies',enemyIndex,'left');
  if(completeSent) return;
  enemyHp-=ours.score; allyHp-=theirs.score;
  $('#log').textContent=`${actor.name}: ${ours.score} impact (${ours.note}). ${foe.name}: ${theirs.score} impact (${theirs.note}).`;
  renderBattle();
  if(enemyHp<=0||allyHp<=0||turn>=6){ const win=enemyHp<=0||(allyHp>0&&allyHp>enemyHp); finish(win,win?`Your task force prevailed with ${Math.max(0,allyHp)} resolve remaining.`:`The rival team held the field with ${Math.max(0,enemyHp)} resolve remaining.`); return; }
  turn++; if(used.size===allies.length) used.clear(); active=initiative.find(i=>!used.has(i)); locked=false; renderBattle();
}
function finish(success,text){
  if(completeSent) return; completeSent=true; clearInterval(draftTimer); show('result'); $('#phase').textContent='Debrief';
  $('#resultSeal').textContent=success?'✓':'×'; $('#resultTitle').textContent=success?'Mission accomplished':'Mission unresolved'; $('#resultText').textContent=text;
  window.parent.postMessage({type:'defrag:complete',success,result:text},'*');
}
window.addEventListener('message',e=>{ if(e.data?.type==='defrag:start') begin(); if(e.data?.type==='defrag:timeout') finish(false,'Mission control ended the operation after the 100-second limit.'); });
