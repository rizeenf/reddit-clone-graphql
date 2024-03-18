"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolvers = void 0;
const argon2_1 = __importDefault(require("argon2"));
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const userInputOutputResolver_1 = require("./userInputOutputResolver");
let UserResolvers = class UserResolvers {
    async me({ req, em }) {
        console.log(req.session);
        if (!req.session.userId) {
            return null;
        }
        const user = await em.findOne(User_1.User, { id: req.session.userId });
        return user;
    }
    async registerUser(input, { em, req }) {
        const hashedPassword = await argon2_1.default.hash(input.password);
        if (input.password.length <= 2) {
            return {
                errors: [
                    {
                        field: "Password",
                        message: "Must be at least 3 characters.",
                    },
                ],
            };
        }
        if (input.username.length <= 2) {
            return {
                errors: [
                    {
                        field: "Username",
                        message: "Must be at least 3 characters.",
                    },
                ],
            };
        }
        const user = em.create(User_1.User, {
            username: input.username,
            password: hashedPassword,
        });
        try {
            await em.persistAndFlush(user);
        }
        catch (error) {
            if (error.code === "23505" || error.detail.includes("already exists")) {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "Already registered.",
                        },
                    ],
                };
            }
        }
        req.session.userId = user.id;
        return {
            user,
        };
    }
    async loginUser(input, { em, req }) {
        const user = await em.findOne(User_1.User, { username: input.username });
        if (!user) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "Username doesn't exist",
                    },
                ],
            };
        }
        const valid = await argon2_1.default.verify(user.password, input.password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Incorrect password",
                    },
                ],
            };
        }
        req.session.userId = user.id;
        return {
            user,
        };
    }
};
exports.UserResolvers = UserResolvers;
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolvers.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => userInputOutputResolver_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userInputOutputResolver_1.UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolvers.prototype, "registerUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => userInputOutputResolver_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userInputOutputResolver_1.UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolvers.prototype, "loginUser", null);
exports.UserResolvers = UserResolvers = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolvers);
//# sourceMappingURL=userResolvers.js.map