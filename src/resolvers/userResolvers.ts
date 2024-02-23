import { User } from "../entities/User";
import { ContextType } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username!: string;

  @Field()
  password!: string;
}

@ObjectType()
class ErrorField {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [ErrorField], { nullable: true })
  errors?: ErrorField[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolvers {
  @Mutation(() => UserResponse)
  async registerUser(
    @Arg("input") input: UsernamePasswordInput,
    @Ctx() { em }: ContextType
  ): Promise<UserResponse> {
    const hashedPassword = await argon2.hash(input.password);
    const user = em.create(User, {
      username: input.username,
      password: hashedPassword,
    });

    await em.persistAndFlush(user);
    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async loginUser(
    @Arg("input") input: UsernamePasswordInput,
    @Ctx() { em }: ContextType
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

    return {
      user,
    };
  }
}
