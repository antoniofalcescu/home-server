import { Pool } from 'pg';
import { Storage } from '../../common/storage';
import { AuthenticationDalError } from './errors';

export class AuthenticationDal {
  public async getUserById(userId: string): Promise<unknown> {
    const client = await this._postgres.connect();

    try {
      const result = await client.query('SELECT * FROM home_server.users WHERE id = $1', [userId]);
      return result.rows[0];
    } catch (error) {
      throw new AuthenticationDalError((error as Error).message);
    } finally {
      client.release();
    }
  }

  private get _postgres(): Pool {
    return Storage.getInstance().getPostgres();
  }
}
