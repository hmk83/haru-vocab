const fs=require('fs'),vm=require('vm'),crypto=require('crypto'),assert=require('assert');
(async()=>{const window={};vm.runInNewContext(fs.readFileSync(__dirname+'/../sync-config.js','utf8'),{window});const C=window.VOCAB_SYNC_CONFIG,code=crypto.randomBytes(32).toString('hex'),checks=[];
 async function call(action,payload={}){const response=await fetch(C.url+'/rest/v1/rpc/vocab_game_action',{method:'POST',headers:{apikey:C.key,'x-vocab-key':code,'Content-Type':'application/json'},body:JSON.stringify({p_action:action,p_payload:payload})});const data=await response.json();if(!response.ok)throw Error(data.message);return data;}
 async function prepare(){let{run}=await call('start',{id:crypto.randomUUID(),day:5});for(let index=0;index<17;index++)({run}=await call('answer',{id:run.id,index,selected:run.rounds[index].expected}));return run;}
 const [a,b]=await Promise.all([prepare(),prepare()]);
 const outcomes=await Promise.all([a,b].map(run=>call('answer',{id:run.id,index:17,selected:!run.rounds[17].expected})));
 assert.deepEqual(outcomes.map(x=>x.run.award).sort((a,b)=>a-b),[500,1000]);assert.equal((await call('state')).wallet.balance,1500);
 checks.push('Concurrent equal Day records grant 1,000P + 500P, never two 100% rewards');
 const purchases=await Promise.allSettled([call('buy',{category:'hair',index:2}),call('buy',{category:'face',index:1})]);
 assert.equal(purchases.filter(r=>r.status==='fulfilled').length,1);const state=await call('state');assert.equal(state.wallet.balance,500);assert.equal(state.wallet.owned.length,1);
 checks.push('Two simultaneous 1,000P purchases from 1,500P allow only one purchase and retain a 500P balance');
 const owned=state.wallet.owned[0];await Promise.all([call('buy',{category:owned.category,index:owned.index}),call('buy',{category:owned.category,index:owned.index})]);assert.equal((await call('state')).wallet.balance,500);
 checks.push('Concurrent duplicate purchases of an owned item do not charge again');
 const report={time:new Date().toISOString(),engine:'Live Supabase PostgreSQL RPC',isolatedRandomProfile:true,checks};fs.writeFileSync(__dirname+'/ox-concurrency-results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
