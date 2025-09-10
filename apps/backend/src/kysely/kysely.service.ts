import { Injectable } from '@nestjs/common';
import { Kysely, PostgresDialect, Transaction } from 'kysely';
import { DatabaseError, Pool } from 'pg';
import { ConfigService } from '../config/config.service';
import { DB } from './schema';

@Injectable()
export class KyselyService extends Kysely<DB> {
  constructor(configService: ConfigService) {
    super({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: configService.get('DATABASE_URL'),
        }),
      }),
      log: ['error'],
    });
  }

  async execTx<T>(
    cb: (tx: Transaction<DB>) => Promise<T>,
    retry = 0,
    isolationLevel:
      | 'serializable'
      | 'read uncommitted'
      | 'read committed'
      | 'repeatable read' = 'serializable',
  ): Promise<T> {
    const tx = this.transaction().setIsolationLevel(isolationLevel);
    try {
      return await tx.execute(cb);
    } catch (err) {
      if (err instanceof DatabaseError && err.code === '40001' && retry < 3) {
        return await this.execTx(cb, retry + 1);
      } else {
        throw err;
      }
    }
  }
}
