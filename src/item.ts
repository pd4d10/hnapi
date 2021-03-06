import { createUnionType } from "type-graphql";
import { Story } from "./story";
import { Job } from "./job";
import { Comment } from "./comment";
import { Poll } from "./poll";
import { Pollopt } from "./pollopt";
import { DeletedItem } from "./deleted-item";
import { DeadItem } from "./dead-item";

export const Item = createUnionType({
  name: "Item",
  types: () => [Story, Job, Comment, Poll, Pollopt, DeletedItem, DeadItem],
});
