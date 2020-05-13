import { Item } from "./item";
import { Field, Int, ObjectType } from "type-graphql";
import { Comment } from "./comment";

@ObjectType()
export class Story extends Item {
  @Field({ description: "The story text. HTML." })
  text: string;
  @Field({ description: "The URL of the story." })
  url: string;
  @Field(() => Int, { description: "The story's score." })
  score: number;
  @Field({ description: "The title of the story." })
  title: string;
  @Field(() => [Comment], {
    description: "The story's comments, in ranked display order.",
  })
  comments: Comment[];
}
