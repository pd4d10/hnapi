import { BaseItem } from "./base-item";
import {
  Field,
  Int,
  ObjectType,
  Resolver,
  FieldResolver,
  Root,
  Ctx,
} from "type-graphql";
import { Poll } from "./poll";
import { MyContext, HnPollopt } from "./services";

@ObjectType()
export class Pollopt extends BaseItem {
  @Field(() => Poll, { description: "The pollopt's associated poll." })
  poll: Poll;

  @Field(() => Int, { description: "The votes for a pollopt." })
  score: number;
}

@Resolver(() => Pollopt)
export class PollResolver {
  private async load<T>(
    { itemId }: Pollopt,
    { dl }: MyContext,
    extractor: (c: HnPollopt) => T
  ): Promise<T> {
    const v = await dl.item.load(itemId);
    if (v.type !== "pollopt") throw new Error("Not a pollopt");
    return extractor(v);
  }

  @FieldResolver()
  async poll(@Root() root: Pollopt, @Ctx() ctx: MyContext): Promise<Poll> {
    const id = await this.load(root, ctx, (v) => v.poll);
    return new Poll(id);
  }

  @FieldResolver()
  async score(@Root() root: Pollopt, @Ctx() ctx: MyContext): Promise<number> {
    return this.load(root, ctx, (v) => v.score);
  }
}
