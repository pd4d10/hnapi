import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class DeletedItem {
  itemId: number;

  constructor(id: number) {
    this.itemId = id;
    this.id = id.toString();
  }

  @Field(() => ID, { description: "The item's unique id." })
  id: string;
}
