'use strict';
window.VocabStyle=(()=>{
 const categories=[{id:'hair',name:'머리모양'},{id:'skin',name:'피부'},{id:'outfit',name:'옷'},{id:'hand',name:'손 아이템'},{id:'face',name:'얼굴'}];
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
 const items=categories.flatMap(c=>Array.from({length:30},(_,i)=>({category:c.id,index:i+1,price:1000,name:c.id==='hair'?hairShapes[Math.floor(i/6)]+' · '+bangs[i%6]:c.id==='skin'?'피부 '+String(i+1).padStart(2,'0'):c.id==='outfit'?['별빛','스트라이프','체크','후드','메카','컬러블록'][Math.floor(i/5)]+' · '+['숲','바다','코랄','보라','골드'][i%5]:c.id==='hand'?handNames[i]:['또렷한','동그란','졸린','윙크','초롱한','웃는'][i%6]+' 눈 · '+['미소','활짝','차분','놀람','장난'][Math.floor(i/6)]})));
 function avatar(cube,look={}){
  const hair=look.hair?look.hair-1:0,face=look.face?look.face-1:0,outfit=look.outfit?look.outfit-1:0;
  const shape=Math.floor(hair/6),bang=hair%6,pattern=Math.floor(outfit/5),shirt=look.outfit?colors[outfit%5]:'#47937b',skinColor=look.skin?skin[look.skin-1]:'#ebbc91';
  let extras='';if(shape===1)extras=cube('sidehair-a')+cube('sidehair-b');if(shape===2)extras=cube('ponytail');if(shape===3)extras=Array.from({length:4},(_,i)=>`<span class="ox-spike spike-${i}">${cube('spike')}</span>`).join('');if(shape===4)extras=cube('bun-a')+cube('bun-b');
  const held=look.hand?`<span class="ox-held" aria-hidden="true"><svg viewBox="0 0 34 34">${icons[look.hand-1]}</svg></span>`:'';
  return `<div class="ox-avatar ${look.hair?'':'base-hair'} ${look.face?'':'base-face'} hair-shape-${shape} bang-${bang} outfit-pattern-${pattern} face-eyes-${face%6} face-mouth-${Math.floor(face/6)}" style="--avatar-skin:${skinColor};--avatar-shirt:${shirt}"><div class="ox-rig">${cube('head','<b class="ox-eye a"></b><b class="ox-eye b"></b><b class="ox-smile"></b>')}${cube('hair')}${cube('fringe')}${extras}${cube('body','<b class="ox-star">✦</b><b class="ox-shirt-detail"></b>')}<span class="ox-joint ox-arm a">${cube('sleeve')}${cube('hand')}</span><span class="ox-joint ox-arm b">${cube('sleeve')}${cube('hand')}${held}</span><span class="ox-joint ox-leg a">${cube('pants')}${cube('shoe')}</span><span class="ox-joint ox-leg b">${cube('pants')}${cube('shoe')}</span></div></div>`;
 }
 return {categories,items,avatar,icon:index=>`<svg viewBox="0 0 34 34" aria-hidden="true">${icons[index-1]||''}</svg>`};
})();
