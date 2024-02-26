import argon2 from "argon2";
import { ContextType } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { UserResponse, UsernamePasswordInput } from "./userInputOutputResolver";

@Resolver()
export class UserResolvers {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: ContextType) {
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });

    return user;
  }
  @Mutation(() => UserResponse)
  async registerUser(
    @Arg("input") input: UsernamePasswordInput,
    @Ctx() { em }: ContextType
  ): Promise<UserResponse> {
    const hashedPassword = await argon2.hash(input.password);

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
    const user = em.create(User, {
      username: input.username,
      password: hashedPassword,
    });

    try {
      await em.persistAndFlush(user);
    } catch (error) {
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

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async loginUser(
    @Arg("input") input: UsernamePasswordInput,
    @Ctx() { em, req }: ContextType
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: input.username });
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

    const valid = await argon2.verify(user.password, input.password);

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
}
