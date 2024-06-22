import "express";
import "express-session";
import { IUser } from "../../models/UserModel";

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}
declare module "express-session" {
  interface SessionData {
    cartId?: string;
    cartIdBeforeLogin?: string;
  }
}
