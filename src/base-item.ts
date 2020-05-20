import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./user";

@ObjectType({ isAbstract: true })
export class BaseItem {
  itemId: number;

  constructor(id: number) {
    this.itemId = id;
    this.id = id.toString();
  }

  @Field(() => ID, { description: "The item's unique id." })
  id: string;

  @Field({ description: "true if the item is deleted." })
  deleted: boolean;

  @Field(() => User, { description: "The the item's author." })
  by: User;

  @Field({ description: "Creation date of the item." })
  time: Date;

  @Field({ description: "true if the item is dead." })
  dead: boolean;
}
