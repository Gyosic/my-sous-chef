import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import {
  AiProvider,
  AiRecipeResponse,
  ConversationMessage,
} from "../ai.interface";

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
  ): Promise<AiRecipeResponse> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: this.buildPrompt(ingredients, prompt),
        },
      ],
    });

    const text = response?.choices?.[0]?.message.content ?? "";

    const recipes: AiRecipeResponse = JSON.parse(text);

    return recipes;
  }

  async *streamCookingGuidance(
    systemPrompt: string,
    conversationHistory: ConversationMessage[],
    userMessage: string,
  ): AsyncGenerator<string, void, unknown> {
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((msg) => ({
        role: msg.role as "user" | "assistant",
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

  private buildPrompt(ingredients: string[], prompt: string): string {
    return `당신은 요리 전문가입니다.
사용자가 가진 재료: ${ingredients.join(", ")}
${prompt ? `추가 요청: ${prompt}` : ""}

이 재료로 만들 수 있는 레시피 1개를 추천해주세요.
steps는 최대한 상세하게, 요리 초보자도 쉽게 따라할 수 있게 설명해주세요.
반드시 아래 JSON 형식으로만 응답하세요:
{"recipes": [{"name": "요리명", "description": "간단한 설명", "steps": ["1단계", "2단계"], "ingredients": ["재료1", "재료2"]}]}`;
  }
}
