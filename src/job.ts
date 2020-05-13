import { Item } from "./item";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Job extends Item {
  @Field({ description: "The title of the job." })
  title: string;
}
