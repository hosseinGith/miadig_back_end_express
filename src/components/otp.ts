import { Base_sql } from ".";
import { Otp_codes } from "../types/database";
import { setConection } from "../utils";

export class Otp extends Base_sql {
  #columnName: string = "otp_codes";

  public async get(gmail: string): Promise<Otp_codes[]> {
    const [result] = await setConection(
      this.connection,
      `SELECT * FROM  ${this.#columnName} WHERE gmail = BINARY ?`,
      [gmail]
    );
    return result;
  }
  public async update(gmail: string, code: string) {
    const [result] = await setConection(
      this.connection,
      `UPDATE  ${this.#columnName} 
       SET otp_code = ?
       WHERE gmail = BINARY ?
       `,
      [code, gmail]
    );
    return result.affectedRows > 0;
  }

  public async set(gmail: string, code: string) {
    const checkGmail = await this.get(gmail);

    if (checkGmail.length > 0) {
      return this.update(gmail, code);
    }

    const [result] = await setConection(
      this.connection,
      `INSERT INTO ${this.#columnName} 
               ( gmail, otp_code)
              VALUES ( ? , ? ) `,
      [gmail, code]
    );
    return result.affectedRows > 0;
  }

  public async remove(gmail: string) {
    const [result] = await setConection(
      this.connection,
      `DELETE FROM ${this.#columnName} 
        WHERE gmail = BINARY ?  `,
      [gmail]
    );
    return result.affectedRows > 0;
  }
}
