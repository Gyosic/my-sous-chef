import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Anthropic from "@anthropic-ai/sdk";
import {
  AiProvider,
  AiRecipeResponse,
  ConversationMessage,
} from "../ai.interface";

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
  ): Promise<AiRecipeResponse> {
    const response = await this.client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: this.buildPrompt(ingredients, prompt),
        },
      ],
    });

    const text =
      response?.content?.[0]?.type === "text" ? response.content[0].text : "";

    const recipes: AiRecipeResponse = JSON.parse(text);

    return recipes;
  }

  async *streamCookingGuidance(
    systemPrompt: string,
    conversationHistory: ConversationMessage[],
    userMessage: string,
  ): AsyncGenerator<string, void, unknown> {
    const messages: Anthropic.MessageParam[] = [
      ...conversationHistory.map((msg) => ({
        role: msg.role as "user" | "assistant",
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

  private buildPrompt(ingredients: string[], prompt: string): string {
    return `당신은 요리 전문가입니다.
사용자가 가진 재료: ${ingredients.join(", ")}
${prompt ? `추가 요청: ${prompt}` : ""}

이 재료로 만들 수 있는 레시피 3개를 추천해주세요.
steps는 최대한 상세하게, 요리 초보자도 쉽게 따라할 수 있게 설명해주세요.
반드시 아래 JSON 형식으로만 응답하세요:
{"recipes": [{"name": "요리명", "description": "간단한 설명", "steps": [{"title":"1단계 타이틀","description": "1단계 설명"}, {"title":"2단계 타이틀","description": "2단계 설명"}], "ingredients": [{"name":"재료명", "amount": "필요한재료량", "optional": "선택사항(Boolean)"}, {"name":"재료명", "amount": "필요한재료량", "optional": "선택사항(Boolean)"}],"units": [{"name":"단위명칭(1큰술)","unit":"계량단위(15ml)"},{{"name":"단위명칭(1꼬집)","unit":"계량단위(2g)"}], "servings": "인분단위 분량(숫자만 소수점가능)", "time": "예상소요시간", "difficulty": "난이도(쉬움|보통|어려움)", "matchRate": "재료매칭률(숫자만)"}]}`;
  }
}
