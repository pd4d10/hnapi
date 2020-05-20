import { buildSchemaSync } from "type-graphql";
import { UserResolver } from "./user";
import { StoryResolver } from "./story";
import { CommentResolver } from "./comment";
import { JobResolver } from "./job";

export const schema = buildSchemaSync({
  resolvers: [UserResolver, StoryResolver, CommentResolver, JobResolver],
});
