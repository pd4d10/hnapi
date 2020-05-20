import { BaseItem } from "./base-item";
import {
  Field,
  ObjectType,
  Resolver,
  FieldResolver,
  Root,
  Ctx,
  Maybe,
} from "type-graphql";
import { Story } from "./story";
import { HnComment, MyContext } from "./services";

@ObjectType()
export class Comment extends BaseItem {
  @Field({ description: "The comment, story or poll text. HTML." })
  text: string;

  @Field(() => Story, {
    description:
      "The comment's parent: either another comment or the relevant story.",
  })
  parent: Story; // TODO: Comment

  @Field(() => [Comment], {
    description: "The item's comments, in ranked display order.",
  })
  kids: Comment[];
}

@Resolver(() => Comment)
export class CommentResolver {
  private async load<T>(
    { itemId }: Comment,
    { dl }: MyContext,
    extractor: (c: HnComment) => T
  ): Promise<T> {
    const v = await dl.item.load(itemId);
    if (v.type !== "comment") throw new Error("Not a comment");
    return extractor(v);
  }

  @FieldResolver()
  async text(@Root() root: Comment, @Ctx() ctx: MyContext): Promise<string> {
    return this.load(root, ctx, (v) => v.text);
  }

  @FieldResolver()
  async parent(@Root() root: Comment, @Ctx() ctx: MyContext): Promise<Story> {
    return this.load(root, ctx, (v) => new Story(v.parent));
  }

  @FieldResolver()
  async kids(@Root() root: Comment, @Ctx() ctx: MyContext): Promise<Comment[]> {
    return this.load(root, ctx, (v) => v.kids.map((k) => new Comment(k)));
  }
}
