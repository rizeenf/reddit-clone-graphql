"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@mikro-orm/core");
const constants_1 = require("./constants");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const helloResolvers_1 = require("./resolvers/helloResolvers");
const postResolvers_1 = require("./resolvers/postResolvers");
const userResolvers_1 = require("./resolvers/userResolvers");
const connect_redis_1 = __importDefault(require("connect-redis"));
const express_session_1 = __importDefault(require("express-session"));
const redis_1 = __importDefault(require("redis"));
const cors_1 = __importDefault(require("cors"));
const main = async () => {
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    await orm.getMigrator().up();
    const app = (0, express_1.default)();
    const redisStore = (0, connect_redis_1.default)(express_session_1.default);
    let redisClient = redis_1.default.createClient();
    app.use((0, cors_1.default)({
        origin: "http://localhost:3000",
        credentials: true,
    }));
    app.use((0, express_session_1.default)({
        name: "red-session",
        store: new redisStore({
            client: redisClient,
            disableTouch: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 1,
            httpOnly: true,
            sameSite: "lax",
            secure: constants_1.__prod__,
        },
        resave: false,
        saveUninitialized: false,
        secret: "awokaowkwaokawokaowkwaok",
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [helloResolvers_1.HelloResolvers, postResolvers_1.PostResolvers, userResolvers_1.UserResolvers],
            validate: false,
        }),
        context: ({ req, res }) => ({ em: orm.em, req, res }),
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
//# sourceMappingURL=index.js.map