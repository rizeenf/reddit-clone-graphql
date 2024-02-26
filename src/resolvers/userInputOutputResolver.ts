import { User } from "../entities/User";
import { InputType, Field, ObjectType } from "type-graphql";

@InputType()
export class UsernamePasswordInput {
  @Field()
  username!: string;

  @Field()
  password!: string;
}

@ObjectType()
export class ErrorField {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [ErrorField], { nullable: true })
  errors?: ErrorField[];

  @Field(() => User, { nullable: true })
  user?: User;
}
