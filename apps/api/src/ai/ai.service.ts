import { Injectable, BadRequestException, Inject } from "@nestjs/common";
import { ClaudeProvider } from "./providers/claude.provider";
import { OpenAiProvider } from "./providers/openai.provider";
import {
  AiProvider,
  AiRecipeResponse,
  ConversationMessage,
} from "./ai.interface";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "@repo/db/schema";
import { DRIZZLE } from "@/database/database.module";

@Injectable()
export class AiService {
  private providers: Map<string, AiProvider>;

  constructor(
    private claudeProvider: ClaudeProvider,
    private openAiProvider: OpenAiProvider,
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
  ) {
    this.providers = new Map<string, AiProvider>([
      ["claude", this.claudeProvider],
      ["openai", this.openAiProvider],
    ]);
  }
  private async loadCategories() {
    const all = await this.db.select().from(schema.categories);

    const dish = new Map(
      all.filter((c) => c.type === "dish").map((c) => [c.slug, c.id]),
    );
    const cuisine = new Map(
      all.filter((c) => c.type === "cuisine").map((c) => [c.slug, c.id]),
    );

    const category = { dish, cuisine };
    return category;
  }

  async generateRecipe(
    model: string,
    ingredients: string[],
    prompt: string,
  ): Promise<AiRecipeResponse> {
    const provider = this.getProvider(model);
    const { dish, cuisine } = await this.loadCategories();

    return provider.generateRecipe(ingredients, prompt, dish, cuisine);
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
