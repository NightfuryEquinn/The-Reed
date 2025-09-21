import dotenv from 'dotenv';
import { Kysely, PostgresDialect, sql } from 'kysely';
import pg from 'pg';
import { DB } from '../src/kysely/schema';

dotenv.config()

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: process.env.DATABASE_URL
    })
  })
})

const resetDB = async () => {
  await sql`
  DO
  $do$
  BEGIN
    EXECUTE 
    (SELECT 'TRUNCATE TABLE ' || string_agg(oid::regclass::text, ', ') || ' RESTART IDENTITY CASCADE'
      FROM pg_class
      WHERE relkind = 'r'  -- only tables
      AND relnamespace IN ('public'::regnamespace)
      AND oid::regclass::text NOT IN ('kysely_migration', 'kysely_migration_lock')
    );
  END
  $do$;
  `.execute(db).catch((e) => {
    throw e;
  });

  return true;
}

const populateDB = async () => {
  await db.transaction().execute(async trx => {

  })
}

const main = async () => {
  await resetDB()

  console.log('=== DATABASE RESET ===')

  if (process.argv[2] !== 'reset-only') {
    await populateDB()
    console.log('=== DATABASE POPULATED ===')
  }

  process.exit(0)
}

main()