"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { io, Socket } from "socket.io-client";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RecipeData {
  name: string;
  description: string;
  steps: string[];
  ingredients: string[];
}

interface UseCookingSocketOptions {
  serverUrl: string;
  onTranscription?: (text: string) => void;
  onAiChunk?: (text: string) => void;
  onAiResponseEnd?: () => void;
  onAiAudioChunk?: (audio: ArrayBuffer) => void;
  onError?: (message: string) => void;
}

interface UseCookingSocketReturn {
  isConnected: boolean;
  sessionId: string | null;
  recipe: RecipeData | null;
  messages: ChatMessage[];
  currentAiResponse: string;
  startSession: (recipeId: string, recipe: RecipeData, model?: string) => void;
  sendAudioChunk: (chunk: ArrayBuffer) => void;
  sendAudioEnd: () => void;
  sendTextMessage: (message: string) => void;
  endSession: () => void;
  disconnect: () => void;
}

export function useCookingSocket({
  serverUrl,
  onTranscription,
  onAiChunk,
  onAiResponseEnd,
  onAiAudioChunk,
  onError,
}: UseCookingSocketOptions): UseCookingSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentAiResponse, setCurrentAiResponse] = useState("");

  const socketRef = useRef<Socket | null>(null);
  const currentAiResponseRef = useRef("");

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const socket = io(`${serverUrl}/cooking`, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connection_ack", () => {
      // Connected successfully
    });

    socket.on("session_started", (data: { sessionId: string; recipe: RecipeData }) => {
      setSessionId(data.sessionId);
      setRecipe(data.recipe);
    });

    socket.on("transcription", (data: { text: string }) => {
      setMessages((prev) => [...prev, { role: "user", content: data.text }]);
      onTranscription?.(data.text);
      // Reset AI response buffer
      currentAiResponseRef.current = "";
      setCurrentAiResponse("");
    });

    socket.on("ai_response_chunk", (data: { text: string }) => {
      currentAiResponseRef.current += data.text;
      setCurrentAiResponse(currentAiResponseRef.current);
      onAiChunk?.(data.text);
    });

    socket.on("ai_audio_chunk", (data: { audio: ArrayBuffer }) => {
      onAiAudioChunk?.(data.audio);
    });

    socket.on("ai_response_end", () => {
      const fullResponse = currentAiResponseRef.current;
      if (fullResponse) {
        setMessages((prev) => [...prev, { role: "assistant", content: fullResponse }]);
      }
      currentAiResponseRef.current = "";
      setCurrentAiResponse("");
      onAiResponseEnd?.();
    });

    socket.on("session_ended", () => {
      setSessionId(null);
      setRecipe(null);
    });

    socket.on("error", (data: { message: string }) => {
      onError?.(data.message);
    });

    socketRef.current = socket;
  }, [serverUrl, onTranscription, onAiChunk, onAiResponseEnd, onAiAudioChunk, onError]);

  const startSession = useCallback(
    (recipeId: string, recipeData: RecipeData, model?: string) => {
      socketRef.current?.emit("start_session", {
        recipeId,
        recipe: recipeData,
        model,
      });
    },
    [],
  );

  const sendAudioChunk = useCallback((chunk: ArrayBuffer) => {
    socketRef.current?.emit("audio_chunk", chunk);
  }, []);

  const sendAudioEnd = useCallback(() => {
    socketRef.current?.emit("audio_end");
  }, []);

  const sendTextMessage = useCallback((message: string) => {
    socketRef.current?.emit("text_message", { message });
  }, []);

  const endSession = useCallback(() => {
    if (sessionId) {
      socketRef.current?.emit("end_session", { sessionId });
    }
    setSessionId(null);
    setRecipe(null);
    setMessages([]);
  }, [sessionId]);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setIsConnected(false);
    setSessionId(null);
    setRecipe(null);
    setMessages([]);
  }, []);

  useEffect(() => {
    connect();
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [connect]);

  return {
    isConnected,
    sessionId,
    recipe,
    messages,
    currentAiResponse,
    startSession,
    sendAudioChunk,
    sendAudioEnd,
    sendTextMessage,
    endSession,
    disconnect,
  };
}
