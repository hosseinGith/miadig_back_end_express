import crypto from "crypto";
import { Base_sql } from ".";
import { createHashkey, messages_response, setConection } from "../utils";
import { StoriesType } from "../types/db/main";
//

export class Stories extends Base_sql {
  /**
   *
   * @param userDataRequested user type data
   * @param type   return array or single data
   * @param keyName database search key name
   * @param resolveKeyName equal database search
   * @param position get values between
   * @returns
   */

  public async getWithType(
    userDataRequested: "*" | string[],
    type: "single" | "multi",
    id: number,
    position?: { start?: number; end?: number; all?: boolean }
  ) {
    const result = await setConection(
      this.connection,
      `SELECT ?? FROM stories WHERE id = ? ${
        type === "multi" && !position?.all ? `BETWEEN ? AND ? ` : ""
      }`,
      [
        userDataRequested === "*" ? "*" : userDataRequested.join(", "),
        id,
        String(position?.start),
        String(position?.end),
      ]
    );
    if (type === "single") return result[0];
    else return result;
  }

  public async set({
    category,
    likes_length,
    comments_length,
    ads,
    description,
    views,
    video_address,
    image_address,
    profile_image_address,
    show_story = false,
  }: StoriesType) {
    let sql = `INSERT INTO stories(
      sender_id,
      category,
      likes_length,
      comments_length,
      ads,
      description,
      views,
      video_address,
      image_address,
      profile_image_address,
      show_story
  )
  VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const result = await setConection(this.connection, sql, [
      category,
      likes_length,
      comments_length,
      JSON.stringify(ads),
      description,
      views,
      video_address,
      image_address,
      profile_image_address,
      show_story,
    ]);

    return result;
  }
  /**
   *
   * @param id target story
   * @param columns target col name
   * @param values target col name value
   * @returns Conection result
   */
  public async update(id: number, columns: string[], values: string[]) {
    if (columns.length !== values.length)
      throw new Error(
        messages_response.system + " \n columns.length !== values.length"
      );

    let sql = `UPDATE stories
                  SET
                    ${
                      // dynamic set values
                      Array(columns.length)
                        .fill("")
                        .map((item) => (item = "?? = ?"))
                        .join(", ")
                    }
                  WHERE id = ?`;

    const result = await setConection(this.connection, sql, [...values, id]);

    return result;
  }
  public add(sql: string, params: string[]) {}
}
