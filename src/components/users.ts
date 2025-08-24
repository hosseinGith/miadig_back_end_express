import crypto from "crypto";
import { Base_sql } from ".";
import { setConection } from "../utils";
//
export class Users extends Base_sql {
  public async get(userDataRequested: string, username: string) {
    const result = setConection(
      this.connection,
      `SELECT  ${userDataRequested} FROM  users WHERE username = BINARY ?`,
      [username]
    );
    return result;
  }
  public set() {
    const user_key = crypto.randomBytes(32).toString("hex");
    const result = setConection(
      this.connection,
      `INSERT INTO users 
         ( user_key, username, password)
        VALUES ( ? , ? , ?) 

          WHERE id = BINARY ?`,
      [user_key]
    );
    return result;
  }
  public add(sql: string, params: string[]) {}
}
