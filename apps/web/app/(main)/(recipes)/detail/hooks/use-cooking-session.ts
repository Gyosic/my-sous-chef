"use client";

import { useRef, useCallback, useMemo } from "react";
import { useCookingSocket, type ChatMessage } from "@/hooks/use-cooking-socket";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";

interface UseCookingSessionOptions {
  serverUrl?: string;
}

export function useCookingSession({
  serverUrl = "http://localhost:4000",
}: UseCookingSessionOptions = {}) {
  const isAiRespondingRef = useRef(false);

  const { isPlaying, enqueueAudio, stop: stopAudio } = useAudioPlayer();

  const enqueueAudioRef = useRef(enqueueAudio);
  enqueueAudioRef.current = enqueueAudio;

  const recorderRef = useRef<{ startListening: () => Promise<void> } | null>(
    null,
  );

  const callbacks = useMemo(
    () => ({
      onSessionStarted: () => {
        recorderRef.current?.startListening();
      },
      onAiAudioChunk: (audio: ArrayBuffer) => {
        enqueueAudioRef.current(audio);
      },
      onAiResponseEnd: () => {
        isAiRespondingRef.current = false;
      },
      onTranscription: () => {
        isAiRespondingRef.current = true;
      },
      onError: (message: string) => {
        console.error("Cooking socket error:", message);
      },
    }),
    [],
  );

  const socket = useCookingSocket({
    serverUrl,
    ...callbacks,
  });

  const recorder = useAudioRecorder({
    enabled: !isPlaying && !!socket.sessionId,
    onRecordingComplete: (chunks) => {
      const blob = new Blob(chunks, { type: "audio/webm;codecs=opus" });
      blob.arrayBuffer().then((buffer) => {
        socket.sendAudioChunk(buffer);
        socket.sendAudioEnd();
      });
    },
  });

  recorderRef.current = recorder;

  const startSession = useCallback(
    (
      recipeId: string,
      recipe: {
        name: string;
        description: string;
        steps: string[];
        ingredients: string[];
      },
    ) => {
      socket.startSession(recipeId, recipe);
      // recorder.startListening()은 onSessionStarted 콜백에서 호출됨
    },
    [socket],
  );

  const endSession = useCallback(() => {
    recorder.stopListening();
    stopAudio();
    socket.endSession();
  }, [recorder, stopAudio, socket]);

  const sendText = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      socket.sendTextMessage(text);
    },
    [socket],
  );

  return {
    // connection
    isConnected: socket.isConnected,
    sessionId: socket.sessionId,

    // messages
    messages: socket.messages,
    currentAiResponse: socket.currentAiResponse,

    // audio state
    isPlaying,
    isListening: recorder.isListening,
    isRecording: recorder.isRecording,
    volumeLevel: recorder.volumeLevel,
    recorderError: recorder.error,

    // actions
    startSession,
    endSession,
    sendText,
    toggleListening: useCallback(() => {
      if (recorder.isListening) {
        recorder.stopListening();
      } else {
        recorder.startListening();
      }
    }, [recorder]),
    disconnect: socket.disconnect,
  };
}

export type { ChatMessage };
