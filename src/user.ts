import {
  ObjectType,
  Field,
  Int,
  Resolver,
  Query,
  Arg,
  FieldResolver,
} from "type-graphql";
import { Story } from "./story";

@ObjectType()
export class User {
  constructor(id: string) {
    this.id = id;
  }

  @Field({
    description: "The user's unique username. Case-sensitive. Required.",
  })
  id: string;

  @Field(() => Int, {
    description:
      "Delay in minutes between a comment's creation and its visibility to other users.",
  })
  delay: number;

  @Field({ description: "Creation date of the user, in Unix Time." })
  created: Date;

  @Field(() => Int, { description: "The user's karma." })
  karma: number;

  @Field({ description: "The user's optional self-description. HTML." })
  about: string;

  @Field(() => [Story], {
    description: "List of the user's stories, polls and comments.",
  })
  submitted: Story[];
}

@Resolver(() => User)
export class UserResolver {
  @Query(() => User)
  async user(@Arg("id") id: string): Promise<User> {
    return new User(id);
  }

  @FieldResolver()
  async delay(): Promise<number> {
    return 0;
  }
}
