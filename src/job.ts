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
import { MyContext, HnJob } from "./services";

@ObjectType()
export class Job extends BaseItem {
  @Field({ description: "The title of the job." })
  title: string;
}

@Resolver(() => Job)
export class JobResolver {
  private async load<T>(
    { itemId }: Job,
    { dl }: MyContext,
    extractor: (c: HnJob) => T
  ): Promise<T> {
    const v = await dl.item.load(itemId);
    if (v.type !== "job") throw new Error("Not a job");
    return extractor(v);
  }

  @FieldResolver()
  async title(
    @Root() root: Job,
    @Ctx() ctx: MyContext
  ): Promise<Maybe<string>> {
    return this.load(root, ctx, (v) => v.title);
  }
}
