import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import {
  AiProvider,
  AiRecipeResponse,
  ConversationMessage,
} from "../ai.interface";
import { buildPrompt, parseRecipe } from "@/ai/providers/utils";

@Injectable()
export class OpenAiProvider implements AiProvider {
  private client: OpenAI;

  constructor(private configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.getOrThrow<string>("OPENAI_API_KEY"),
    });
  }

  async generateRecipe(
    ingredients: string[],
    prompt: string,
    dishCategories: Map<string, string>,
    cuisineCategories: Map<string, string>,
  ): Promise<AiRecipeResponse> {
    const dishOptions = Array.from(dishCategories.keys());
    const cuisineOptions = Array.from(cuisineCategories.keys());

    const response = await this.client.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: buildPrompt(
            ingredients,
            prompt,
            dishOptions,
            cuisineOptions,
          ),
        },
      ],
    });

    const text = response?.choices?.[0]?.message.content ?? "";

    const recipes = parseRecipe(text, dishCategories, cuisineCategories);

    return { recipes };
  }

  async *streamCookingGuidance(
    systemPrompt: string,
    conversationHistory: ConversationMessage[],
    userMessage: string,
  ): AsyncGenerator<string, void, unknown> {
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user" as const, content: userMessage },
    ];

    const stream = await this.client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }
}
