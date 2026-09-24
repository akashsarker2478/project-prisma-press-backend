import { role } from "../../generated/prisma/enums";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: String;
        name: string;
        id: String;
        role: role;
      };
    }
  }
}