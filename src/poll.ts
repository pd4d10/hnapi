import { BaseItem } from "./base-item";
import {
  Field,
  ObjectType,
  Resolver,
  FieldResolver,
  Root,
  Ctx,
  Maybe,
} from "type-graphql";
import { Pollopt } from "./pollopt";
import { MyContext, HnPoll } from "./services";

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

@Resolver(() => Poll)
export class PollResolver {
  private async load<T>(
    { itemId }: Poll,
    { dl }: MyContext,
    extractor: (c: HnPoll) => T
  ): Promise<T> {
    const v = await dl.item.load(itemId);
    if (v.type !== "poll") throw new Error("Not a poll");
    return extractor(v);
  }

  @FieldResolver()
  async text(
    @Root() root: Poll,
    @Ctx() ctx: MyContext
  ): Promise<Maybe<string>> {
    return this.load(root, ctx, (v) => v.text);
  }

  @FieldResolver()
  async title(
    @Root() root: Poll,
    @Ctx() ctx: MyContext
  ): Promise<Maybe<string>> {
    return this.load(root, ctx, (v) => v.title);
  }

  @FieldResolver()
  async parts(@Root() root: Poll, @Ctx() ctx: MyContext): Promise<Pollopt[]> {
    const parts = await this.load(root, ctx, (v) => v.parts);
    return parts.map((id) => new Pollopt(id));
  }
}
