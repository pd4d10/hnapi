import { BaseItem } from "./base-item";
import { Field, Int, ObjectType } from "type-graphql";
import { Poll } from "./poll";

@ObjectType()
export class Pollopt extends BaseItem {
  @Field(() => Poll, { description: "The pollopt's associated poll." })
  poll: Poll;

  @Field(() => Int, { description: "The votes for a pollopt." })
  score: number;
}
