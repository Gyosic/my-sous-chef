import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

@Injectable()
export class SttService {
  private client: OpenAI;

  // Whisper가 무음/노이즈에서 자주 환각하는 패턴
  private static readonly HALLUCINATION_PATTERNS = [
    /^MBC\s*뉴스/,
    /^KBS\s*뉴스/,
    /^SBS\s*뉴스/,
    /이덕영입니다/,
    /^시청해\s*주셔서\s*감사합니다/,
    /^구독과\s*좋아요/,
    /^자막\s*제공/,
    /^영상\s*제공/,
    /^감사합니다\.?\s*$/,
    /^네\.?\s*$/,
    /^\.+$/,
  ];

  constructor(private configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.getOrThrow<string>("OPENAI_API_KEY"),
    });
  }

  async transcribe(
    audioBuffer: Buffer,
    mimeType = "audio/webm",
  ): Promise<string> {
    // 너무 짧은 오디오는 무음으로 간주
    if (audioBuffer.length < 10000) {
      return "";
    }

    const ext = mimeType.includes("webm") ? "webm" : "wav";
    const blob = new Blob([new Uint8Array(audioBuffer)], { type: mimeType });
    const file = new File([blob], `audio.${ext}`, { type: mimeType });

    const response = await this.client.audio.transcriptions.create({
      model: "whisper-1",
      file,
      language: "ko",
    });

    const text = response.text.trim();

    // Hallucination 필터링
    if (this.isHallucination(text)) {
      return "";
    }

    return text;
  }

  private isHallucination(text: string): boolean {
    return SttService.HALLUCINATION_PATTERNS.some((pattern) =>
      pattern.test(text),
    );
  }
}
