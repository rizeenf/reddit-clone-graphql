import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

const mikroConfig = {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post],
  dbName: "rireddit",
  type: "postgresql",
  debug: !__prod__,
  user: "postgres",
  password: "postgres",
} as Parameters<typeof MikroORM.init>[0];

export default mikroConfig;
