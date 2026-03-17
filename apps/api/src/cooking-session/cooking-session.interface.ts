import { ConversationMessage } from "src/ai/ai.interface";

export interface CookingSession {
  sessionId: string;
  recipeId: string;
  recipe: RecipeData;
  model: string;
  conversationHistory: ConversationMessage[];
  createdAt: Date;
}

export interface RecipeData {
  name: string;
  description: string;
  steps: string[];
  ingredients: string[];
}

export interface StartSessionPayload {
  recipeId: string;
  recipe: RecipeData;
  model?: string;
}

export interface AudioChunkPayload {
  sessionId: string;
  chunk: ArrayBuffer | Buffer;
}

export interface TextMessagePayload {
  sessionId: string;
  message: string;
}

export interface EndSessionPayload {
  sessionId: string;
}
