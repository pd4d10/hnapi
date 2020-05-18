import { BaseItem } from "./base-item";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Job extends BaseItem {
  @Field({ description: "The title of the job." })
  title: string;
}
