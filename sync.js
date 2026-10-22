'use strict';
window.VocabCloud=(()=>{
 const C=window.VOCAB_SYNC_CONFIG||{},K='haru-vocab-v1',E='haru-vocab-answer-events-v1',T='haru-vocab-sync-code-v1';
 let running=null,again=false,status='연결 준비 중',key='',legacyKey='';
 const shared=/^[a-f0-9]{64}$/.test(C.sharedCode||'');
 const read=(k,fallback)=>{try{return JSON.parse(localStorage.getItem(k))||fallback}catch{return fallback}};
 const unique=items=>[...new Map(items.map(x=>[x.id,x])).values()];
 const notify=()=>{document.querySelectorAll('[data-sync-status]').forEach(el=>el.textContent=status)};
 const setStatus=t=>{status=t;notify()};
 const valid=r=>r&&typeof r.id==='string'&&Array.isArray(r.answers)&&(Number.isFinite(r.score)||((r.kind==='phonics'||r.mode==='flash')&&r.score===null))&&Number.isFinite(Date.parse(r.finishedAt));
 async function request(table,method='GET',body=null,query=''){
  const response=await fetch(C.url+'/rest/v1/'+table+query,{method,headers:{apikey:C.key,'x-vocab-key':key,'Content-Type':'application/json',Prefer:'resolution=ignore-duplicates,return=minimal'},body:body?JSON.stringify(body):null,signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error('동기화 실패 ('+response.status+')');return response.status===204||method!=='GET'?null:response.json();
 }
 async function hash(){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(key)))].map(x=>x.toString(16).padStart(2,'0')).join('')}
 async function rows(table,h){const result=[];for(let offset=0;;offset+=1000){const batch=await request(table,'GET',null,'?key_hash=eq.'+h+'&order=id&limit=1000&offset='+offset);result.push(...batch);if(batch.length<1000)return result}}
 async function upload(table,items,h,time){for(let i=0;i<items.length;i+=200)await request(table,'POST',items.slice(i,i+200).map(payload=>({key_hash:h,id:payload.id,happened_at:time(payload),payload})))}
 const recordTime=r=>r.recordedAt||r.finishedAt;
 async function migrate(){if(!legacyKey)return;key=legacyKey;await run();key=C.sharedCode;localStorage.removeItem('haru-vocab-reset-at');localStorage.setItem(T,key);legacyKey=''}
 async function run(){
  if(!C.url||!C.key)return;
  setStatus('동기화 중');const h=await hash();await request('vocab_sync_profiles','POST',[{key_hash:h}]);
  const profiles=await request('vocab_sync_profiles','GET',null,'?key_hash=eq.'+h);if(!profiles.length)throw Error('연결 코드 확인이 필요합니다.');let cutoff=Date.parse(profiles[0].reset_at);
  const [remoteRecords,remoteEvents]=await Promise.all([rows('vocab_sync_records',h),rows('vocab_sync_answers',h)]);
  const records=read(K,[]).filter(valid).filter(r=>Date.parse(recordTime(r))>=cutoff),events=read(E,[]).filter(e=>Date.parse(e.at)>=cutoff);
  const knownRecords=new Set(remoteRecords.map(r=>r.id)),knownEvents=new Set(remoteEvents.map(e=>e.id));
  await upload('vocab_sync_records',records.filter(r=>!knownRecords.has(r.id)),h,recordTime);await upload('vocab_sync_answers',events.filter(e=>!knownEvents.has(e.id)),h,e=>e.at);
  const latestProfile=await request('vocab_sync_profiles','GET',null,'?key_hash=eq.'+h);cutoff=Math.max(cutoff,Date.parse(latestProfile[0].reset_at),Number(localStorage.getItem('haru-vocab-reset-at')||0));
  const mergedRecords=unique([...remoteRecords.map(r=>r.payload).filter(valid),...read(K,[]).filter(valid)]).filter(r=>Date.parse(recordTime(r))>=cutoff);
  const mergedEvents=unique([...remoteEvents.map(e=>e.payload),...read(E,[])]).filter(e=>Date.parse(e.at)>=cutoff);
  localStorage.setItem(K,JSON.stringify(mergedRecords));localStorage.setItem(E,JSON.stringify(mergedEvents));
  const draft=read('haru-vocab-draft-v1',null);if(draft&&Date.parse(draft.startedAt)<cutoff)localStorage.removeItem('haru-vocab-draft-v1');
  window.dispatchEvent(new CustomEvent('vocab-cloud-update',{detail:{records:mergedRecords,events:mergedEvents,cutoff}}));setStatus('동기화 완료');
 }
 function sync(){if(running){again=true;return running}running=(async()=>{try{do{again=false;await migrate();await run()}while(again)}catch(e){setStatus(navigator.onLine?'동기화 재시도 필요':'오프라인 · 기기에 저장됨');throw e}finally{running=null}})();return running}
 function event(id,correct,s){const events=read(E,[]),entry={id:s.id+':'+s.index,wordId:id,correct,at:new Date().toISOString()};try{if(!events.some(e=>e.id===entry.id)){events.push(entry);localStorage.setItem(E,JSON.stringify(events))}}catch{setStatus('기기 저장 재시도 필요')}sync().catch(()=>{})}
 function seed(records,draft){const events=read(E,[]),known=new Set(events.map(e=>e.id));for(const r of records.filter(r=>!r.manual))r.answers.forEach((a,i)=>{if(typeof a.correct==='boolean'&&!known.has(r.id+':'+i))events.push({id:r.id+':'+i,wordId:a.id,correct:a.correct,at:r.finishedAt})});if(draft)draft.answers.forEach((a,i)=>{if(typeof a.correct==='boolean'&&!known.has(draft.id+':'+i))events.push({id:draft.id+':'+i,wordId:a.id,correct:a.correct,at:draft.startedAt})});localStorage.setItem(E,JSON.stringify(unique(events)))}
 async function connect(code){if(shared)throw Error('공용 기록은 자동으로 연결됩니다.');if(!/^[a-f0-9]{64}$/.test(code.trim()))throw Error('연결 코드 64자리를 확인해 주세요.');if(running)try{await running}catch{}const previous=key;key=code.trim();try{await sync();localStorage.setItem(T,key)}catch(e){key=previous;throw e}}
 async function reset(){if(running)await running;if(C.url&&C.key){const h=await hash();await request('vocab_sync_profiles','PATCH',{reset_at:new Date().toISOString()},'?key_hash=eq.'+h);await Promise.all([request('vocab_sync_records','DELETE',null,'?key_hash=eq.'+h),request('vocab_sync_answers','DELETE',null,'?key_hash=eq.'+h)])}localStorage.setItem(E,'[]');setStatus('동기화 완료')}
 function init(records,draft){try{key=localStorage.getItem(T)||'';if(shared){if(/^[a-f0-9]{64}$/.test(key)&&key!==C.sharedCode)legacyKey=key;else{key=C.sharedCode;localStorage.setItem(T,key)}}if(!/^[a-f0-9]{64}$/.test(key)){key=[...crypto.getRandomValues(new Uint8Array(32))].map(x=>x.toString(16).padStart(2,'0')).join('');localStorage.setItem(T,key)}seed(records,draft);sync().catch(()=>{})}catch{setStatus('브라우저 저장 설정 확인 필요')}window.addEventListener('online',()=>{const pending=running||Promise.resolve();pending.catch(()=>{}).then(()=>sync()).catch(()=>{})});document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync().catch(()=>{})});setInterval(()=>{if(!document.hidden&&navigator.onLine)sync().catch(()=>{})},30000)}
 return {init,sync,event,connect,reset,shared,get code(){return key},get status(){return status},notify};
})();
