import { Item } from "./item";
import { Field, Int, ObjectType } from "type-graphql";
import { Poll } from "./poll";

@ObjectType()
export class Pollopt extends Item {
  @Field({ description: "The pollopt's associated poll." })
  poll: Poll;
  @Field(() => Int, { description: "The votes for a pollopt." })
  score: number;
}
