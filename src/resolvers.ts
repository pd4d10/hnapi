import { Resolver } from "type-graphql";
import { Recipe } from "./types";

@Resolver()
export class RecipeResolver {
  private recipesCollection: Recipe[] = [];

  async recipes() {
    return this.recipesCollection;
  }
}
