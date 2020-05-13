import { Item } from "./item";
import { Field, ObjectType } from "type-graphql";
import { Pollopt } from "./pollopt";

@ObjectType()
export class Poll extends Item {
  @Field({ description: "The poll text. HTML." })
  text: string;

  @Field({ description: "The title of the poll." })
  title: string;

  @Field({ description: "A list of related pollopts, in display order." })
  parts: Pollopt[];
}
