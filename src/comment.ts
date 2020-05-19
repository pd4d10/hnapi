import { BaseItem } from "./base-item";
import { Field, ObjectType, Resolver, FieldResolver, Root } from "type-graphql";
import { Story } from "./story";
import { HnComment, dl } from "./services";

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
  private async load(id: string): Promise<HnComment> {
    const v = await dl.item.load(parseInt(id));
    if (v.type !== "comment") throw new Error("Not a comment");
    return v;
  }

  @FieldResolver()
  async text(@Root() { id }: Comment): Promise<string | undefined> {
    const v = await this.load(id);
    return v.text;
  }
}
