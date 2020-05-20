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
  Maybe,
  Ctx,
} from "type-graphql";
import { Story } from "./story";
import { Item } from "./item";
import { Comment } from "./comment";
import { Job } from "./job";
import { Poll } from "./poll";
import { Pollopt } from "./pollopt";
import { MyContext, HnUser } from "./services";

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
  private async load<T>(
    { id }: User,
    { dl }: MyContext,
    extractor: (c: HnUser) => T
  ): Promise<T> {
    const v = await dl.user.load(id);
    return extractor(v);
  }

  @Query(() => User)
  async user(@Arg("id") id: string): Promise<User> {
    return new User(id);
  }

  @FieldResolver()
  async delay(@Root() root: User, @Ctx() ctx: MyContext): Promise<number> {
    return this.load(root, ctx, (v) => v.delay ?? 0);
  }

  @FieldResolver()
  async created(@Root() root: User, @Ctx() ctx: MyContext): Promise<Date> {
    return this.load(root, ctx, (v) => new Date(v.created * 1000));
  }

  @FieldResolver()
  async karma(@Root() root: User, @Ctx() ctx: MyContext): Promise<number> {
    return this.load(root, ctx, (v) => v.karma);
  }

  @FieldResolver()
  async about(
    @Root() root: User,
    @Ctx() ctx: MyContext
  ): Promise<Maybe<string>> {
    return this.load(root, ctx, (v) => v.about);
  }

  @FieldResolver()
  async submitted(
    @Root() root: User,
    @Ctx() ctx: MyContext
  ): Promise<typeof Item[]> {
    const submitted = await this.load(root, ctx, (v) => v.submitted);
    const items = await ctx.dl.item.loadMany(submitted ?? []);
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
