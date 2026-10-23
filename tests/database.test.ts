import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { PGlite } from '@electric-sql/pglite'

test('migration enforces tenant/admin RLS, service-only payment writes and atomic promo limits', async () => {
  const db = new PGlite()
  try {
    await db.exec(`
      create role anon; create role authenticated; create role service_role bypassrls;
      create schema auth;
      create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$;
      create function auth.role() returns text language sql stable as $$ select current_user::text $$;
      grant usage on schema auth,public to anon,authenticated,service_role;
      grant execute on all functions in schema auth to anon,authenticated,service_role;
    `)
    const base = (await readFile('supabase-schema.sql','utf8')).replace('create extension if not exists "uuid-ossp";','').replaceAll('uuid_generate_v4()','gen_random_uuid()')
    await db.exec(base)
    // Match Supabase's table grants; RLS, not missing privileges, must protect rows.
    await db.exec('grant all on all tables in schema public to anon,authenticated,service_role;')
    await db.exec(await readFile('supabase/migrations/202610230001_security_payments.sql','utf8'))
    const owner='11111111-1111-4111-8111-111111111111', other='22222222-2222-4222-8222-222222222222'
    await db.query('insert into auth.users values($1,$2,now()),($3,$4,now())',[owner,'one@example.com',other,'two@example.com'])
    await db.query(`insert into citations(user_id,first_name,last_name,email,citation_number) values($1,'One','User','one@example.com','ONE'),($2,'Two','User','two@example.com','TWO')`,[owner,other])
    const claims = async (id: string, admin = false) => {
      await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claims',$2,false)",[id,JSON.stringify({email:'one@example.com',app_metadata: admin ? {role:'admin'} : {},user_metadata:{role:'admin'}})])
    }
    await claims(owner)
    await db.exec('set role authenticated')
    assert.equal((await db.query('select * from citations')).rows.length,1)
    assert.equal((await db.query('select * from contacts')).rows.length,0)
    assert.equal((await db.query('update citations set service_fee_status=\'paid\' returning id')).rows.length,0)
    await assert.rejects(db.query(`insert into citations(first_name,last_name,email,citation_number) values('X','Y','x@y.test','X')`))
    await assert.rejects(db.query('select redeem_launch_promo(gen_random_uuid(),$1)',[owner]))
    await assert.rejects(db.query('insert into service_payments(citation_id,user_id,amount_cents,state) select id,user_id,0,\'paid\' from citations limit 1'))
    await claims(owner,true)
    assert.equal((await db.query('select * from citations')).rows.length,2)
    await db.exec('reset role; set role anon')
    assert.equal((await db.query('select * from citations')).rows.length,0)
    assert.equal((await db.query('select * from contacts')).rows.length,0)
    await db.exec('reset role')
    const row = (await db.query<{id:string}>("select id from citations where citation_number='ONE'")).rows[0]
    const reserve = await db.query<{id:string}>('select reserve_service_checkout($1,$2) as id',[row.id,owner])
    const again = await db.query<{id:string}>('select reserve_service_checkout($1,$2) as id',[row.id,owner])
    assert.equal(reserve.rows[0].id,again.rows[0].id)
    await assert.rejects(db.query('select reserve_service_checkout($1,$2)',[row.id,other]))
    await assert.rejects(db.query('select redeem_launch_promo($1,$2)',[row.id,owner]))
    // An abandoned reserved checkout is cancelled by support before redemption.
    await db.query('delete from service_payments where citation_id=$1',[row.id])
    const promo = await db.query<{id:string}>('select redeem_launch_promo($1,$2) as id',[row.id,owner])
    const repeated = await db.query<{id:string}>('select redeem_launch_promo($1,$2) as id',[row.id,owner])
    assert.equal(promo.rows[0].id,repeated.rows[0].id)
    assert.equal((await db.query<{uses:number}>('select uses from promo_campaigns')).rows[0].uses,1)
    assert.equal((await db.query<{service_fee_status:string}>('select service_fee_status from citations where id=$1',[row.id])).rows[0].service_fee_status,'paid')
    for (let i=0;i<5;i++) {
      const c = await db.query<{id:string}>(`insert into citations(user_id,first_name,last_name,email,citation_number) values($1,'One','User','one@example.com',$2) returning id`,[owner,`PROMO${i}`])
      if(i<4) await db.query('select redeem_launch_promo($1,$2)',[c.rows[0].id,owner])
      else await assert.rejects(db.query('select redeem_launch_promo($1,$2)',[c.rows[0].id,owner]))
    }
    assert.equal((await db.query<{uses:number}>('select uses from promo_campaigns')).rows[0].uses,5)
  } finally { await db.close() }
})
