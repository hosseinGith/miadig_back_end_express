import crypto from "crypto";
import { Base_sql } from ".";
import { mySqlData, setConection } from "../utils";
import { ProductKeys, ProductKeys_arr } from "../types/db/products";
//
export class Product extends Base_sql {
  public async get(
    dataRequested: ProductKeys_arr,
    name_search: string,
    value_search: string
  ) {
    const [result] = await setConection(
      this.connection,
      `SELECT ${dataRequested} FROM all WHERE ${name_search} = BINARY ?`,
      [value_search],
      mySqlData.products
    );
    return result;
  }
  public async set(productKeys: string[]) {
    const [result] = await setConection(
      this.connection,
      `INSERT INTO all (${ProductKeys.join().replace(
        "id,",
        ""
      )}) VALUES (${Array(ProductKeys.length - 2).fill("?")}) `,
      [...productKeys],
      mySqlData.products
    );
    return result;
  }
  public async update(
    productId: string,
    name_replace: typeof ProductKeys,
    value_replace: string[]
  ) {
    const set_keys = name_replace.map((item, index: number) => {
      if (item !== "id")
        return (item = item + "=?" + (index < name_replace.length ? "," : ""));

      return "";
    });

    const [result] = await setConection(
      this.connection,
      `UPDATE all SET ${set_keys} WHERE id = BINARY ?`,
      [...value_replace, productId],
      mySqlData.products
    );
    return result.affectedRows > 0;
  }
}
