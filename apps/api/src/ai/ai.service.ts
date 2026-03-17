import { Injectable, BadRequestException } from "@nestjs/common";
import { ClaudeProvider } from "./providers/claude.provider";
import { OpenAiProvider } from "./providers/openai.provider";
import {
  AiProvider,
  AiRecipeResponse,
  ConversationMessage,
} from "./ai.interface";

@Injectable()
export class AiService {
  private providers: Map<string, AiProvider>;

  constructor(
    private claudeProvider: ClaudeProvider,
    private openAiProvider: OpenAiProvider,
  ) {
    this.providers = new Map<string, AiProvider>([
      ["claude", this.claudeProvider],
      ["openai", this.openAiProvider],
    ]);
  }

  async generateRecipe(
    model: string,
    ingredients: string[],
    prompt: string,
  ): Promise<AiRecipeResponse> {
    const provider = this.getProvider(model);
    return provider.generateRecipe(ingredients, prompt);
  }

  streamCookingGuidance(
    model: string,
    systemPrompt: string,
    conversationHistory: ConversationMessage[],
    userMessage: string,
  ): AsyncGenerator<string, void, unknown> {
    const provider = this.getProvider(model);
    return provider.streamCookingGuidance(
      systemPrompt,
      conversationHistory,
      userMessage,
    );
  }

  getAvailableModels(): string[] {
    return [...this.providers.keys()];
  }

  private getProvider(model: string): AiProvider {
    const provider = this.providers.get(model);

    if (!provider) {
      const available = [...this.providers.keys()].join(", ");
      throw new BadRequestException(
        `지원하지 않는 모델입니다: ${model}. 사용 가능: ${available}`,
      );
    }

    return provider;
  }
}
