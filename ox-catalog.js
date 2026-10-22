'use strict';
window.VocabStyle=(()=>{
 const categories=[{id:'outfit',name:'의상'},{id:'hair',name:'헤어'},{id:'hat',name:'모자'},{id:'glasses',name:'안경'},{id:'back',name:'등 장식'},{id:'neck',name:'목 장식'},{id:'hand',name:'손 아이템'},{id:'shoes',name:'신발'},{id:'skin',name:'피부'},{id:'face',name:'표정',free:true}];
 const skin=['#f3c6a3','#d99c73','#a87250','#805538','#f6dbc2','#edb68e','#be865e','#6c4835','#f0c8b2','#dcb196','#bc917a','#94725a','#e9bd91','#c89665','#a67d50','#7a5b3d','#f5d6be','#ddb593','#bd8b6b','#95684a','#edc1a9','#c7957f','#a57763','#795345','#f8dfcc','#e7bd9f','#cda084','#aa7a5e','#896247','#5f4433'];
 const colors=['#418f77','#4d80ad','#d28568','#8b70b1','#d1a444'];
 const handNames=['별빛 지팡이','모험가 검','동그란 방패','작은 책','횃불','깃발','우산','꽃 한 송이','마법봉','기타','풍선','당근','붓','로켓','아이스크림','연필','두루마리','망원경','막대사탕','망치','네잎클로버','하트','초승달','랜턴','응원봉','물고기','나뭇잎','보석','물병','카메라'];
 const icons=[
  '<path d="M11 28 20 8" stroke="#a87853" stroke-width="3"/><path d="m21 2 2 5 6 1-5 4 1 6-5-3-5 3 1-6-4-4 6-1Z" fill="#f0c94c"/>',
  '<path d="M9 23 24 3 28 4 27 8 13 25Z" fill="#c9e5ef" stroke="#5686a2"/><path d="m6 19 12 9M6 29l5-6" stroke="#bd8944" stroke-width="4"/>',
  '<path d="M6 4h20v12c0 7-10 13-10 13S6 23 6 16Z" fill="#67a7a3" stroke="#365f7c" stroke-width="2"/><path d="M16 8v15M11 15h10" stroke="#f2d77d" stroke-width="3"/>',
  '<path d="M4 5h11l3 2 10-2v23l-10 2-3-2H4Z" fill="#e0aa71" stroke="#855941" stroke-width="2"/><path d="M16 8v19M8 11h5M20 11h4" stroke="#fff5dc" stroke-width="2"/>',
  '<path d="M13 29V15h6v14" fill="#9e6c43"/><path d="M16 2c2 7 9 9 6 15s-12 6-12 0c-1-5 5-8 6-15Z" fill="#f4a14b"/><path d="M16 12c3 4 5 6 0 9-5-3-3-6 0-9Z" fill="#ffe78e"/>',
  '<path d="M7 30V2" stroke="#a57d54" stroke-width="3"/><path d="m9 3 19 3-5 7-14-1Z" fill="#e3988b"/>',
  '<path d="M16 4v22c0 6 8 4 7 0" fill="none" stroke="#9a7559" stroke-width="2"/><path d="M2 16C3 1 29 1 30 16c-5-4-8-4-14 0-5-4-10-4-14 0Z" fill="#7aa7cf" stroke="#4f7b9f"/>',
  '<path d="M16 29V14M16 23l-6-5" stroke="#71955e" stroke-width="3"/><path d="M16 10C2 2 6-5 16 4c10-9 14-2 5 6 9 7 0 13-5 4-7 9-15 2-5-4Z" fill="#e89c9c"/><circle cx="16" cy="10" r="4" fill="#f9d46e"/>',
  '<path d="m7 29 18-22" stroke="#786797" stroke-width="4"/><path d="m25 1 1 4 5 1-4 3 1 5-4-3-4 2 1-5-3-3 4-1Z" fill="#c7a6e4"/>',
  '<ellipse cx="13" cy="23" rx="9" ry="8" fill="#c49156"/><circle cx="13" cy="22" r="3" fill="#775440"/><path d="m15 18 10-15 4 2-10 16" fill="#9f7958"/><path d="m10 26 15-21" stroke="#ffefd0"/>',
  '<path d="M17 19c-8 6 6 7-1 13" fill="none" stroke="#a68c71"/><ellipse cx="16" cy="10" rx="9" ry="10" fill="#df8e9b"/><path d="m13 20 3-4 3 4Z" fill="#c97084"/>',
  '<path d="M7 9 24 9 14 30Z" fill="#ed9a58"/><path d="m13 8-3-7m6 7 4-7m-2 8 8-4" stroke="#75a066" stroke-width="3"/><path d="m11 14 5 1m-3 7 4 1" stroke="#c87944"/>',
  '<path d="M8 30 20 12" stroke="#b39060" stroke-width="5"/><path d="m17 11 5-9 7 5-7 8Z" fill="#84b4bc"/><path d="m22 2 7 5" stroke="#6e8d96" stroke-width="3"/>',
  '<path d="M17 2c11 8 10 17-2 24L8 16c1-6 5-12 9-14Z" fill="#e0c8aa" stroke="#9e927d"/><circle cx="18" cy="12" r="4" fill="#7ab7cf"/><path d="m9 17-6 6 7 1m11-1 1 7 5-8" fill="#b77c7d"/><path d="m12 25-4 7 7-5" fill="#efbc5a"/>',
  '<path d="m9 16 7 15 7-15" fill="#d8ac76"/><path d="M7 16c-3-6 1-10 5-10 0-8 12-7 12 0 6 2 7 10 1 10Z" fill="#f0b8b8"/><circle cx="15" cy="4" r="2" fill="#cb777c"/>',
  '<path d="m5 26 19-24 5 4L10 30Z" fill="#e6bf62"/><path d="m5 26 5 4-6 1Z" fill="#65574c"/><path d="m23 3 5 4" stroke="#d2959e" stroke-width="4"/>',
  '<path d="M8 4h17v25H8Z" fill="#ecd6a9" stroke="#b69363"/><path d="M5 4h21M5 29h21" stroke="#a57f54" stroke-width="4"/><path d="M11 11h10M11 16h10M11 21h7" stroke="#ac906b"/>',
  '<path d="m6 20 19-15 5 7L10 25Z" fill="#b9c6ce" stroke="#778c9c"/><path d="m10 18 5 8m9-20 4 6" stroke="#d7b167" stroke-width="4"/><path d="m18 23-4 8m5-8 5 8" stroke="#7a806b" stroke-width="2"/>',
  '<path d="M15 31V16" stroke="#c9ad84" stroke-width="3"/><circle cx="15" cy="10" r="9" fill="#f0b0b4"/><path d="M11 6c9-1 9 9 1 8-7-1-5-11 4-10" fill="none" stroke="#fff0d5" stroke-width="3"/>',
  '<path d="m10 30 7-20" stroke="#a28157" stroke-width="5"/><path d="m7 8 3-7 20 7-3 8Z" fill="#9eafb5" stroke="#657c88"/>',
  '<path d="M16 30V15" stroke="#6f9a61" stroke-width="3"/><path d="M16 15C0 12 5 0 14 8c1-14 16-7 8 2 15 1 8 15-1 8-1 14-15 8-9-2Z" fill="#8eb97e"/>',
  '<path d="M16 29C-5 16 0 1 12 6l4 5 4-5C32 1 37 16 16 29Z" fill="#e0a1a1" stroke="#c87d85"/>',
  '<path d="M24 2C2 0-5 27 17 31 3 18 11 7 24 2Z" fill="#e8ce74" stroke="#c2ab67"/>',
  '<path d="M10 7c-3-8 15-8 12 0" fill="none" stroke="#8c785a" stroke-width="2"/><path d="M7 8h19l-2 21H9Z" fill="#e6be75" stroke="#8b795f" stroke-width="2"/><path d="M12 11h9v13h-9Z" fill="#ffeb9c"/>',
  '<path d="m12 30 5-19" stroke="#8c7ca7" stroke-width="5"/><path d="m13 11 3-10 10 3-3 10Z" fill="#a9cee2"/><path d="m10 4-3-2m21 13 3 2" stroke="#e3bd64" stroke-width="2"/>',
  '<path d="M25 17 31 9v16l-6-6C8 37-6 17 13 7c6-2 10 4 12 10Z" fill="#8cc0c2" stroke="#5c919c"/><circle cx="10" cy="15" r="2" fill="#355b66"/>',
  '<path d="M28 2C2 4-3 20 10 27 26 33 31 14 28 2Z" fill="#91b775" stroke="#719259"/><path d="M4 31 24 8m-10 12-6-4m10 1 7 2" stroke="#68894e" fill="none"/>',
  '<path d="m2 10 7-8h15l7 8-15 21Z" fill="#a2c9de" stroke="#6e9daf"/><path d="m2 10 29 0M9 2l7 29 8-29" fill="none" stroke="#e0f1f3"/>',
  '<path d="M11 2h10v5l4 5v17H7V12l4-5Z" fill="#a3cbd7" stroke="#729eaf"/><path d="M11 2h10M8 17h16v6H8" stroke="#d6e9e4" stroke-width="4"/>',
  '<path d="M2 8h8l3-5h9l3 5h5v21H2Z" fill="#97aaa7" stroke="#627d79"/><circle cx="17" cy="18" r="8" fill="#516b77"/><circle cx="17" cy="18" r="5" fill="#a1cdd8"/><path d="M5 12h3" stroke="#f4d68d" stroke-width="2"/>'
 ];
 const hairShapes=['숏컷','단발','포니테일','스파이크','양갈래'],bangs=['일자','사선','가르마','컬','레이어','올림'];
 const eyes=['또렷한 눈','동그란 눈','초롱초롱','웃는 눈','윙크','졸린 눈','반달 눈','별빛 눈','당당한 눈','놀란 눈','감은 눈','하트 눈'];
 const noses=['작은 코','동그란 코','삼각 코','버튼 코','강아지 코','고양이 코','주근깨 코','코 없음'];
 const mouths=['작은 미소','활짝 웃음','차분한 입','놀란 입','장난 미소','치아 미소','고양이 입','씩 웃기','휘파람','혀 내밀기','하트 입','일자 입'];
 const faceParts=[{id:'eyes',name:'눈',names:eyes},{id:'nose',name:'코',names:noses},{id:'mouth',name:'입',names:mouths}];
 const items=categories.filter(c=>!c.free).flatMap(c=>Array.from({length:30},(_,i)=>({category:c.id,index:i+1,price:500,...(VocabLooks.catalog[c.id]?.[i]||{}),name:c.id==='hair'?hairShapes[Math.floor(i/6)]+' · '+bangs[i%6]:c.id==='skin'?'스킨 톤 '+String(i+1).padStart(2,'0'):c.id==='hand'?handNames[i]:VocabLooks.catalog[c.id][i].name})));
 const partIndex=(look,part)=>Number.isInteger(look[part])?look[part]:part==='eyes'?(look.face?((look.face-1)%6):0):part==='mouth'?(look.face?Math.floor((look.face-1)/6):0):0;
 function face(look={}){
  const e=partIndex(look,'eyes')%12,n=partIndex(look,'nose')%8,m=partIndex(look,'mouth')%12;
  const eye=[
   '<ellipse cx="13" cy="17" rx="2" ry="3"/><ellipse cx="31" cy="17" rx="2" ry="3"/>',
   '<circle cx="13" cy="17" r="3"/><circle cx="31" cy="17" r="3"/>',
   '<ellipse cx="13" cy="17" rx="3" ry="4"/><ellipse cx="31" cy="17" rx="3" ry="4"/><g fill="white"><circle cx="12" cy="15" r="1.2"/><circle cx="30" cy="15" r="1.2"/></g>',
   '<path d="M10 18q3-7 6 0m12 0q3-7 6 0" fill="none" stroke="currentColor" stroke-width="2.3"/>',
   '<circle cx="13" cy="17" r="2.4"/><path d="m28 16 6 2-6 2" fill="none" stroke="currentColor" stroke-width="2"/>',
   '<path d="M10 17h6m12 0h6" stroke="currentColor" stroke-width="2.8"/>',
   '<path d="M10 15q3 7 6 0m12 0q3 7 6 0" fill="none" stroke="currentColor" stroke-width="2"/>',
   '<path d="m13 12 1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5L8 15.5l3.5-.5Zm18 0 1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5-2.5-2.5 3.5-.5Z" fill="#b58b26"/>',
   '<path d="m9 12 8 2m10 0 8-2" stroke="currentColor" stroke-width="1.5"/><circle cx="13" cy="18" r="2"/><circle cx="31" cy="18" r="2"/>',
   '<ellipse cx="13" cy="17" rx="3" ry="4"/><ellipse cx="31" cy="17" rx="3" ry="4"/>',
   '<path d="M9 16q4 5 8 0m10 0q4 5 8 0" fill="none" stroke="currentColor" stroke-width="2"/>',
   '<path d="M13 21 8 16q-1-5 5-2 6-3 5 2Zm18 0-5-5q-1-5 5-2 6-3 5 2Z" fill="#cf6583"/>'
  ][e];
  const nose=['<path d="m22 20-1 3h3" fill="none" stroke="#b48264" stroke-width="1.2"/>','<circle cx="22" cy="22" r="1.6" fill="#b48264"/>','<path d="m22 19-2 4h4Z" fill="#b48264"/>','<ellipse cx="22" cy="22" rx="2.6" ry="1.7" fill="#c09175"/>','<path d="M18 21q4-3 8 0l-4 4Z"/>','<path d="m19 21 6 0-3 3Z" fill="#ca8994"/>','<g fill="#ae795a"><circle cx="17" cy="22" r=".8"/><circle cx="14" cy="23" r=".8"/><circle cx="27" cy="22" r=".8"/><circle cx="30" cy="23" r=".8"/></g>',''][n];
  const mouth=['<path d="M18 28q4 4 8 0"/>','<path d="M17 27h10q-1 10-5 7-4 3-5-7Z" fill="#ac5861" stroke="none"/>','<path d="M19 29h6"/>','<ellipse cx="22" cy="29" rx="2.6" ry="3.8" fill="#a7655a" stroke="none"/>','<path d="M17 29q6 4 11-3"/>','<path d="M16 27h12q-1 8-6 7-5 1-6-7Z" fill="#fff7ee"/>','<path d="M16 28q3 5 6 0 3 5 6 0"/>','<path d="M17 29q7 3 11-2m-1-2 2 4"/>','<circle cx="23" cy="29" r="2"/>','<path d="M17 27h10q0 6-5 6-5 0-5-6Z" fill="#734d49"/><path d="M21 30h5v4q-3 4-5 0Z" fill="#dd8e96" stroke="none"/>','<path d="M22 32q-8-4-4-6 2-1 4 1 2-2 4-1 4 2-4 6Z" fill="#ca728c" stroke="none"/>','<path d="M17 29h10"/>'][m];
  return `<svg class="avatar-face-art" viewBox="0 0 44 38" aria-hidden="true"><g fill="#3b3033" color="#3b3033">${eye}${nose}</g><g stroke="#915d59" stroke-width="1.6" fill="none" stroke-linecap="round">${mouth}</g></svg>`;
 }
 function avatar(cube,look={}){
  const hair=look.hair?look.hair-1:0,shape=Math.floor(hair/6),bang=hair%6,skinColor=look.skin?skin[look.skin-1]:'#ebbc91';
  const suit=VocabLooks.outfits[look.outfit-1],shirt=suit?.color||'#47937b';
  let extras='';if(shape===1)extras=cube('sidehair-a')+cube('sidehair-b');if(shape===2)extras=cube('ponytail');if(shape===3)extras=Array.from({length:4},(_,i)=>`<span class="ox-spike spike-${i}">${cube('spike')}</span>`).join('');if(shape===4)extras=cube('bun-a')+cube('bun-b');
  const held=look.hand?`<span class="ox-held" aria-hidden="true"><svg viewBox="0 0 34 34">${icons[look.hand-1]}</svg></span>`:'';
  return `<div class="ox-avatar ${look.hair?'':'base-hair'} hair-shape-${shape} bang-${bang} ${suit?'costume costume-'+suit.id:''} ${look.hat?'has-hat':''} ${look.shoes?'has-custom-shoes':''}" style="--avatar-skin:${skinColor};--avatar-shirt:${shirt};--suit-accent:${suit?.accent||'#f0cd65'};--suit-pants:${suit?.pants||'#415476'};--suit-boot:${suit?.boots||'#fff6dd'}"><div class="ox-rig">${cube('head',face(look))}${cube('hair')}${cube('fringe')}${extras}${cube('body',suit?VocabLooks.chest(suit):'<b class="ox-star">✦</b>')}<span class="ox-joint ox-arm a">${cube('sleeve')}${cube('hand')}</span><span class="ox-joint ox-arm b">${cube('sleeve')}${cube('hand')}${held}</span><span class="ox-joint ox-leg a">${cube('pants')}${cube('shoe')}${VocabLooks.shoe(cube,look.shoes)}</span><span class="ox-joint ox-leg b">${cube('pants')}${cube('shoe')}${VocabLooks.shoe(cube,look.shoes)}</span>${VocabLooks.details(cube,suit,look)}${VocabLooks.accessories(cube,look)}</div></div>`;
 }
 return {categories,items,avatar,face,faceParts,partIndex,icon:index=>`<svg viewBox="0 0 34 34" aria-hidden="true">${icons[index-1]||''}</svg>`};
})();
