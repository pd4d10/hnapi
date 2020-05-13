import { Item } from "./item";
import { Field, ObjectType } from "type-graphql";
import { Story } from "./story";

@ObjectType()
export class Comment extends Item {
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
