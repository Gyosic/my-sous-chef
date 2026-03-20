"use client";

import { useState, useCallback, useRef } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { useRouter } from "next/navigation";
import { useCookingSocket } from "@/hooks/useCookingSocket";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { VoiceControl } from "@/components/cooking/VoiceControl";
import { CookingChat } from "@/components/cooking/CookingChat";
import { RecipeStepTracker } from "@/components/cooking/RecipeStepTracker";

interface CookingSessionProps {
  recipeId: string;
}

export function CookingSession({ recipeId }: CookingSessionProps) {
  const router = useRouter();
  const [textInput, setTextInput] = useState("");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const isAiRespondingRef = useRef(false);

  const { isPlaying, enqueueAudio, stop: stopAudio } = useAudioPlayer();

  const socket = useCookingSocket({
    serverUrl: process.env.NEXT_PUBLIC_WS_URL || "http://localhost:4000",
    onAiAudioChunk: (audio) => {
      enqueueAudio(audio);
    },
    onAiResponseEnd: () => {
      isAiRespondingRef.current = false;
    },
    onTranscription: () => {
      isAiRespondingRef.current = true;
    },
    onError: (message) => {
      console.error("Socket error:", message);
    },
  });

  const recorder = useAudioRecorder({
    enabled: !isPlaying && isSessionActive,
    onAudioChunk: (chunk) => {
      socket.sendAudioChunk(chunk);
    },
    onRecordingComplete: () => {
      socket.sendAudioEnd();
    },
  });

  const handleStartSession = useCallback(() => {
    // Recipe data is passed via search params or stored in session storage
    const storedRecipe = sessionStorage.getItem(`recipe-${recipeId}`);
    if (!storedRecipe) {
      alert(
        "레시피 정보를 찾을 수 없습니다. 홈으로 돌아가서 다시 시도해주세요.",
      );
      return;
    }

    const recipe = JSON.parse(storedRecipe);
    socket.startSession(recipeId, recipe);
    setIsSessionActive(true);
    recorder.startListening();
  }, [recipeId, socket, recorder]);

  const handleEndSession = useCallback(() => {
    recorder.stopListening();
    stopAudio();
    socket.endSession();
    setIsSessionActive(false);
    router.push("/");
  }, [recorder, stopAudio, socket, router]);

  const handleSendText = useCallback(() => {
    const trimmed = textInput.trim();
    if (!trimmed) return;
    socket.sendTextMessage(trimmed);
    setTextInput("");
  }, [textInput, socket]);

  const handleToggleListening = useCallback(() => {
    if (recorder.isListening) {
      recorder.stopListening();
    } else {
      recorder.startListening();
    }
  }, [recorder]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-3">
        <Button variant="ghost" size="icon-sm" onClick={handleEndSession}>
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-sm font-semibold text-foreground">
            {socket.recipe?.name || "요리 도우미"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {socket.isConnected ? "연결됨" : "연결 중..."}
          </p>
        </div>
        {isSessionActive && (
          <Button variant="outline" size="sm" onClick={handleEndSession}>
            종료
          </Button>
        )}
      </div>

      {/* Recipe Step Tracker */}
      {socket.recipe && (
        <div className="px-4 pt-3">
          <RecipeStepTracker
            recipeName={socket.recipe.name}
            steps={socket.recipe.steps}
          />
        </div>
      )}

      {/* Chat Area */}
      {isSessionActive ? (
        <CookingChat
          messages={socket.messages}
          currentAiResponse={socket.currentAiResponse}
        />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
          <p className="text-center text-sm text-muted-foreground">
            요리를 시작하면 AI가 음성으로 안내해드려요.
            <br />
            궁금한 점은 언제든 물어보세요!
          </p>
          <Button
            size="lg"
            className="h-[50px] w-full max-w-xs gap-2 rounded-xl text-[15px] font-semibold"
            onClick={handleStartSession}
            disabled={!socket.isConnected}
          >
            요리 시작하기
          </Button>
        </div>
      )}

      {/* Bottom Controls */}
      {isSessionActive && (
        <div className="border-t border-neutral-100 px-4 py-3">
          {/* Voice Control */}
          <div className="mb-3">
            <VoiceControl
              isListening={recorder.isListening}
              isRecording={recorder.isRecording}
              isAiSpeaking={isPlaying}
              volumeLevel={recorder.volumeLevel}
              error={recorder.error}
              onToggleListening={handleToggleListening}
            />
          </div>

          {/* Text Input Fallback */}
          <div className="flex gap-2">
            <Input
              placeholder="텍스트로 질문하기..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendText();
                }
              }}
              className="h-10 rounded-full"
            />
            <Button
              size="icon"
              className="size-10 shrink-0 rounded-full"
              onClick={handleSendText}
              disabled={!textInput.trim()}
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
