import fs from 'node:fs';
const {PGlite}=await import(process.env.PGLITE_MODULE||'@electric-sql/pglite');
export async function createTestDb(){
 const db=new PGlite();
 await db.exec(`create role anon;create role authenticated;create schema extensions;
 create function extensions.digest(t text,a text)returns bytea language sql as $$select sha256(convert_to(t,'UTF8'))$$;
 create table public.vocab_sync_profiles(key_hash text primary key,reset_at timestamptz not null default '1970-01-01T00:00:00Z');
 create table public.vocab_sync_records(key_hash text,id text,happened_at timestamptz,payload jsonb,primary key(key_hash,id));
 create table public.vocab_sync_answers(key_hash text,id text,happened_at timestamptz,payload jsonb,primary key(key_hash,id));`);
 await db.exec(fs.readFileSync(new URL('../supabase/game-setup.sql',import.meta.url),'utf8'));
 await db.exec(fs.readFileSync(new URL('../supabase/game-catalog-seed.sql',import.meta.url),'utf8'));
 const rpc=async(code,action,payload={})=>db.transaction(async tx=>{
  await tx.query("select set_config('request.headers',$1,true)",[JSON.stringify({'x-vocab-key':code})]);
  return (await tx.query('select public.vocab_game_action($1,$2::jsonb) result',[action,JSON.stringify(payload)])).rows[0].result;
 });
 return {db,rpc};
}
