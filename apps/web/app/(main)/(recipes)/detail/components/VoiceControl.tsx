"use client";

import { Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@repo/ui/components/button";

interface VoiceControlProps {
  isListening: boolean;
  isRecording: boolean;
  isAiSpeaking: boolean;
  volumeLevel: number;
  error: string | null;
  onToggleListening: () => void;
}

export function VoiceControl({
  isListening,
  isRecording,
  isAiSpeaking,
  volumeLevel,
  error,
  onToggleListening,
}: VoiceControlProps) {
  // Normalize volume from dB (-100 to 0) to 0-1 scale
  const normalizedVolume = Math.max(0, Math.min(1, (volumeLevel + 60) / 60));

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {/* Pulse ring when recording */}
        {isRecording && (
          <div
            className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30"
            style={{ transform: `scale(${1 + normalizedVolume * 0.5})` }}
          />
        )}

        {/* AI speaking indicator */}
        {isAiSpeaking && (
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-pulse opacity-30" />
        )}

        <Button
          size="icon"
          variant={isListening ? (isRecording ? "destructive" : "default") : "outline"}
          className="relative z-10 size-16 rounded-full"
          onClick={onToggleListening}
        >
          {isAiSpeaking ? (
            <Volume2 className="size-7" />
          ) : isListening ? (
            <Mic className="size-7" />
          ) : (
            <MicOff className="size-7" />
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {error
          ? error
          : isAiSpeaking
            ? "AI가 답변 중이에요..."
            : isRecording
              ? "듣고 있어요..."
              : isListening
                ? "말씀해주세요"
                : "마이크를 눌러 시작하세요"}
      </p>
    </div>
  );
}
