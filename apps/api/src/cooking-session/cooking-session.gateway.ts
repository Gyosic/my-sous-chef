import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { CookingSessionService } from "./cooking-session.service";
import type {
  StartSessionPayload,
  EndSessionPayload,
  TextMessagePayload,
} from "./cooking-session.interface";

@WebSocketGateway({
  namespace: "/cooking",
  cors: { origin: "*" },
})
export class CookingSessionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(CookingSessionGateway.name);
  private clientSessions = new Map<string, string>(); // socketId -> sessionId
  private audioBuffers = new Map<string, Buffer[]>(); // socketId -> audio chunks

  constructor(private cookingSessionService: CookingSessionService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit("connection_ack", { message: "연결되었습니다" });
  }

  handleDisconnect(client: Socket) {
    const sessionId = this.clientSessions.get(client.id);
    if (sessionId) {
      this.cookingSessionService.endSession(sessionId);
      this.clientSessions.delete(client.id);
    }
    this.audioBuffers.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("start_session")
  handleStartSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: StartSessionPayload,
  ) {
    const session = this.cookingSessionService.createSession(payload);
    this.clientSessions.set(client.id, session.sessionId);

    client.emit("session_started", {
      sessionId: session.sessionId,
      recipe: session.recipe,
    });
  }

  @SubscribeMessage("audio_chunk")
  handleAudioChunk(
    @ConnectedSocket() client: Socket,
    @MessageBody() chunk: ArrayBuffer,
  ) {
    if (!this.audioBuffers.has(client.id)) {
      this.audioBuffers.set(client.id, []);
    }
    this.audioBuffers.get(client.id)!.push(Buffer.from(chunk));
  }

  @SubscribeMessage("audio_end")
  async handleAudioEnd(@ConnectedSocket() client: Socket) {
    const sessionId = this.clientSessions.get(client.id);
    if (!sessionId) {
      client.emit("error", { message: "활성 세션이 없습니다" });
      return;
    }

    const chunks = this.audioBuffers.get(client.id) ?? [];
    this.audioBuffers.set(client.id, []);

    if (chunks.length === 0) return;

    const audioBuffer = Buffer.concat(chunks);

    try {
      // STT
      const transcription =
        await this.cookingSessionService.transcribeAudio(audioBuffer);
      client.emit("transcription", { text: transcription });

      if (!transcription.trim()) return;

      // AI + TTS streaming
      await this.streamResponse(client, sessionId, transcription);
    } catch (err) {
      this.logger.error(`Audio processing error: ${err}`);
      client.emit("error", { message: "음성 처리 중 오류가 발생했습니다" });
    }
  }

  @SubscribeMessage("text_message")
  async handleTextMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: TextMessagePayload,
  ) {
    const sessionId = this.clientSessions.get(client.id);
    if (!sessionId) {
      client.emit("error", { message: "활성 세션이 없습니다" });
      return;
    }

    client.emit("transcription", { text: payload.message });
    await this.streamResponse(client, sessionId, payload.message);
  }

  @SubscribeMessage("end_session")
  handleEndSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: EndSessionPayload,
  ) {
    const sessionId = payload.sessionId || this.clientSessions.get(client.id);
    if (sessionId) {
      this.cookingSessionService.endSession(sessionId);
      this.clientSessions.delete(client.id);
    }
    client.emit("session_ended", { message: "세션이 종료되었습니다" });
  }

  private async streamResponse(
    client: Socket,
    sessionId: string,
    userMessage: string,
  ): Promise<void> {
    try {
      const stream = this.cookingSessionService.processMessage(
        sessionId,
        userMessage,
      );

      for await (const chunk of stream) {
        if (chunk.type === "text") {
          client.emit("ai_response_chunk", { text: chunk.data });
        } else if (chunk.type === "audio") {
          client.emit("ai_audio_chunk", { audio: chunk.data });
        }
      }

      client.emit("ai_response_end", {});
    } catch (err) {
      this.logger.error(`Stream response error: ${err}`);
      client.emit("error", { message: "AI 응답 처리 중 오류가 발생했습니다" });
    }
  }
}
