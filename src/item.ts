import { ObjectType, Field, Int } from "type-graphql";
import { User } from "./user";

@ObjectType()
export class Item {
  @Field(() => Int, { description: "The item's unique id." })
  id: number;

  @Field({ description: "true if the item is deleted." })
  deleted: boolean;

  @Field(() => User, { description: "The the item's author." })
  by: User;

  @Field({ description: "Creation date of the item." })
  time: Date;

  @Field({ description: "true if the item is dead." })
  dead: boolean;
}
