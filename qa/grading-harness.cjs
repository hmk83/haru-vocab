const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('assert'),fs=require('fs'),crypto=require('crypto');
(async()=>{
 const base=process.env.TEST_URL||'http://127.0.0.1:8873';
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const page=await browser.newPage({viewport:{width:375,height:812}}),errors=[],checks=[];
 page.on('pageerror',e=>errors.push(e.message));
 // No test scores or answer events may enter the visitors' shared records.
 await page.route('**/sync.js',r=>r.fulfill({body:'window.VocabCloud={status:"채점 검증",event(){},init(){},notify(){},sync:async()=>{}}'}));
 await page.goto(base+'/#days');
 const dataResponse=await page.request.get(base+'/data.js');assert(dataResponse.ok());assert.equal(crypto.createHash('sha256').update(await dataResponse.body()).digest('hex'),'ec9966d9492ba552080bae55ba7a3e2dd10aae6993ff2246b035f92178068ee1');checks.push('Academy vocabulary file is byte-for-byte unchanged');
 const audit=await page.evaluate(()=>{
  const failures=[];let cases=0;
  for(const w of WORDS)for(const direction of ['en','ko']){
   const source=direction==='en'?w.ko:w.en;
   for(const answer of [source,...source.replace(/\[[^\]]*\]|\([^)]*\)/g,'').split(/[;,]/),source.normalize('NFD'),source.toUpperCase()]){
    cases++;if(!matchesAnswer(w,direction,answer))failures.push({id:w.id,direction,answer});
   }
   if(matchesAnswer(w,direction,'')||matchesAnswer(w,direction,'틀린답zzzz'))failures.push({id:w.id,direction,wrongAccepted:true});
  }
  return {words:WORDS.length,cases,failures};
 });
 assert.deepEqual(audit.failures,[]);checks.push(audit.words+' words: '+audit.cases+' full, individual meaning, Unicode and case checks');
 const fixtures=[
  [133,'en',['달리다','뛰다','경영하다','운영하다','달리다, 뛰다','뛰다; 운영하다']],
  [276,'en',['위에','위로']], [452,'en',['되돌아가서','되돌아와서']], [911,'en',['따라가다','따라오다','따르다']],
  [6,'en',['에서','에서부터','부터']],
  [45,'en',['분','잠깐']], [120,'en',['주의하다','조심하다']],
  [127,'en',['입고 있다','신고 있다','쓰고 있다','끼고 있다']],
  [180,'en',['채우다','써넣다','메우다']], [459,'en',['켜다','끄다']],
  [100,'en',['갖고 싶다','하고 싶다','처럼 느끼다']],
  [19,'ko',['come from','be from']], [459,'ko',['turn on','turn off']],
  [80,'ko',['all day','all day long']], [20,'ko',['be going to','be going to-v']],
  [120,'ko',['watch out','watch out for']], [659,'ko',['a little','a few']]
 ];
 for(const [id,direction,answers] of fixtures)for(const answer of answers){
  assert(await page.evaluate(({id,direction,answer})=>matchesAnswer(WORDS.find(w=>w.id===id),direction,answer),{id,direction,answer}),id+': '+answer);
 }
 assert(await page.evaluate(()=>!matchesAnswer(WORDS.find(w=>w.id===276),'en','로')&&!matchesAnswer(WORDS.find(w=>w.id===452),'en','와서')&&!matchesAnswer(WORDS.find(w=>w.id===911),'en','오다')&&!matchesAnswer(WORDS.find(w=>w.id===133),'en','달리다, 수영하다')&&!matchesAnswer(WORDS.find(w=>w.id===133),'en','달리')&&!matchesAnswer(WORDS[0],'ko','tal')&&!matchesAnswer(WORDS.find(w=>w.id===45),'en','시간의 단위')));
 checks.push('Independent comma, annotation, Korean/English bracket fixtures and incorrect/partial answer rejection');
 const choices=await page.evaluate(()=>{
  const failures=[];
  for(const w of WORDS)for(const direction of ['en','ko']){
   session={id:'audit',day:w.day,mode:'quiz',direction,ids:[w.id],index:0,answers:[],chosen:null,options:null};renderSession();
   if(session.options.length!==4||!session.options.includes(w.id))failures.push({id:w.id,direction,options:session.options});
   const options=session.options.map(id=>WORDS.find(x=>x.id===id));
   for(let i=0;i<options.length;i++)for(let j=i+1;j<options.length;j++)if(equivalentChoice(options[i],options[j],direction))failures.push({id:w.id,direction,ambiguous:true});
  }return failures;
 });assert.deepEqual(choices,[]);checks.push('All 2,000 multiple-choice prompts have four distinct non-overlapping answers');
 for(const [id,answer] of [[133,'달리다'],[133,'뛰다'],[133,'운영하다'],[133,'달리다, 뛰다'],[276,'위로'],[452,'되돌아와서'],[911,'따라오다']]){
  await page.goto(base+'/#days');
  await page.evaluate(id=>{start(Math.ceil(id/20),'written','en',[id]);renderSession()},id);await page.locator('#written-answer').fill(answer);await page.locator('#written-answer').press('Enter');
  assert.equal(await page.locator('.feedback-modal strong').innerText(),'정답');await page.locator('[data-action="next"]').click();
  assert.equal(await page.evaluate(()=>lastResult.score),100);
  await page.reload();assert(await page.evaluate(answer=>records.some(r=>r.answers.some(a=>a.typed===answer&&a.correct)&&r.score===100),answer));
 }
 await page.goto(base+'/#days');
 await page.evaluate(()=>{start(7,'written','en',[133]);renderSession()});await page.locator('#written-answer').fill('달리');await page.locator('.written-form button').click();assert.equal(await page.locator('.feedback-modal strong').innerText(),'오답');
 checks.push('Real form submission, feedback, 100-point scoring, history/reload and partial-answer rejection');
 const pair=await page.evaluate(()=>{for(const w of WORDS){const other=WORDS.find(x=>x.id!==w.id&&equivalentChoice(w,x,'en'));if(other)return [w.id,other.id]}return null});assert(pair);
 await page.evaluate(([id,other])=>{start(1,'quiz','en',[id]);session.options=[id,other];renderSession()},pair);
 await page.locator('[data-action="choose"][data-id="'+pair[1]+'"]').click();assert.equal(await page.locator('.feedback-modal strong').innerText(),'정답');assert(await page.evaluate(()=>session.answers[0].correct));checks.push('Existing draft with a same-meaning choice grades correctly despite a different word ID');
 await page.evaluate(()=>start(7,'flash','en',[133]));await page.locator('.flash-advance button').click();assert.equal(await page.evaluate(()=>session.answers.length),0);assert.equal(await page.locator('.judges').count(),0);checks.push('Reading flashcards remain ungraded');
 assert.deepEqual(errors,[]);const report={base,time:new Date().toISOString(),audit,checks,errors,sharedRecordsUntouched:true};
 fs.writeFileSync(__dirname+'/grading-results'+(base.startsWith('https')?'-public':'')+'.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
