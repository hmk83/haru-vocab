import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {createTestDb}from'./ox-db.mjs';
const {db,rpc}=await createTestDb(),code=crypto.randomBytes(32).toString('hex'),checks=[];
const pass=s=>{checks.push(s);console.log('PASS '+s)};
async function run(day,remaining){let data=await rpc(code,'start',{day,id:crypto.randomUUID()}),r=data.run;const n=r.total,stop=remaining===0?n:n-remaining+1;for(let i=0;i<stop;i++){const selected=i===stop-1&&remaining!==0?!r.rounds[i].expected:r.rounds[i].expected;data=await rpc(code,'answer',{id:r.id,index:i,selected});r=data.run;}return data;}
try{
 assert.equal((await rpc(code,'state')).wallet.balance,0);
 const cases=[[20,0],[3,1000],[3,500],[2,2000],[3,500],[2,1000],[1,3000],[3,500],[2,1000],[1,1500],[0,3000],[1,1500],[0,1500]];let total=0;
 for(const [remaining,award]of cases){const data=await run(1,remaining);total+=award;assert.equal(data.run.award,award);assert.equal(Number(data.wallet.balance),total);}
 pass('Day best is a permanent high-water mark: 1,000→500→2,000; lowering and raising never restores the 100% award');
 const last=await run(1,3),balance=last.wallet.balance,pos=last.run.index-1,answer=last.run.answers[pos];
 for(let i=0;i<3;i++){const replay=await rpc(code,'answer',{id:last.run.id,index:pos,selected:answer.selected});assert.equal(replay.wallet.balance,balance);assert.equal(replay.replayed,true);}
 await assert.rejects(rpc(code,'answer',{id:last.run.id,index:pos,selected:!answer.selected}));
 pass('Duplicate answer requests and contradictory replays cannot mint points twice');
 const fresh=await rpc(code,'start',{day:2,id:crypto.randomUUID()});await assert.rejects(rpc(code,'answer',{id:fresh.run.id,index:18,selected:true}));
 assert.equal((await rpc(code,'resume',{id:fresh.run.id})).run.index,0);
 await assert.rejects(rpc('b'.repeat(64),'resume',{id:fresh.run.id}));await assert.rejects(rpc('', 'state'));
 pass('Server-ordered answers reject skipped questions and access through a different profile key');
 const firstPurchase=await rpc(code,'buy',{category:'hair',index:1,price:0}),afterBuy=Number(firstPurchase.wallet.balance);assert.equal(afterBuy,Number(balance)-1000);
 const duplicatePurchase=await rpc(code,'buy',{category:'hair',index:1});assert.equal(Number(duplicatePurchase.wallet.balance),afterBuy);
 assert.equal(duplicatePurchase.wallet.equipped.hair,1);await assert.rejects(rpc(code,'equip',{category:'hat',index:30}));await assert.rejects(rpc(code,'buy',{category:'hat',index:31}));
 pass('Items cost exactly 1,000 server-side, repeat purchase is idempotent, and unowned/out-of-range equipment is rejected');
 const poor='c'.repeat(64);await assert.rejects(rpc(poor,'buy',{category:'skin',index:1}));assert.equal((await rpc(poor,'state')).wallet.balance,0);
 const cat=await db.query('select category,count(*)::int n,min(price)::int price from vocab_game.catalog group by category');assert.equal(cat.rows.length,10);assert(cat.rows.every(x=>x.n===30&&x.price===1000));
 pass('Nine paid categories and legacy face presets have 30 items each; insufficient funds never produce a negative balance');
 for(const [part,index]of [['eyes',11],['nose',7],['mouth',11]]){const face=await rpc(poor,'face',{part,index});assert.equal(face.wallet.balance,0);assert.equal(face.wallet.equipped[part],index)}
 await assert.rejects(rpc(poor,'face',{part:'nose',index:8}));await assert.rejects(rpc(poor,'face',{part:'balance',index:0}));
 assert.equal((await rpc(poor,'buy',{category:'face',index:30})).wallet.balance,0);
 pass('Free eyes/nose/mouth and legacy facial presets never spend points; arbitrary wallet field edits are rejected');
 await db.exec("set role anon");await assert.rejects(db.query('select * from vocab_game.wallets'));await db.exec('reset role');
 pass('Anonymous clients cannot read or modify the private wallet / best / ownership tables directly');
 await db.exec("insert into vocab_game.words(id,day,en,ko,distractors) select 1000+n,50,'QA '||n,'테스트 '||n,array[18,216] from generate_series(1,10)n");
 const thirty=await run(50,3);assert.equal(thirty.run.total,30);assert.equal(thirty.run.correctCount,27);assert.equal(thirty.run.index,28);assert.equal(thirty.run.award,1000);
 pass('Exact requested example: 30 questions, 27 correct, fail question 28 = 1,000P');
 const hash=crypto.createHash('sha256').update(code).digest('hex');await db.query('update public.vocab_sync_profiles set reset_at=clock_timestamp() where key_hash=$1',[hash]);
 const afterReset=await run(1,3);assert.equal(afterReset.run.award,500);assert.equal(afterReset.wallet.best.find(x=>x.day===1).correct,20);
 pass('Resetting learning history does not reset the Day best or re-enable first-time rewards');
 fs.writeFileSync(new URL('./ox-economy-results.json',import.meta.url),JSON.stringify({time:new Date().toISOString(),engine:'PGlite 0.5.11 (real PostgreSQL SQL; local isolated database)',checks},null,2));
}finally{await db.close();}
