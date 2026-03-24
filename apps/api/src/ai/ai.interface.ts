import { RecipeInput } from "@repo/db/types/recipes";

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AiProvider {
  generateRecipe(
    ingredients: string[],
    prompt: string,
  ): Promise<AiRecipeResponse>;

  streamCookingGuidance(
    systemPrompt: string,
    conversationHistory: ConversationMessage[],
    userMessage: string,
  ): AsyncGenerator<string, void, unknown>;
}

export interface AiRecipeResponse {
  recipes: (RecipeInput & { type: string })[];
}

export const AI_PROVIDER = Symbol("AI_PROVIDER");
