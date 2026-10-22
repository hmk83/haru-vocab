'use strict';
window.VocabPoints=(()=>{
 const C=window.VOCAB_SYNC_CONFIG||{},cacheKey='haru-ox-wallet-v1';
 let wallet={balance:0,version:0,equipped:{},owned:[],best:[]},ready=false,refreshing=null;
 try{const cached=JSON.parse(localStorage.getItem(cacheKey)||'null');if(cached&&Number.isFinite(cached.balance))wallet=cached;}catch{}
 const format=n=>new Intl.NumberFormat('ko-KR').format(Number(n)||0);
 function notify(){document.querySelectorAll('[data-wallet-balance]').forEach(el=>el.textContent=format(wallet.balance)+'P');}
 async function request(action,payload={}){
  const response=await fetch(C.url+'/rest/v1/rpc/vocab_game_action',{method:'POST',headers:{apikey:C.key,'x-vocab-key':window.VocabCloud?.code||C.sharedCode||'','Content-Type':'application/json'},body:JSON.stringify({p_action:action,p_payload:payload}),signal:AbortSignal.timeout(15000)});
  let data;try{data=await response.json()}catch{throw Error('연결을 확인한 뒤 다시 눌러 줘.')}
  if(!response.ok)throw Error(data.message||'포인트를 확인할 수 없어. 잠시 후 다시 눌러 줘.');
  if(data.wallet){if(!ready||Number(data.wallet.version||0)>=Number(wallet.version||0)){wallet=data.wallet;try{localStorage.setItem(cacheKey,JSON.stringify(wallet))}catch{}}ready=true;notify();}
  return data;
 }
 function refresh(){if(refreshing)return refreshing;refreshing=request('state').finally(()=>refreshing=null);return refreshing;}
 return {format,request,refresh,notify,get wallet(){return wallet},get ready(){return ready}};
})();

window.VocabWardrobe=(()=>{
 let category='hair',selected=0,back='#days',busy=false;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function owned(item){return item===0||VocabPoints.wallet.owned.some(x=>x.category===category&&x.index===item);}
 function open(){back=location.hash==='#study'?'#study':/^#day\/\d+$/.test(location.hash)?location.hash:'#days';try{localStorage.setItem('haru-wardrobe-back',back)}catch{}location.hash='wardrobe';}
 function render(){
  document.body.className='wardrobe-view';
  const wallet=VocabPoints.wallet,look={...wallet.equipped,[category]:selected};
  const item=VocabStyle.items.find(x=>x.category===category&&x.index===selected),isOwned=owned(selected);
  document.querySelector('#app').innerHTML=`<section class="wardrobe"><div class="wardrobe-bar"><button data-shop-back aria-label="돌아가기">←</button><h1>나의 블록 친구</h1><span class="shop-balance">공용 포인트 <b data-wallet-balance>${VocabPoints.format(wallet.balance)}P</b></span></div><div class="wardrobe-layout"><aside class="wardrobe-preview"><span class="ox-eyebrow">MY BLOCK FRIEND</span><div class="wardrobe-avatar">${VocabStyle.avatar(VocabOX.cube,look)}</div><span class="wardrobe-pedestal"></span><h2>${item?esc(item.name):'기본 스타일'}</h2><p>${selected===0?'언제든 기본 모습으로 돌아갈 수 있어.':isOwned?'구매한 아이템이야. 자유롭게 장착해 줘.':'입어 보고 마음에 드는 아이템을 골라줘.'}</p><button class="primary shop-purchase" ${busy||!VocabPoints.ready||(!isOwned&&wallet.balance<1000)?'disabled':''}>${busy?'저장 중…':isOwned?'이 모습으로 장착':'1,000P로 구매·장착'}</button><p class="shop-note" role="status">${VocabPoints.ready?'카테고리별 30개 · 아이템당 1,000P':'서버에서 포인트를 확인하고 있어…'}</p><small>학습기록과 같은 공용 캐릭터·포인트야.</small></aside><div class="wardrobe-collection"><nav class="shop-categories" aria-label="꾸미기 카테고리">${VocabStyle.categories.map(c=>`<button data-shop-category="${c.id}" aria-pressed="${category===c.id}">${c.name}<small>30</small></button>`).join('')}</nav><div class="shop-items" aria-label="아이템 목록"><button class="shop-item ${selected===0?'selected':''}" data-shop-item="0"><span class="shop-item-preview">${VocabStyle.avatar(VocabOX.cube,{...wallet.equipped,[category]:0})}</span><b>기본 스타일</b><small>무료 · 기본</small></button>${VocabStyle.items.filter(x=>x.category===category).map(x=>`<button class="shop-item ${selected===x.index?'selected':''}" data-shop-item="${x.index}" aria-pressed="${selected===x.index}"><span class="shop-item-preview">${category==='hand'?VocabStyle.icon(x.index):VocabStyle.avatar(VocabOX.cube,{...wallet.equipped,[category]:x.index})}</span><b>${esc(x.name)}</b><small>${owned(x.index)?wallet.equipped[category]===x.index?'장착 중':'보유 중':'1,000P'}</small></button>`).join('')}</div></div></div></section>`;
  const app=document.querySelector('#app');
  app.querySelector('[data-shop-back]').onclick=()=>{try{back=localStorage.getItem('haru-wardrobe-back')||back}catch{}location.hash=/^#(?:study|days|day\/\d+)$/.test(back)?back:'#days';};
  app.querySelectorAll('[data-shop-category]').forEach(button=>button.onclick=()=>{if(busy)return;category=button.dataset.shopCategory;selected=wallet.equipped[category]||0;render()});
  app.querySelectorAll('[data-shop-item]').forEach(button=>button.onclick=()=>{if(busy)return;selected=Number(button.dataset.shopItem);render()});
  app.querySelector('.shop-purchase').onclick=async()=>{if(busy||!VocabPoints.ready)return;busy=true;render();try{await VocabPoints.request(isOwned?'equip':'buy',{category,index:selected});toast(isOwned?'캐릭터에 장착했어!':'1,000P로 구매하고 장착했어!');}catch(e){toast(e.message);}finally{busy=false;if(location.hash==='#wardrobe')render();}};
 }
 function route(){selected=VocabPoints.wallet.equipped[category]||0;render();VocabPoints.refresh().then(()=>{if(location.hash==='#wardrobe')render()}).catch(e=>{const note=document.querySelector('.shop-note');if(note)note.textContent=e.message;});}
 document.addEventListener('click',e=>{if(e.target.closest('[data-open-wardrobe]')){e.preventDefault();open();}});
 window.addEventListener('resize',()=>{if(location.hash==='#wardrobe')render();});
 return {open,route,render};
})();
