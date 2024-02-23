"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const helloResolvers_1 = require("./resolvers/helloResolvers");
const postResolvers_1 = require("./resolvers/postResolvers");
const userResolvers_1 = require("./resolvers/userResolvers");
const main = async () => {
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    await orm.getMigrator().up();
    const app = (0, express_1.default)();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [helloResolvers_1.HelloResolvers, postResolvers_1.PostResolvers, userResolvers_1.UserResolvers],
            validate: false,
        }),
        context: () => ({ em: orm.em }),
    });
    apolloServer.applyMiddleware({ app });
    app.listen(4000, () => {
        console.log("Server started on http://localhost:4000");
    });
};
main().catch((err) => console.error(err));
//# sourceMappingURL=index.js.map