import {
  ObjectType,
  Field,
  Int,
  Resolver,
  Query,
  Arg,
  FieldResolver,
  Root,
  ID,
} from "type-graphql";
import { Story } from "./story";
import { dl } from "./services";
import { Item } from "./item";
import { Comment } from "./comment";
import { Job } from "./job";
import { Poll } from "./poll";
import { Pollopt } from "./pollopt";

@ObjectType()
export class User {
  constructor(id: string) {
    this.id = id;
  }

  @Field(() => ID, {
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

  @Field({
    nullable: true,
    description: "The user's optional self-description. HTML.",
  })
  about: string;

  @Field(() => [Item], {
    description: "List of the user's stories, polls and comments.",
  })
  submitted: typeof Item[];
}

@Resolver(() => User)
export class UserResolver {
  @Query(() => User)
  async user(@Arg("id") id: string): Promise<User> {
    return new User(id);
  }

  @FieldResolver()
  async delay(@Root() { id }: User): Promise<number> {
    const user = await dl.user.load(id);
    return user.delay ?? 0;
  }

  @FieldResolver()
  async created(@Root() { id }: User): Promise<Date> {
    const user = await dl.user.load(id);
    return new Date(user.created * 1000);
  }

  @FieldResolver()
  async karma(@Root() { id }: User): Promise<number> {
    const user = await dl.user.load(id);
    return user.karma;
  }

  @FieldResolver()
  async about(@Root() { id }: User): Promise<string | undefined> {
    const user = await dl.user.load(id);
    return user.about;
  }

  @FieldResolver()
  async submitted(@Root() { id }: User): Promise<typeof Item[]> {
    const user = await dl.user.load(id);
    const items = await dl.item.loadMany(
      (user.submitted ?? []).map((x) => x.toString())
    );
    return items.map((item) => {
      if (item instanceof Error) {
        throw item;
      }
      switch (item.type) {
        case "story":
          return new Story(item.id);
        case "comment":
          return new Comment(item.id);
        case "job":
          return new Job(item.id);
        case "poll":
          return new Poll(item.id);
        case "pollopt":
          return new Pollopt(item.id);
        default:
          throw new Error("Invalid type");
      }
    });
  }
}
