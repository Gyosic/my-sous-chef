import { Global, Module } from "@nestjs/common";
import { AiService } from "./ai.service";
import { ClaudeProvider } from "./providers/claude.provider";
import { OpenAiProvider } from "./providers/openai.provider";
import { SttService } from "./services/stt.service";
import { TtsService } from "./services/tts.service";

@Global()
@Module({
  providers: [AiService, ClaudeProvider, OpenAiProvider, SttService, TtsService],
  exports: [AiService, SttService, TtsService],
})
export class AiModule {}
