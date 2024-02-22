import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolvers } from "./resolvers/helloResolvers";
import { PostResolvers } from "./resolvers/postResolvers";

const main = async () => {
  // Postgres connection
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  // Server connection
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolvers, PostResolvers],
      validate: false,
    }),
    context: () => ({ em: orm.em }), // Descructure em from orm.em
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000");
  });
};

main().catch((err) => console.error(err));
