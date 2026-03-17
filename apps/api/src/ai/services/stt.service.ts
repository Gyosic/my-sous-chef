import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

@Injectable()
export class SttService {
  private client: OpenAI;

  constructor(private configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.getOrThrow<string>("OPENAI_API_KEY"),
    });
  }

  async transcribe(audioBuffer: Buffer, mimeType = "audio/webm"): Promise<string> {
    const ext = mimeType.includes("webm") ? "webm" : "wav";
    const blob = new Blob([new Uint8Array(audioBuffer)], { type: mimeType });
    const file = new File([blob], `audio.${ext}`, { type: mimeType });

    const response = await this.client.audio.transcriptions.create({
      model: "whisper-1",
      file,
      language: "ko",
    });

    return response.text;
  }
}
