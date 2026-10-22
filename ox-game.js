'use strict';
// The academy vocabulary is read-only. False pairs reference another source item.
window.VocabOX=(()=>{
 const landscape=matchMedia('(min-width:768px) and (min-height:500px) and (orientation:landscape)');
 const available=()=>landscape.matches;
 const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
 let landingTimer=null,drag=null,launching=false,answering=false;
 const confirmed=new Set(),restoring=new Set();
 function cancel(){clearTimeout(landingTimer);landingTimer=null;drag=null;}
 function syncScreen(){document.documentElement.classList.toggle('tablet-landscape',available());if(typeof session!=='undefined'&&session?.mode==='ox'&&location.hash==='#study')render(session);}
 landscape.addEventListener('change',syncScreen);
 window.addEventListener('resize',()=>{if(drag)drag=null;syncScreen();});
 document.documentElement.classList.toggle('tablet-landscape',available());
 function cube(part,front=''){return `<span class="ox-cube ox-${part}">${['front','back','left','right','top','bottom'].map(face=>`<i class="ox-face ox-face-${face}">${face==='front'?front:''}</i>`).join('')}</span>`;}
 function avatar(){return VocabStyle.avatar(cube,VocabPoints.wallet.equipped);}
 function serviceError(message,retry){document.body.className='ox-view';app.innerHTML=`<section class="ox-service-error"><h1>게임 연결을 확인해줘</h1><p>${esc(message)}</p><button class="primary" data-ox-reconnect>다시 연결</button><a class="button" href="#days">Day로</a></section>`;app.querySelector('[data-ox-reconnect]').onclick=retry;}
 function adopt(s,r,showAnswer=false){
  const answered=showAnswer||r.status!=='active'||r.index>s.index||s.chosen!==null;
  s.id=r.id;s.day=r.day;s.ids=r.rounds.map(x=>x.id);s.oxRounds=r.rounds;s.answers=r.answers;s.startedAt=r.startedAt;
  s.oxEnded=r.status!=='active';s.oxCleared=r.status==='cleared';s.oxFinishedAt=r.finishedAt;
  s.oxReward={base:r.base,award:r.award,improved:r.improved};
  s.index=answered&&r.index>0?r.index-1:r.index;s.chosen=answered&&r.index>0?(r.answers.at(-1).selected?'o':'x'):null;
  delete s.oxPending;confirmed.add(r.id);draft();
 }
 async function restore(s){
  if(restoring.has(s.id))return;restoring.add(s.id);
  try{const data=await VocabPoints.request('resume',{id:s.id});if(session!==s)return;adopt(s,data.run);if(location.hash==='#study')render(s);}
  catch(e){if(session===s&&location.hash==='#study')serviceError(e.message,()=>restore(s));}
  finally{restoring.delete(s.id);}
 }
 async function launch(day){
  if(launching||!available())return;unlockSound();launching=true;const oldHash=location.hash;
  let id=crypto.randomUUID();try{const pending=JSON.parse(localStorage.getItem('haru-ox-start-pending')||'null');if(pending?.day===day)id=pending.id;localStorage.setItem('haru-ox-start-pending',JSON.stringify({day,id}));}catch{}
  document.querySelectorAll('[data-mode="ox"]').forEach(b=>{b.disabled=true;b.textContent='준비 중…';});
  try{const data=await VocabPoints.request('start',{day,id});try{localStorage.removeItem('haru-ox-start-pending')}catch{}if(!available()||location.hash!==oldHash)return;
   start(day,'ox','en',data.run.rounds.map(x=>x.id),false,{oxRun:data.run});
  }catch(e){if(location.hash===oldHash)toast(e.message);}
  finally{launching=false;document.querySelectorAll('[data-mode="ox"]').forEach(b=>{b.disabled=false;b.textContent='O·X 게임';});}
 }
 // Deterministic participants survive reloads without affecting server scoring.
 function crowd(s){
  const total=s.ids.length,seed=[...s.id].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,0);
  return Array.from({length:24},(_,id)=>{
   const rank=(id+(seed%24))%24;
   const fall=rank<2?total-1:Math.floor((rank-2)*Math.max(1,total-1)/22);
   return {id,fall,hair:1+(id*7+seed)%30,skin:1+(id*3+seed)%30};
  }).filter(n=>n.fall>=s.index);
 }
 function crowdSide(s,n,selected){return s.index===s.ids.length-1?!selected:(n.fall===s.index?!s.oxRounds[s.index].expected:s.oxRounds[s.index].expected);}
 function crowdMarkup(s,answered,selected){
  const participants=crowd(s),alive=answered?participants.filter(n=>crowdSide(s,n,selected)===s.oxRounds[s.index].expected).length:participants.length;
  return `<span class="ox-crowd-count">컴퓨터 <b>${alive}</b>명 ${answered?'생존':'참가 중'}</span><div class="ox-crowd" aria-hidden="true">${participants.map((n,i)=>{
   const side=crowdSide(s,n,selected),fall=answered&&side!==s.oxRounds[s.index].expected;
   const x=answered?(side?24:76)+(i%6-2.5)*3.4:36+(i%6)*5.6;
   return `<div class="ox-npc ${answered?(fall?'eliminated':'survived'):'waiting'}" data-npc="${n.id}" style="left:${x}%;bottom:${answered?20+Math.floor(i/6)*9:19+Math.floor(i/6)*11}%;--wander:${(i%2?1:-1)*(6+i%4)}px;--phase:-${i*.37}s"><span class="npc-number">${String(n.id+1).padStart(2,'0')}</span>${VocabStyle.avatar(cube,{hair:n.hair,skin:n.skin})}<span class="ox-shadow"></span></div>`;
  }).join('')}</div>`;
 }
 function moveCrowd(s,selected){
  crowd(s).forEach((n,i)=>{const el=app.querySelector(`[data-npc="${n.id}"]`);if(!el)return;el.classList.remove('waiting');el.classList.add('walking');el.style.left=((crowdSide(s,n,selected)?24:76)+(i%6-2.5)*3.4)+'%';el.style.bottom=(20+Math.floor(i/6)*9)+'%';});
 }
 function render(s){
  cancel();document.body.className='ox-view';
  if(!available()){app.innerHTML=`<section class="ox-rotation"><span aria-hidden="true">↻</span><h1>넓은 가로 화면에서 열어줘</h1><p>O·X 게임은 PC·태블릿 가로 화면에서 할 수 있어.<br>진행한 문제는 그대로 남아 있어.</p><button data-action="leave-study">단어장으로</button></section>`;return;}
  if(!confirmed.has(s.id)){app.innerHTML='<section class="ox-service-error"><h1>저장된 게임을 확인하고 있어…</h1></section>';restore(s);return;}
  const r=s.oxRounds[s.index],w=WORDS.find(x=>x.id===r.id),meaning=WORDS.find(x=>x.id===r.meaningId),answered=s.chosen!==null;
  const correct=answered?s.answers.at(-1).correct:null,selected=s.chosen==='o';
  app.innerHTML=`<section class="ox-game" aria-label="영어 O·X 게임"><div class="ox-topbar"><button class="ox-back" data-action="leave-study" aria-label="학습 나가기">←</button><div><span class="ox-eyebrow">O · X CHALLENGE</span><h1>${studyLabel(s)} <em>O·X 게임</em></h1></div><div class="ox-game-stats"><button class="ox-closet" data-open-wardrobe>꾸미기 <b data-wallet-balance>${VocabPoints.format(VocabPoints.wallet.balance)}P</b></button><span>${s.index+1}<small> / ${s.ids.length}</small></span><button data-ox-sound aria-label="${soundEnabled?'소리 끄기':'소리 켜기'}" aria-pressed="${!soundEnabled}">${soundEnabled?'♪':'♪̸'}</button></div></div><div class="ox-progress" role="progressbar" aria-label="진행" aria-valuenow="${s.index}" aria-valuemin="0" aria-valuemax="${s.ids.length}"><i style="width:${s.index/s.ids.length*100}%"></i></div><div class="ox-question"><span class="ox-question-label">단어와 뜻이 맞을까?</span><div class="ox-english" lang="en">${esc(w.en)}</div><div class="ox-meaning" lang="ko">${esc(meaning.ko)}</div></div><div class="ox-arena ${answered?'answered '+(correct?'win':'miss'):''}" data-ox-arena><div class="ox-cloud cloud-one"></div><div class="ox-cloud cloud-two"></div><div class="ox-horizon"></div><div class="ox-track"></div><button class="ox-platform ox-platform-o ${answered&&r.expected?'expected':''}" data-ox-choice="o" aria-label="O, 단어와 뜻이 맞아요" ${answered?'disabled':''}><span>O</span><small>맞아요</small></button><button class="ox-platform ox-platform-x ${answered&&!r.expected?'expected':''}" data-ox-choice="x" aria-label="X, 단어와 뜻이 달라요" ${answered?'disabled':''}><span>X</span><small>달라요</small></button><div class="ox-start-pad"></div>${crowdMarkup(s,answered,selected)}<div class="ox-runner ${answered?(correct?'cheering':'falling'):'waiting'}" style="left:${answered?(selected?24:76):50}%" role="img" aria-label="나의 블록 캐릭터" data-ox-runner><span class="ox-me">나</span>${avatar()}<span class="ox-shadow"></span></div><div class="ox-particles" aria-hidden="true">${answered&&correct?sparkles():''}</div></div><div class="ox-bottom ${answered?'is-feedback '+(correct?'good':'bad'):''}" aria-live="polite">${answered?feedback(w,r,correct,s):'<span class="ox-touch-hint"><i aria-hidden="true">↔</i> O·X 발판을 누르거나 캐릭터를 끌어줘</span><span class="ox-hint-sub">맞으면 왼쪽 O · 다르면 오른쪽 X</span>'}</div></section>`;
  bind(s);
 }
 function sparkles(){return Array.from({length:16},(_,i)=>`<i style="--angle:${i*22.5}deg;--delay:${i%3*.07}s;--spark-color:${['#f0b746','#46a790','#ec7f73','#88b3d4'][i%4]}"></i>`).join('');}
 function feedback(w,r,correct,s){return `<div class="ox-feedback-copy"><strong>${correct?'정답! 잘했어!':'괜찮아, 함께 기억해 보자!'}</strong><p><b>${esc(w.en)}</b> <span>${esc(w.ko)}</span></p><small>이 짝은 ${r.expected?'O · 맞는 뜻이야':'X · 다른 단어의 뜻이야'}</small></div><button class="primary" data-action="next">${s.oxEnded?'포인트 확인':'다음 문제 →'}</button>`;}
 // Resume on the touch gesture itself, before any network await (iPad/Safari autoplay policy).
 function unlockSound(){if(!soundEnabled||document.hidden)return;try{const AudioCtor=window.AudioContext||window.webkitAudioContext;if(!AudioCtor)return;feedbackContext=feedbackContext||new AudioCtor();if(feedbackContext.state!=='running')feedbackContext.resume().catch(()=>{});}catch{}}
 function movementSound(){
  if(!soundEnabled||document.hidden)return;
  try{const AudioCtor=window.AudioContext||window.webkitAudioContext;if(!AudioCtor)return;feedbackContext=feedbackContext||new AudioCtor();const ctx=feedbackContext;ctx.resume().then(()=>{if(document.hidden||!soundEnabled)return;const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime;o.type='sine';o.frequency.setValueAtTime(180,t);o.frequency.exponentialRampToValueAtTime(330,t+.12);g.gain.setValueAtTime(.025,t);g.gain.exponentialRampToValueAtTime(.001,t+.16);o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+.18);o.onended=()=>{o.disconnect();g.disconnect();};}).catch(()=>{});}catch{}
 }
 async function choose(choice){
  if(answering||!available()||!session||session.mode!=='ox'||session.chosen!==null||document.querySelector('dialog[open]')||document.hidden)return;
  unlockSound();const s=session,index=s.index,sessionId=s.id;answering=true;s.oxPending={index,choice};draft();
  app.querySelectorAll('[data-ox-choice]').forEach(b=>b.disabled=true);
  try{
   const response=await VocabPoints.request('answer',{id:s.id,index,selected:choice==='o'});
   if(session!==s)return;const correct=response.answer.correct;adopt(s,response.run,true);
   rememberAnswer(s.ids[index],correct,false,false);draft();
   if(location.hash!=='#study'||!available())return;
   movementSound();const actor=app.querySelector('[data-ox-runner]');if(!actor){render(s);return;}
   actor.classList.remove('waiting');actor.classList.add('walking');moveCrowd(s,choice==='o');actor.style.left=choice==='o'?'24%':'76%';
   const hint=app.querySelector('.ox-touch-hint');if(hint)hint.textContent='선택한 발판으로 이동 중…';
   function settle(){if(session?.id!==sessionId||session.index!==index||location.hash!=='#study')return;const dialog=document.querySelector('dialog[open]');if(dialog){dialog.addEventListener('close',()=>requestAnimationFrame(settle),{once:true});return;}render(s);if(!document.hidden)answerFeedback(correct);app.querySelector('[data-action="next"]')?.focus({preventScroll:true});}
   landingTimer=setTimeout(settle,reduced()?20:720);
  }catch(e){if(session===s&&location.hash==='#study'){confirmed.delete(s.id);serviceError(e.message,()=>restore(s));}}
  finally{answering=false;}
 }
 function result(r){
  document.body.className='';const reward=r.points||{base:0,award:0,improved:false};
  app.innerHTML=`<section class="result ox-result"><span class="ox-eyebrow">DAY CHALLENGE</span><h1>${dayName(r.day)} ${r.cleared?'끝까지 통과!':'다음에 다시 도전해 보자!'}</h1><div class="ox-result-hero">${avatar()}<div><div class="ox-point-award">+${VocabPoints.format(reward.award)}<small> P</small></div><div class="ox-reward-note">${reward.base?reward.improved?'새 최고 기록 · 100% 지급':'이전 최고 기록 이하 · 50% 지급':'마지막 3문제에 도달하면 포인트를 받을 수 있어.'}</div></div></div><p class="ox-reward-note">${r.cleared?`전체 ${r.dayTotal}문제 정답!`:`${r.correct}개 정답 후 ${r.total}번째 문제에서 탈락 · ${r.remainingAtFall}문제 남음`}<br>현재 공용 포인트 <b data-wallet-balance>${VocabPoints.format(VocabPoints.wallet.balance)}P</b></p><p class="ox-best-line">Day별 최고 정답 기록은 내려가지 않아.<br>같거나 낮은 기록은 기본 포인트의 50%를 받아.</p><div class="actions"><button class="primary" data-action="restart">Day 전체 다시 도전</button><button data-open-wardrobe>캐릭터 꾸미기</button><a class="button" href="#day/${r.day}">단어장</a><a class="button" href="#history">학습 기록</a></div><p class="ox-result-history">${r.correct}/${r.total}개 정답 · 학습 정확도 ${r.score}점</p><p class="sync-status" data-sync-status>${esc(VocabCloud.status)}</p></section>`;
  VocabPoints.refresh().catch(()=>{});
 }
 function bind(s){
  app.querySelectorAll('[data-ox-choice]').forEach(button=>button.onclick=()=>choose(button.dataset.oxChoice));
  app.querySelector('[data-ox-sound]').onclick=()=>{soundEnabled=!soundEnabled;if(soundEnabled)unlockSound();try{localStorage.setItem('haru-vocab-sound',soundEnabled?'on':'off')}catch{}render(s);};
  const actor=app.querySelector('[data-ox-runner]'),arena=app.querySelector('[data-ox-arena]');
  actor.onpointerdown=e=>{if(s.chosen!==null||e.button!==0)return;e.preventDefault();actor.setPointerCapture(e.pointerId);drag={x:e.clientX,y:e.clientY,pointerId:e.pointerId};actor.classList.add('dragging');};
  actor.onpointermove=e=>{if(!drag||drag.pointerId!==e.pointerId)return;const bounds=arena.getBoundingClientRect(),x=Math.max(.16,Math.min(.84,(e.clientX-bounds.left)/bounds.width));actor.style.left=x*100+'%';};
  actor.onpointerup=e=>{if(!drag||drag.pointerId!==e.pointerId)return;const dx=e.clientX-drag.x;drag=null;actor.classList.remove('dragging');if(Math.abs(dx)>45)choose(dx<0?'o':'x');else actor.style.left='50%';};
  actor.onpointercancel=()=>{drag=null;actor.classList.remove('dragging');if(s.chosen===null)actor.style.left='50%';};
 }
 document.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key)||e.repeat||document.querySelector('dialog[open]')||location.hash!=='#study'||typeof session==='undefined'||session?.mode!=='ox')return;e.preventDefault();choose(e.key==='ArrowLeft'?'o':'x');});
 window.addEventListener('hashchange',cancel);
 return {available,render,cancel,cube,launch,adopt,result,crowd,crowdSide};
})();
