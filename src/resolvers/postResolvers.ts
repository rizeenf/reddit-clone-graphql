import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";
import { ContextType } from "../types";

@Resolver()
export class PostResolvers {
  // Fetch data for all posts
  @Query(() => [Post])
  posts(@Ctx() { em }: ContextType): Promise<Post[]> {
    // Descructure em from orm.em, then return Promise from Post[]
    return em.find(Post, {});
  }

  // Fetch data for single post
  @Query(() => Post, { nullable: true })
  post(
    @Arg("id") id: number,
    @Ctx() { em }: ContextType
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  // Create single post
  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { em }: ContextType
  ): Promise<Post> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  // Update single post
  @Mutation(() => Post)
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", { nullable: true }) title: string,
    @Ctx() { em }: ContextType
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });

    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post;
  }

  // Delete single post
  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { em }: ContextType
  ): Promise<boolean> {
    await em.nativeDelete(Post, { id });

    return true;
  }
}
