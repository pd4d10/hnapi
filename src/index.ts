import "reflect-metadata";
import Koa from "koa";
import Router from "@koa/router";
import graphqlHTTP from "koa-graphql";
import { schema } from "./schema";

const app = new Koa();
const router = new Router();

router.all("/graphql", graphqlHTTP({ schema, graphiql: true }));

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
