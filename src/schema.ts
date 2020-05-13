import { buildSchemaSync } from "type-graphql";
import { UserResolver } from "./user";

export const schema = buildSchemaSync({
  resolvers: [UserResolver],
});
