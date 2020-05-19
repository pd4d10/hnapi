import { buildSchemaSync } from "type-graphql";
import { UserResolver } from "./user";
import { StoryResolver } from "./story";
import { CommentResolver } from "./comment";

export const schema = buildSchemaSync({
  resolvers: [UserResolver, StoryResolver, CommentResolver],
});
