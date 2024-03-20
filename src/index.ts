import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolvers } from "./resolvers/helloResolvers";
import { PostResolvers } from "./resolvers/postResolvers";
import { UserResolvers } from "./resolvers/userResolvers";

import RedisStore from "connect-redis";
import session from "express-session";
import redis from "redis";
import cors from "cors";

// Initialize client.

const main = async () => {
  // Postgres connection
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  // Server connection
  const app = express();

  const redisStore = RedisStore(session);
  let redisClient = redis.createClient();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  // Initialize session storage.
  app.use(
    session({
      name: "red-session",
      store: new redisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 1, // 1 Year
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      resave: false, // required: force lightweight session keep alive (touch)
      saveUninitialized: false, // recommended: only save session when data exists
      secret: "awokaowkwaokawokaowkwaok",
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolvers, PostResolvers, UserResolvers],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }), // Descructure em from orm.em
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000");
  });
};

main().catch((err) => console.error(err));
