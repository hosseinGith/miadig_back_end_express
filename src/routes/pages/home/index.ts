import { Request, Response } from "express-serve-static-core";
import path from "path";
import { dirname } from "../../..";
import { Stories } from "../../../components/stories";

function home(req: Request, res: Response) {
  try {
    const stories = new Stories();
    // first section
    const stroiesSect = stories.getWithType("*", "multi", 1, { all: true });
  } catch (e) {}
}

export default home;
