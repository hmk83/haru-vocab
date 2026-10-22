'use strict';
window.VocabHair=(()=>{
 const defs=[['긴 생머리','long','#302c32'],['허니 롱 헤어','long','#c29555'],['로즈 웨이브','wave','#b7798e'],['밤빛 웨이브','wave','#554039'],['리본 트윈테일','twin','#463337'],['라벤더 트윈테일','twin','#9985b3'],['한쪽 땋은 머리','braid','#79503a'],['양갈래 땋은 머리','braids','#b4844f'],['높은 포니테일','high','#352e32'],['발레 올림머리','bun','#6c4b38'],['체리 펑크 모호크','mohawk','#c14f7c'],['라임 펑크 모호크','mohawk','#9bbd50'],['블루 리버티 스파이크','punk','#598eb4'],['보라 언더컷','undercut','#8b67a7'],['클래식 아프로','afro','#3d302b'],['허니 아프로','afro','#9d683e'],['더블 아프로 퍼프','puffs','#4d3530'],['로즈 아프로 퍼프','puffs','#b47581']];
 const items=defs.map(([name,shape,color],i)=>({index:i+31,category:'hair',price:500,name,shape,color,theme:i<10?'롱 & 브레이드':i<14?'펑크':'아프로',description:i<10?'길이와 묶음 모양까지 달라지는 새로운 헤어.':i<14?'멀리서도 눈에 띄는 대담한 펑크 스타일.':'풍성한 볼륨과 블록 컬로 완성하는 아프로 스타일.'}));
 function mesh(cube,h){
  const piece=(x,y,w,ht,d,z=0,color=h.color,angle=0)=>`<span class="look-mesh hair-piece" style="--w:${w}px;--h:${ht}px;--d:${d}px;--material:${color};left:${x}px;top:${y}px;transform:translateZ(${z}px) rotateZ(${angle}deg)">${cube('new-hair')}</span>`;
  let out=piece(12,-3,49,15,39);const back=()=>piece(12,8,49,65,13,-20),strand=(x,y,angle=0)=>piece(x,y,13,59,24,-8,h.color,angle);
  if(h.shape==='long')out+=back()+strand(7,10)+strand(54,10);
  if(h.shape==='wave'){out+=back();for(const x of [5,55])for(let i=0;i<4;i++)out+=piece(x+(i%2?3:0),8+i*15,15,21,25,-5,h.color,(i%2?1:-1)*8);}
  if(h.shape==='twin')out+=strand(-5,8,10)+strand(65,8,-10)+piece(-4,7,15,9,28,0,'#e5a4b6')+piece(64,7,15,9,28,0,'#e5a4b6');
  if(['braid','braids'].includes(h.shape)){for(const x of h.shape==='braid'?[54]:[3,57]){for(let i=0;i<5;i++)out+=piece(x+(i%2?3:0),18+i*10,12,13,16,12,h.color,i%2?15:-15);out+=piece(x+1,68,12,6,19,13,'#d6b459');}}
  if(h.shape==='high')out+=piece(28,-16,25,23,28,-18)+piece(34,3,20,64,24,-25,h.color,-12);
  if(h.shape==='bun')out+=piece(24,-23,29,25,30,-8)+piece(21,-2,35,5,39,0,'#d5af66');
  if(h.shape==='mohawk'){out=piece(13,2,47,7,36,0,'#4d3540');for(let i=0;i<4;i++)out+=piece(29,-24+i%2*3,15,29,12,-15+i*10,h.color);}
  if(h.shape==='punk'){for(let i=0;i<5;i++)out+=piece(8+i*11,-23-(i%2)*9,10,33,21,0,h.color,(i-2)*15);}
  if(h.shape==='undercut')out=piece(12,1,48,9,36,0,'#4b3741')+piece(9,-13,34,26,40,2,h.color,-12)+piece(5,6,16,27,15,17,h.color,12);
  if(h.shape==='afro'){out='';const tiers=[[3,9,-32],[5,-10,-17],[4,0,-2]];tiers.forEach(([count,x,y],row)=>{for(let col=0;col<count;col++)out+=piece(x+col*18,y,21,22,37,row===2?-10:0,h.color,(col%2?4:-4));});}
  if(h.shape==='puffs'){for(const x of [-15,54]){out+=piece(x,-21,34,32,35,-4)+piece(x-4,-13,42,16,28,-3)+piece(x+5,-27,24,13,29,-2);}}
  return `<span class="hair-extension hair-${h.shape}">${out}</span>`;
 }
 return {items,mesh};
})();
