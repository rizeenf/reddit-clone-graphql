import { Post } from "../entities/Post";
import { ContextType } from "../types";
import { Ctx, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolvers {
  @Query(() => [Post])
  posts(@Ctx() { em }: ContextType): Promise<Post[]> {
    // Descructure em from orm.em, then return Promise from Post[]
    return em.find(Post, {});
  }
}
