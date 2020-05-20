import { BaseItem } from "./base-item";
import {
  Field,
  Int,
  ObjectType,
  Resolver,
  FieldResolver,
  Root,
  Ctx,
  Maybe,
} from "type-graphql";
import { Comment } from "./comment";
import { HnStory, MyContext } from "./services";

@ObjectType()
export class Story extends BaseItem {
  @Field({ nullable: true, description: "The story text. HTML." })
  text?: string;

  @Field({ nullable: true, description: "The URL of the story." })
  url?: string;

  @Field(() => Int, { nullable: true, description: "The story's score." })
  score?: number;

  @Field({ nullable: true, description: "The title of the story." })
  title?: string;

  @Field(() => [Comment], {
    description: "The story's comments, in ranked display order.",
  })
  comments: Comment[];
}

@Resolver(() => Story)
export class StoryResolver {
  private async load<T>(
    { itemId }: Story,
    { dl }: MyContext,
    extractor: (c: HnStory) => T
  ): Promise<T> {
    const v = await dl.item.load(itemId);
    if (v.type !== "story") throw new Error("Not a story");
    return extractor(v);
  }

  @FieldResolver()
  async text(
    @Root() root: Story,
    @Ctx() ctx: MyContext
  ): Promise<Maybe<string>> {
    return this.load(root, ctx, (v) => v.text);
  }

  @FieldResolver()
  async url(
    @Root() root: Story,
    @Ctx() ctx: MyContext
  ): Promise<Maybe<string>> {
    return this.load(root, ctx, (v) => v.url);
  }

  @FieldResolver()
  async score(
    @Root() root: Story,
    @Ctx() ctx: MyContext
  ): Promise<Maybe<number>> {
    return this.load(root, ctx, (v) => v.score);
  }

  @FieldResolver()
  async title(
    @Root() root: Story,
    @Ctx() ctx: MyContext
  ): Promise<Maybe<string>> {
    return this.load(root, ctx, (v) => v.title);
  }

  @FieldResolver()
  async comments(
    @Root() root: Story,
    @Ctx() ctx: MyContext
  ): Promise<Comment[]> {
    const descendants = await this.load(root, ctx, (v) => v.descendants);
    const cs = await ctx.dl.item.loadMany(descendants);
    return cs.map((c) => {
      if (c instanceof Comment) {
        return c;
      } else if (c instanceof Error) {
        throw c;
      } else {
        throw new Error(`${c.id} is not a comment`);
      }
    });
  }
}
