import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";
import { Session } from "express-session";

interface CustomSession extends Session {
  userId?: any; // Optional userId property
}

export type ContextType = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: CustomSession };
  res: Response;
};
