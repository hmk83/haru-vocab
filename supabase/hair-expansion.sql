-- Add 18 styles; preserve all existing inventory and balances.
begin;
alter table vocab_game.catalog drop constraint if exists catalog_item_index_check;
alter table vocab_game.catalog add constraint catalog_item_index_check check(item_index between 1 and 48);
insert into vocab_game.catalog(category,item_index,price) select 'hair',n,500 from generate_series(31,48)n on conflict do nothing;
create or replace function public.vocab_game_action(p_action text,p_payload jsonb default '{}') returns jsonb
language plpgsql security definer set search_path='' as $$
declare
 code text := nullif(current_setting('request.headers',true),'')::jsonb->>'x-vocab-key';
 k text;w vocab_game.wallets%rowtype;r vocab_game.runs%rowtype;
 d integer;rid uuid;pos integer;selected boolean;expected boolean;correct boolean;
 deck jsonb;one jsonb;entry jsonb;word vocab_game.words%rowtype;
 remaining integer;previous_best integer;reward integer;normal_reward integer;
 v_category text;item integer;response jsonb;record jsonb;cutoff timestamptz;
begin
 if code is null or code !~ '^[a-f0-9]{64}$' then raise exception '프로필 연결을 확인해 주세요.' using errcode='28000';end if;
 if jsonb_typeof(p_payload)<>'object' then raise exception '잘못된 요청입니다.';end if;
 k:=encode(extensions.digest(code,'sha256'),'hex');
 insert into public.vocab_sync_profiles(key_hash)values(k)on conflict do nothing;
 insert into vocab_game.wallets(key_hash)values(k)on conflict do nothing;
 -- Every mutating operation locks the same owner row first, preventing overspend / double full awards.
 select * into strict w from vocab_game.wallets where key_hash=k for update;
 if p_action='state' then return jsonb_build_object('wallet',vocab_game.snapshot(k));end if;

 if p_action='start' then
  d:=(p_payload->>'day')::integer;rid:=(p_payload->>'id')::uuid;
  if d is null or d not between 1 and 50 or rid is null then raise exception 'Day를 확인해 주세요.';end if;
  select * into r from vocab_game.runs where id=rid;
  if found then
   if r.key_hash<>k or r.day<>d then raise exception '다른 게임의 요청입니다.';end if;
  else
   with day_words as (select a.*,row_number()over(order by random()) rn,count(*)over() n from vocab_game.words a where a.day=d),
   picked as(select a.*,rn<=(n/2+case when n%2=1 and random()<.5 then 1 else 0 end) truth from day_words a)
   select jsonb_agg(jsonb_build_object('id',a.id,'meaningId',case when truth then a.id else a.distractors[1+floor(random()*array_length(a.distractors,1))::integer]end,'expected',truth)order by random()) into deck from picked a;
   if deck is null or jsonb_array_length(deck)<3 then raise exception 'Day 단어를 준비 중입니다.';end if;
   insert into vocab_game.runs(id,key_hash,day,rounds)values(rid,k,d,deck)returning * into r;
  end if;
  return jsonb_build_object('run',vocab_game.run_view(r),'wallet',vocab_game.snapshot(k));
 elsif p_action='resume' then
  select * into r from vocab_game.runs where id=(p_payload->>'id')::uuid and key_hash=k;
  if not found then raise exception '저장된 게임을 찾지 못했어요.';end if;
  return jsonb_build_object('run',vocab_game.run_view(r),'wallet',vocab_game.snapshot(k));
 elsif p_action='answer' then
  rid:=(p_payload->>'id')::uuid;pos:=(p_payload->>'index')::integer;
  if jsonb_typeof(p_payload->'selected')<>'boolean' or pos is null or pos<0 then raise exception '선택을 확인해 주세요.';end if;
  selected:=(p_payload->>'selected')::boolean;
  select * into r from vocab_game.runs where id=rid and key_hash=k for update;
  if not found then raise exception '게임을 찾지 못했어요.';end if;
  select reset_at into cutoff from public.vocab_sync_profiles where key_hash=k;
  if r.started_at<cutoff then raise exception '학습기록이 초기화된 이전 게임입니다. 새로 시작해 주세요.';end if;
  if pos<r.cursor then
   if (r.answers->pos->>'selected')::boolean is distinct from selected then raise exception '이미 저장된 선택과 달라요.';end if;
   return jsonb_build_object('run',vocab_game.run_view(r),'answer',r.answers->pos,'wallet',vocab_game.snapshot(k),'replayed',true);
  end if;
  if r.status<>'active' or pos<>r.cursor then raise exception '현재 문제부터 풀어 주세요.';end if;
  one:=r.rounds->pos;expected:=(one->>'expected')::boolean;correct:=selected=expected;
  select * into strict word from vocab_game.words where id=(one->>'id')::integer;
  entry:=jsonb_build_object('id',word.id,'correct',correct,'selected',selected,'expected',expected,'shownMeaningId',(one->>'meaningId')::integer);
  r.cursor:=r.cursor+1;r.answers:=r.answers||jsonb_build_array(entry);r.correct_count:=r.correct_count+case when correct then 1 else 0 end;
  if not correct or r.cursor=jsonb_array_length(r.rounds) then
   r.status:=case when correct then 'cleared' else 'lost' end;r.finished_at:=clock_timestamp();
   remaining:=jsonb_array_length(r.rounds)-pos;
   normal_reward:=case when correct then 3000 when remaining between 1 and 3 then (4-remaining)*1000 else 0 end;
   insert into vocab_game.best(key_hash,day)values(k,r.day)on conflict do nothing;
   select best_correct into previous_best from vocab_game.best where key_hash=k and day=r.day;
   r.improved:=r.correct_count>previous_best;
   reward:=case when r.improved then normal_reward else normal_reward/2 end;r.base:=normal_reward;r.award:=reward;
   update vocab_game.best set best_correct=greatest(best_correct,r.correct_count),attempts=attempts+1 where key_hash=k and day=r.day;
   update vocab_game.wallets set balance=balance+reward,version=version+1 where key_hash=k;
   record:=jsonb_build_object('id',r.id,'day',r.day,'kind','day','mode','ox','direction','en','startedAt',r.started_at,'finishedAt',r.finished_at,
    'total',r.cursor,'correct',r.correct_count,'score',round(r.correct_count*100.0/r.cursor),'answers',r.answers,
    'dayTotal',jsonb_array_length(r.rounds),'remainingAtFall',case when correct then 0 else remaining end,'cleared',correct,
    'points',jsonb_build_object('base',r.base,'award',r.award,'improved',r.improved));
   insert into public.vocab_sync_records(key_hash,id,happened_at,payload)values(k,r.id::text,r.finished_at,record)on conflict do nothing;
  end if;
  insert into public.vocab_sync_answers(key_hash,id,happened_at,payload)values(k,r.id::text||':'||pos,clock_timestamp(),
   jsonb_build_object('id',r.id::text||':'||pos,'wordId',word.id,'correct',correct,'at',clock_timestamp()))on conflict do nothing;
  update vocab_game.runs set cursor=r.cursor,answers=r.answers,status=r.status,correct_count=r.correct_count,
   base=r.base,award=r.award,improved=r.improved,finished_at=r.finished_at where id=r.id;
  return jsonb_build_object('run',vocab_game.run_view(r),'answer',entry,'wallet',vocab_game.snapshot(k),'replayed',false);
 elsif p_action='face' then
  v_category:=p_payload->>'part';item:=(p_payload->>'index')::integer;
  if v_category is null or v_category not in ('eyes','nose','mouth') or item is null or item<0 or item>(case when v_category='nose' then 7 else 11 end) then raise exception '표정을 확인해 주세요.';end if;
  update vocab_game.wallets set equipped=jsonb_set(equipped,array[v_category],to_jsonb(item)),version=version+1 where key_hash=k;
  return jsonb_build_object('wallet',vocab_game.snapshot(k));
 elsif p_action in ('buy','equip') then
  v_category:=p_payload->>'category';item:=(p_payload->>'index')::integer;
  if v_category is null or v_category not in ('hair','skin','outfit','hand','face','hat','glasses','back','neck','shoes') or item is null or (item<0 or item>(case when v_category='hair' then 48 else 30 end)) then raise exception '아이템을 확인해 주세요.';end if;
  if p_action='buy' and v_category<>'face' then
   if item=0 then raise exception '기본 캐릭터는 무료예요.';end if;
   if not exists(select 1 from vocab_game.catalog c where c.category=v_category and c.item_index=item and c.price=500)then raise exception '판매 중인 아이템이 아니에요.';end if;
   if not exists(select 1 from vocab_game.owned o where o.key_hash=k and o.category=v_category and o.item_index=item)then
    if w.balance<500 then raise exception '포인트가 부족해요. 500P가 필요해요.';end if;
    insert into vocab_game.owned(key_hash,category,item_index)values(k,v_category,item);
    update vocab_game.wallets set balance=balance-500,version=version+1 where key_hash=k;
   end if;
  end if;
  if item<>0 and v_category<>'face' and not exists(select 1 from vocab_game.owned o where o.key_hash=k and o.category=v_category and o.item_index=item)then raise exception '먼저 구매한 아이템을 골라 주세요.';end if;
  update vocab_game.wallets set equipped=jsonb_set(equipped,array[v_category],to_jsonb(item)),version=version+1 where key_hash=k;
  return jsonb_build_object('wallet',vocab_game.snapshot(k));
 else raise exception '지원하지 않는 요청입니다.';
 end if;
end;$$;
commit;
select category,count(*) from vocab_game.catalog group by category order by category;
