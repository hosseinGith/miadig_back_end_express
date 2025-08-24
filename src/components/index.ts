import mysql from "mysql2/promise";
import { mySqlData } from "../utils";
export class Base_sql {
  public async connection(database: string | undefined) {
    const connection = await mysql.createConnection({
      database,
      user: mySqlData.user,
      host: mySqlData.host,
      password: mySqlData.password,
    });
    return connection;
  }
}
