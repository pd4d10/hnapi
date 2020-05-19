import { BaseItem } from "./base-item";
import {
  Field,
  Int,
  ObjectType,
  Resolver,
  FieldResolver,
  Root,
} from "type-graphql";
import { Comment } from "./comment";
import { dl, HnStory } from "./services";
import { Maybe } from "./types";

@ObjectType()
export class Story extends BaseItem {
  @Field({ nullable: true, description: "The story text. HTML." })
  text?: string;

  @Field({ nullable: true, description: "The URL of the story." })
  url?: string;

  @Field(() => Int, { nullable: true, description: "The story's score." })
  score?: number;

  @Field({ nullable: true, description: "The title of the story." })
  title?: string;

  @Field(() => [Comment], {
    description: "The story's comments, in ranked display order.",
  })
  comments: Comment[];
}

@Resolver(() => Story)
export class StoryResolver {
  private async load(id: string): Promise<HnStory> {
    const v = await dl.item.load(parseInt(id));
    if (v.type !== "story") throw new Error("Not a story");
    return v;
  }

  @FieldResolver()
  async text(@Root() { id }: Story): Promise<Maybe<string>> {
    const v = await this.load(id);
    return v.text;
  }

  @FieldResolver()
  async url(@Root() { id }: Story): Promise<Maybe<string>> {
    const v = await this.load(id);
    return v.url;
  }

  @FieldResolver()
  async score(@Root() { id }: Story): Promise<Maybe<number>> {
    const v = await this.load(id);
    return v.score;
  }

  @FieldResolver()
  async title(@Root() { id }: Story): Promise<Maybe<string>> {
    const v = await this.load(id);
    return v.title;
  }

  @FieldResolver()
  async comments(@Root() { id }: Story): Promise<Comment[]> {
    const v = await this.load(id);
    const cs = await dl.item.loadMany(v.descendants);
    return cs.map((c) => {
      if (c instanceof Comment) {
        return c;
      } else if (c instanceof Error) {
        throw c;
      } else {
        throw new Error(`${c.id} is not a comment`);
      }
    });
  }
}
