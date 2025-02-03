import { Pool } from 'pg';
import { Storage } from '../../storage';
import { UserDalError } from './errors';
import { User } from './types';

export class UserDal {
  public async getUserById(id: string): Promise<User | undefined> {
    return this._getUserByInput('id', id);
  }

  public async getUserByUsername(username: string): Promise<User | undefined> {
    return this._getUserByInput('username', username);
  }

  public async getUserByEmail(email: string): Promise<User | undefined> {
    return this._getUserByInput('email', email);
  }

  private async _getUserByInput(column: string, input: string): Promise<User | undefined> {
    const client = await this._postgres.connect();

    try {
      const result = await client.query(`SELECT * FROM home_server.users WHERE ${column} = $1`, [input]);
      return result.rows[0];
    } catch (error) {
      throw new UserDalError((error as Error).message);
    } finally {
      client.release();
    }
  }

  private get _postgres(): Pool {
    return Storage.getInstance().getPostgres();
  }
}
