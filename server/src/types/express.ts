import { GroupDoc } from "@/groups/groupModel";
import { UserDoc } from "@/users/userModel";

declare global {
  namespace Express {
    interface Request {
      user?: UserDoc;
      group?: GroupDoc;
    }
  }
}

export {};
