"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface UseAudioRecorderOptions {
  onAudioChunk?: (chunk: ArrayBuffer) => void;
  onRecordingComplete?: (chunks: ArrayBuffer[]) => void;
  vadThreshold?: number;
  silenceTimeout?: number;
  enabled?: boolean;
}

interface UseAudioRecorderReturn {
  isRecording: boolean;
  isListening: boolean;
  volumeLevel: number;
  startListening: () => Promise<void>;
  stopListening: () => void;
  error: string | null;
}

export function useAudioRecorder({
  onAudioChunk,
  onRecordingComplete,
  vadThreshold = -30,
  silenceTimeout = 1500,
  enabled = true,
}: UseAudioRecorderOptions = {}): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<ArrayBuffer[]>([]);
  const isRecordingRef = useRef(false);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    isRecordingRef.current = false;
    setIsRecording(false);
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current || isRecordingRef.current) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: "audio/webm;codecs=opus",
    });

    mediaRecorder.ondataavailable = async (e) => {
      if (e.data.size > 0) {
        const buffer = await e.data.arrayBuffer();
        chunksRef.current.push(buffer);
        onAudioChunk?.(buffer);
      }
    };

    mediaRecorder.onstop = () => {
      if (chunksRef.current.length > 0) {
        onRecordingComplete?.(chunksRef.current);
      }
    };

    mediaRecorder.start(250); // 250ms chunks
    mediaRecorderRef.current = mediaRecorder;
    isRecordingRef.current = true;
    setIsRecording(true);
  }, [onAudioChunk, onRecordingComplete]);

  const monitorVolume = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const dataArray = new Float32Array(analyser.fftSize);

    const check = () => {
      analyser.getFloatTimeDomainData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i]! * dataArray[i]!;
      }
      const rms = Math.sqrt(sum / dataArray.length);
      const db = 20 * Math.log10(Math.max(rms, 1e-10));

      setVolumeLevel(db);

      if (enabledRef.current && db > vadThreshold) {
        // Voice detected
        if (!isRecordingRef.current) {
          startRecording();
        }
        // Reset silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      } else if (isRecordingRef.current && !silenceTimerRef.current) {
        // Start silence countdown
        silenceTimerRef.current = setTimeout(() => {
          stopRecording();
          silenceTimerRef.current = null;
        }, silenceTimeout);
      }

      animFrameRef.current = requestAnimationFrame(check);
    };

    check();
  }, [vadThreshold, silenceTimeout, startRecording, stopRecording]);

  const startListening = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      setIsListening(true);
      monitorVolume();
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "마이크 권한이 필요합니다. 브라우저 설정에서 허용해주세요."
          : "마이크를 사용할 수 없습니다.";
      setError(message);
    }
  }, [monitorVolume]);

  const stopListening = useCallback(() => {
    stopRecording();

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    analyserRef.current = null;
    setIsListening(false);
    setVolumeLevel(0);
  }, [stopRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isRecording,
    isListening,
    volumeLevel,
    startListening,
    stopListening,
    error,
  };
}
