export interface AiProvider {
  generateRecipe(
    ingredients: string[],
    prompt: string,
  ): Promise<AiRecipeResponse>;
}

export interface AiRecipeResponse {
  recipes: {
    name: string;
    description: string;
    steps: string[];
    ingredients: string[];
  }[];
}

export const AI_PROVIDER = Symbol("AI_PROVIDER");
