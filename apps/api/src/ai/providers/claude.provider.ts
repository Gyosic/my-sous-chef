import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Anthropic from "@anthropic-ai/sdk";
import {
  AiProvider,
  AiRecipeResponse,
  ConversationMessage,
} from "../ai.interface";
import { buildPrompt, parseRecipe } from "@/ai/providers/utils";

@Injectable()
export class ClaudeProvider implements AiProvider {
  private client: Anthropic;

  constructor(private configService: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.configService.getOrThrow<string>("ANTHROPIC_API_KEY"),
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

    const response = await this.client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
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

    const text =
      response?.content?.[0]?.type === "text" ? response.content[0].text : "";

    const recipes = parseRecipe(text, dishCategories, cuisineCategories);

    return { recipes };
  }

  async *streamCookingGuidance(
    systemPrompt: string,
    conversationHistory: ConversationMessage[],
    userMessage: string,
  ): AsyncGenerator<string, void, unknown> {
    const messages: Anthropic.MessageParam[] = [
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user" as const, content: userMessage },
    ];

    const stream = this.client.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        yield event.delta.text;
      }
    }
  }
}
