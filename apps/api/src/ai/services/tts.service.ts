import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

@Injectable()
export class TtsService {
  private client: OpenAI;

  constructor(private configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.getOrThrow<string>("OPENAI_API_KEY"),
    });
  }

  async synthesize(text: string): Promise<Buffer> {
    const response = await this.client.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
      response_format: "opus",
    });

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
