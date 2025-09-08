import dotenv from 'dotenv'
import * as path from 'node:path'
import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from 'kysely'
import { run } from 'kysely-migration-cli'
import pg from 'pg'
import { promises as fs } from 'node:fs'

dotenv.config()

const migrationFolder = path.join(__dirname, '../db/migrations')

const db = new Kysely<any>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: process.env.DATABASE_URL
    })
  })
})

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder
  })
})

run(db, migrator, migrationFolder)