import { Injectable, Logger } from "@nestjs/common";
import { randomUUID } from "crypto";
import { AiService } from "src/ai/ai.service";
import { SttService } from "src/ai/services/stt.service";
import { TtsService } from "src/ai/services/tts.service";
import {
  CookingSession,
  RecipeData,
  StartSessionPayload,
} from "./cooking-session.interface";

@Injectable()
export class CookingSessionService {
  private readonly logger = new Logger(CookingSessionService.name);
  private sessions = new Map<string, CookingSession>();
  private sessionTimeouts = new Map<string, NodeJS.Timeout>();

  private readonly SESSION_TTL = 2 * 60 * 60 * 1000; // 2 hours

  constructor(
    private aiService: AiService,
    private sttService: SttService,
    private ttsService: TtsService,
  ) {}

  createSession(payload: StartSessionPayload): CookingSession {
    const sessionId = randomUUID();
    const session: CookingSession = {
      sessionId,
      recipeId: payload.recipeId,
      recipe: payload.recipe,
      model: payload.model ?? "openai",
      conversationHistory: [],
      createdAt: new Date(),
    };

    this.sessions.set(sessionId, session);
    this.resetSessionTimeout(sessionId);

    this.logger.log(`Session created: ${sessionId} for recipe: ${payload.recipe.name}`);
    return session;
  }

  getSession(sessionId: string): CookingSession | undefined {
    return this.sessions.get(sessionId);
  }

  endSession(sessionId: string): void {
    this.sessions.delete(sessionId);
    const timeout = this.sessionTimeouts.get(sessionId);
    if (timeout) {
      clearTimeout(timeout);
      this.sessionTimeouts.delete(sessionId);
    }
    this.logger.log(`Session ended: ${sessionId}`);
  }

  async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    return this.sttService.transcribe(audioBuffer);
  }

  async synthesizeGreeting(text: string): Promise<Buffer> {
    return this.ttsService.synthesize(text);
  }

  async *processMessage(
    sessionId: string,
    userMessage: string,
  ): AsyncGenerator<{ type: "text" | "audio"; data: string | Buffer }> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error("세션을 찾을 수 없습니다");
    }

    this.resetSessionTimeout(sessionId);

    const systemPrompt = this.buildSystemPrompt(session.recipe);

    const stream = this.aiService.streamCookingGuidance(
      session.model,
      systemPrompt,
      session.conversationHistory,
      userMessage,
    );

    let fullResponse = "";
    let sentenceBuffer = "";

    for await (const chunk of stream) {
      fullResponse += chunk;
      sentenceBuffer += chunk;
      yield { type: "text", data: chunk };

      // Split by sentence endings for TTS
      const sentenceMatch = sentenceBuffer.match(/^(.*[.!?。]\s*)/);
      if (sentenceMatch && sentenceMatch[1]) {
        const sentence = sentenceMatch[1].trim();
        if (sentence.length > 0) {
          try {
            const audioBuffer = await this.ttsService.synthesize(sentence);
            yield { type: "audio", data: audioBuffer };
          } catch (err) {
            this.logger.error(`TTS failed for sentence: ${err}`);
          }
        }
        sentenceBuffer = sentenceBuffer.slice(sentenceMatch[1]!.length);
      }
    }

    // Process remaining text for TTS
    const remaining = sentenceBuffer.trim();
    if (remaining.length > 0) {
      try {
        const audioBuffer = await this.ttsService.synthesize(remaining);
        yield { type: "audio", data: audioBuffer };
      } catch (err) {
        this.logger.error(`TTS failed for remaining text: ${err}`);
      }
    }

    // Save conversation history
    session.conversationHistory.push(
      { role: "user", content: userMessage },
      { role: "assistant", content: fullResponse },
    );
  }

  private buildSystemPrompt(recipe: RecipeData): string {
    const steps = recipe.steps
      .map((step, i) => `${i + 1}. ${step}`)
      .join("\n");

    return `당신은 친절한 요리 도우미입니다.
현재 요리: ${recipe.name}
설명: ${recipe.description}
재료: ${recipe.ingredients.join(", ")}
조리 단계:
${steps}

사용자가 요리하면서 질문하면 현재 단계에 맞게 안내해주세요.
음성으로 읽히므로 3문장 이내로 짧고 명확하게 답변하세요.`;
  }

  private resetSessionTimeout(sessionId: string): void {
    const existing = this.sessionTimeouts.get(sessionId);
    if (existing) clearTimeout(existing);

    const timeout = setTimeout(() => {
      this.endSession(sessionId);
      this.logger.log(`Session timed out: ${sessionId}`);
    }, this.SESSION_TTL);

    this.sessionTimeouts.set(sessionId, timeout);
  }
}
