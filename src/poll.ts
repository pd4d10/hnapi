import { BaseItem } from "./base-item";
import { Field, ObjectType } from "type-graphql";
import { Pollopt } from "./pollopt";

@ObjectType()
export class Poll extends BaseItem {
  @Field({ description: "The poll text. HTML." })
  text: string;

  @Field({ description: "The title of the poll." })
  title: string;

  @Field(() => [Pollopt], {
    description: "A list of related pollopts, in display order.",
  })
  parts: Pollopt[];
}
