import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

export type ContextType = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};
