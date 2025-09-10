import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  /**
   * Database request logging
   */
  await db.schema
    .createType('request_method_type')
    .asEnum(['GET', 'POST', 'DELETE', 'PUT', 'PATCH'])
    .execute()

  await db.schema
    .createTable('_log_http_request_raw')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('endpoint', 'text', (col) => col.notNull())
    .addColumn('method', sql`request_method_type`, (col) => col.notNull())
    .addColumn('payload', 'jsonb')
    .addColumn('message', 'text')
    .addColumn('status', 'integer')
    .addColumn('requested_by', 'integer')
    .addColumn('requested_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn('respond_time', 'integer', (col) => col.notNull())
    .addColumn('responded_at', 'timestamptz', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('_log_http_request_error')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('endpoint', 'text', (col) => col.notNull())
    .addColumn('method', sql`request_method_type`, (col) => col.notNull())
    .addColumn('payload', 'jsonb')
    .addColumn('message', 'text')
    .addColumn('status', 'integer')
    .addColumn('error', 'text')
    .addColumn('requested_by', 'integer')
    .addColumn('requested_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn('respond_time', 'integer', (col) => col.notNull())
    .addColumn('responded_at', 'timestamptz', (col) => col.notNull())
    .execute();

  await db.executeQuery(
    sql`
      CREATE OR REPLACE FUNCTION log_limit()
      RETURNS TRIGGER AS $$
      BEGIN
        DELETE FROM _log_http_request_raw WHERE id NOT IN (
          SELECT id FROM _log_http_request_raw ORDER BY requested_at DESC LIMIT 5000
        );

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `.compile(db)
  )

  await db.executeQuery(
    sql`
      CREATE TRIGGER log_http_raw
      AFTER INSERT ON _log_http_request_raw
      FOR EACH ROW EXECUTE FUNCTION log_limit();
    `.compile(db)
  )
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('_log_http_request_error').execute()
  await db.schema.dropTable('_log_http_request_raw').execute()
  await db.schema.dropType('request_method_type').ifExists().execute()
}
