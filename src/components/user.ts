import crypto from "crypto";
import { Base_sql } from ".";
import { createHashkey, setConection } from "../utils";
//
export class Users extends Base_sql {
  public async get(username: string, userDataRequested: string) {
    const [result] = await setConection(
      this.connection,
      `SELECT  ${userDataRequested} FROM  users WHERE username = BINARY ?`,
      [username]
    );
    return result;
  }
  public async set(username: string) {
    const { token, secretKey } = createHashkey({ username });
    const contains = await this.get(username, "username");
    const result = await setConection(
      this.connection,
      !contains[0]
        ? `INSERT INTO users 
         ( user_key, username)
        VALUES ( ? , ? ) `
        : `UPDATE users SET user_key =? , username =?
         WHERE username =BINARY ? `,
      [secretKey, username, contains[0] ? username : ""]
    );

    return { token, result };
  }
  public add(sql: string, params: string[]) {}
}
