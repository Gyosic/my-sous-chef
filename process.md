# 실시간 음성 요리 도우미 구현 과정

## Phase 1: Backend 인프라

### 1단계: 패키지 설치

- `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io` 설치

> **Why:** NestJS에서 WebSocket을 사용하려면 공식 `@nestjs/websockets` 모듈이 필요하다. 어댑터로 Socket.IO를 선택한 이유는 네임스페이스, 룸, 자동 재연결, 바이너리 전송 등 실시간 음성 스트리밍에 필요한 기능을 기본 제공하기 때문이다. 네이티브 `ws` 대비 클라이언트 SDK(`socket.io-client`)도 함께 제공되어 프론트엔드 연동이 간편하다.

### 2단계: AI 인터페이스 확장

- `apps/api/src/ai/ai.interface.ts`
  - `ConversationMessage` 타입 추가 (`role: "user" | "assistant"`, `content: string`)
  - `AiProvider` 인터페이스에 `streamCookingGuidance` 메서드 추가 (AsyncGenerator 반환)

> **Why:** 기존 `AiProvider`는 일회성 요청-응답(`generateRecipe`)만 지원했다. 요리 도우미는 대화 맥락을 유지하며 실시간으로 텍스트를 흘려보내야 하므로 `AsyncGenerator`를 반환하는 스트리밍 메서드가 필요하다. `ConversationMessage` 타입을 별도로 정의하여 OpenAI/Claude 양쪽 Provider가 동일한 대화 기록 구조를 사용하도록 통일했다.

### 3단계: AI Provider 스트리밍 구현

- `apps/api/src/ai/providers/openai.provider.ts`
  - `streamCookingGuidance` 구현: `gpt-4.1-mini` 모델, `stream: true` 옵션으로 청크 단위 텍스트 yield
- `apps/api/src/ai/providers/claude.provider.ts`
  - `streamCookingGuidance` 구현: `claude-haiku-4-5` 모델, `messages.stream()` API로 `text_delta` 이벤트 yield

> **Why:** 음성 도우미는 응답 지연이 UX에 직접 영향을 준다. 전체 응답을 기다리지 않고 토큰 단위로 yield하면, 문장이 완성되는 즉시 TTS로 보낼 수 있어 첫 음성 출력까지의 지연(TTFB)을 최소화할 수 있다. 두 Provider 모두 구현한 이유는 기존 Strategy 패턴을 유지하여 사용자가 모델을 선택할 수 있도록 하기 위함이다.

### 4단계: AiService 확장

- `apps/api/src/ai/ai.service.ts`
  - `streamCookingGuidance` 메서드 추가 (모델명으로 provider 선택 후 스트리밍 위임)
  - provider 조회 로직을 `getProvider` private 메서드로 리팩터링

> **Why:** `generateRecipe`와 `streamCookingGuidance` 모두 동일한 "모델명 → Provider 조회 → 위임" 패턴을 사용한다. 중복 코드를 `getProvider`로 추출하여 모델 검증 로직을 한 곳에서 관리한다.

### 5단계: STT Service 생성

- `apps/api/src/ai/services/stt.service.ts`
  - OpenAI Whisper API (`whisper-1`) 사용
  - `Buffer` → `Blob` → `File` 변환 후 `audio.transcriptions.create` 호출
  - 한국어(`ko`) 고정 설정

> **Why:** Whisper를 선택한 이유는 한국어 인식 정확도가 높고, 이미 프로젝트에서 OpenAI SDK를 사용 중이므로 추가 의존성 없이 바로 연동 가능하기 때문이다. 언어를 `ko`로 고정한 이유는 요리 도우미의 타겟 사용자가 한국어 화자이고, 언어를 명시하면 Whisper의 인식 정확도와 속도가 향상되기 때문이다. `Buffer` → `Blob` → `File` 변환은 Node.js의 `Buffer` 타입이 OpenAI SDK의 `File` 생성자에서 타입 호환 문제가 있어 `Uint8Array`로 한번 감싸는 방식으로 해결했다.

### 6단계: TTS Service 생성

- `apps/api/src/ai/services/tts.service.ts`
  - OpenAI TTS API (`tts-1`, voice: `nova`) 사용
  - 응답 포맷: `opus` (경량, 웹 호환)
  - `ArrayBuffer` → `Buffer` 변환 후 반환

> **Why:** OpenAI TTS를 선택한 이유는 한국어 발음 품질이 좋고, STT와 같은 API 키를 사용할 수 있어 인프라 관리가 단순하며, 비용이 저렴하기 때문이다. 모델은 `tts-1`(저지연)을 선택했는데, `tts-1-hd`보다 품질은 약간 낮지만 속도가 빨라 실시간 대화에 적합하다. 음성은 `nova`(여성, 자연스러운 톤)를 선택했고, 포맷은 `opus`(WebM 컨테이너 호환, 압축률 높아 전송 크기 최소화)를 사용했다.

### 7단계: AiModule 업데이트

- `apps/api/src/ai/ai.module.ts`
  - `SttService`, `TtsService` providers/exports에 등록

> **Why:** AiModule이 `@Global()` 모듈이므로 여기에 등록하면 별도 import 없이 어디서든 주입 가능하다. STT/TTS는 AI 관련 서비스이므로 ai 디렉터리 하위에 배치하는 것이 도메인 응집도 면에서 자연스럽다.

### 8단계: CookingSession 인터페이스 정의

- `apps/api/src/cooking-session/cooking-session.interface.ts`
  - `CookingSession`: sessionId, recipe, model, conversationHistory, createdAt
  - `RecipeData`: name, description, steps, ingredients
  - `StartSessionPayload`, `AudioChunkPayload`, `TextMessagePayload`, `EndSessionPayload`

> **Why:** 타입을 먼저 정의하면 Service와 Gateway 구현 시 컴파일 타임에 타입 안정성을 확보할 수 있다. `RecipeData`를 별도로 정의한 이유는 기존 `AiRecipeResponse.recipes[n]`의 구조를 세션 컨텍스트에서 재사용하되, 불필요한 배열 래핑 없이 단일 레시피를 다루기 위함이다. 각 Payload 타입은 WebSocket 이벤트별로 클라이언트가 보내는 데이터 구조를 명시적으로 문서화하는 역할을 한다.

### 9단계: CookingSession Service 생성

- `apps/api/src/cooking-session/cooking-session.service.ts`
  - 메모리 `Map` 기반 세션 관리 (영구 저장 불필요)
  - `createSession`: UUID 생성, 세션 저장, 2시간 타임아웃 설정
  - `transcribeAudio`: SttService 위임
  - `processMessage`: STT → AI 스트리밍 → 문장 단위 TTS 파이프라인
    - 문장 종결 부호(`.!?。`) 감지 시 즉시 TTS 요청 → 지연 최소화
    - 대화 기록 자동 저장
  - 시스템 프롬프트: 레시피 정보 포함, 3문장 이내 답변 지시

> **Why:** 메모리 `Map`을 선택한 이유는 요리 세션이 임시적이고(요리가 끝나면 소멸), DB에 저장할 필요가 없기 때문이다. Redis 같은 외부 스토어를 도입하면 인프라 복잡도만 올라간다. 문장 단위 TTS 분할은 전체 응답을 기다린 후 TTS를 요청하면 수 초의 지연이 발생하므로, 문장이 완성되는 즉시 TTS 요청을 보내 첫 음성 출력 시간을 단축하기 위함이다. 시스템 프롬프트에서 "3문장 이내"를 지시한 이유는 음성 응답이 길어지면 사용자가 요리 중에 집중하기 어렵고, 짧은 응답이 TTS 지연도 줄이기 때문이다.

### 10단계: CookingSession Gateway 생성

- `apps/api/src/cooking-session/cooking-session.gateway.ts`
  - Socket.IO 기반, namespace: `/cooking`, CORS 허용
  - 인증 없이 누구나 접근 가능 (비로그인 사용자 지원)
  - 이벤트 핸들러:
    - `handleConnection`: `connection_ack` emit
    - `handleDisconnect`: 세션 정리
    - `start_session`: 세션 생성, `session_started` emit
    - `audio_chunk`: 오디오 청크 버퍼링
    - `audio_end`: 버퍼 합산 → STT → AI+TTS 스트리밍
    - `text_message`: 텍스트 입력 → AI+TTS 스트리밍
    - `end_session`: 세션 종료

> **Why:** `/cooking` 네임스페이스를 분리한 이유는 향후 다른 실시간 기능(알림 등)을 추가할 때 이벤트 충돌을 방지하기 위함이다. `audio_chunk`/`audio_end` 분리 패턴은 MediaRecorder가 녹음 중 주기적으로 청크를 생성하므로, 청크를 실시간으로 전송하다가 녹음 종료 시 `audio_end`로 처리 시작을 알리는 구조가 자연스럽다. 인증 Guard를 적용하지 않은 이유는 레시피 추천 기능과 동일하게 비로그인 사용자도 요리 도우미를 이용할 수 있도록 하기 위함이다.

### 11단계: 모듈 등록

- `apps/api/src/cooking-session/cooking-session.module.ts` 생성
- `apps/api/src/app.module.ts`에 `CookingSessionModule` import 추가

> **Why:** NestJS의 모듈 시스템을 따르기 위한 필수 단계다. CookingSession을 독립 모듈로 분리하면 관련 Provider(Gateway, Service)가 한 모듈 안에 응집되어 관리가 쉽고, 필요시 모듈 단위로 비활성화하거나 테스트할 수 있다.

---

## Phase 2: Frontend

### 1단계: 패키지 설치

- `socket.io-client` 설치

> **Why:** 백엔드가 Socket.IO를 사용하므로 클라이언트도 `socket.io-client`를 사용해야 프로토콜이 호환된다. 네이티브 WebSocket으로는 Socket.IO 서버에 연결할 수 없다.

### 2단계: useAudioRecorder 훅 생성

- `apps/web/hooks/useAudioRecorder.ts`
  - `MediaRecorder` + `audio/webm;codecs=opus` 포맷
  - VAD (Voice Activity Detection):
    - `AnalyserNode`로 실시간 음량(dB) 모니터링
    - 임계값(`-45dB`) 초과 시 자동 녹음 시작
    - 무음 `1.5초` 지속 시 녹음 종료 + `onRecordingComplete` 콜백
  - `enabled` 옵션으로 AI 응답 재생 중 VAD 비활성화 (자기 음성 오인식 방지)
  - 마이크 권한 거부 시 에러 메시지 설정

> **Why:** VAD(음성 활동 감지)를 선택한 이유는 사용자가 요리 중에 손이 젖거나 지저분한 상태에서 버튼을 누르기 어렵기 때문이다. 음성이 감지되면 자동 녹음, 무음 시 자동 전송하여 핸즈프리 경험을 제공한다. `audio/webm;codecs=opus` 포맷은 Whisper API가 직접 수용 가능하여 서버에서 별도 변환이 불필요하고, 압축률이 높아 전송 크기가 작다. `enabled` 플래그로 AI 재생 중 VAD를 끄는 이유는 스피커 출력이 마이크에 잡혀 무한 루프(AI 응답 → 마이크 감지 → 재질문)가 발생하는 것을 방지하기 위함이다.

### 3단계: useAudioPlayer 훅 생성

- `apps/web/hooks/useAudioPlayer.ts`
  - `AudioContext` 기반 큐 재생 시스템
  - `enqueueAudio`: 오디오 청크를 큐에 추가, 순차 재생
  - `stop`: 큐 비우기 + 현재 재생 중단
  - `decodeAudioData`로 다양한 포맷 지원

> **Why:** `<audio>` 태그 대신 Web Audio API를 사용한 이유는 서버에서 오디오가 여러 청크로 분할 전송되기 때문이다. `<audio>` 태그는 단일 파일 재생에 적합하지만, 청크 단위 순차 재생에는 `AudioContext`의 `decodeAudioData` + `BufferSource` 패턴이 필요하다. 큐 시스템으로 청크 간 끊김 없이 이어서 재생한다.

### 4단계: useCookingSocket 훅 생성

- `apps/web/hooks/useCookingSocket.ts`
  - Socket.IO 연결 관리 (인증 불필요, WebSocket transport)
  - 상태: `isConnected`, `sessionId`, `recipe`, `messages`, `currentAiResponse`
  - 이벤트 처리:
    - `transcription` → 사용자 메시지 추가
    - `ai_response_chunk` → 실시간 AI 응답 텍스트 누적
    - `ai_audio_chunk` → 오디오 콜백 전달
    - `ai_response_end` → 완성된 응답을 메시지 목록에 추가
  - 메서드: `startSession`, `sendAudioChunk`, `sendAudioEnd`, `sendTextMessage`, `endSession`

> **Why:** 소켓 연결, 이벤트, 상태를 하나의 훅으로 캡슐화하면 컴포넌트가 소켓 프로토콜 세부사항을 알 필요 없이 `startSession()`, `sendTextMessage()` 같은 고수준 API만 사용할 수 있다. `currentAiResponse`를 별도 상태로 분리한 이유는 스트리밍 중인 불완전한 응답과 완성된 메시지를 구분하여 UI에서 타이핑 커서를 표시하기 위함이다. `transports: ["websocket"]`을 명시한 이유는 기본 long-polling 폴백을 건너뛰어 초기 연결 속도를 높이기 위함이다.

### 5단계: UI 컴포넌트 생성

- `apps/web/components/cooking/VoiceControl.tsx`
  - 마이크 버튼 (상태별 아이콘: MicOff → Mic → Volume2)
  - 녹음 중 pulse 애니메이션 (음량 반영)
  - AI 답변 중 pulse 애니메이션
  - 상태 텍스트 표시

> **Why:** 음성 UI는 시각적 피드백이 핵심이다. 사용자가 "마이크가 내 말을 듣고 있는지", "AI가 응답 중인지"를 즉시 파악해야 한다. 음량에 비례하는 pulse 크기는 마이크가 제대로 음성을 수신하고 있음을 직관적으로 보여준다. 상태별 아이콘 변경(MicOff/Mic/Volume2)으로 현재 모드를 한눈에 구분할 수 있게 했다.

- `apps/web/components/cooking/CookingChat.tsx`
  - 채팅 버블 UI (사용자: 검정, AI: 회색)
  - 스트리밍 AI 응답에 타이핑 커서 표시
  - 자동 스크롤

> **Why:** 음성만으로는 이전 대화를 되짚기 어려우므로 텍스트 기록이 보조 역할을 한다. 스트리밍 응답에 타이핑 커서를 표시하면 AI가 아직 응답을 생성 중임을 알 수 있어 사용자가 중간에 끊어 말하는 것을 방지한다. 자동 스크롤은 새 메시지가 항상 보이도록 한다.

- `apps/web/components/cooking/RecipeStepTracker.tsx`
  - 접기/펼치기 가능한 레시피 단계 목록
  - 각 단계 체크박스 토글 (완료 표시)
  - 진행률 표시 (`N/M 단계 완료`)

> **Why:** 요리 중 "지금 몇 단계인지"를 시각적으로 확인할 수 있어야 한다. 체크박스로 완료 표시하면 현재 위치를 추적할 수 있고, 접기 기능으로 채팅 영역을 넓게 사용할 수 있다. AI가 "다음 단계로 넘어가세요"라고 안내할 때 사용자가 직접 확인하고 체크하는 상호작용을 제공한다.

- `apps/web/components/cooking/StartCookingButton.tsx`
  - `/cooking/[recipeId]`로 이동하는 링크 버튼

> **Why:** 레시피 추천 결과 화면에서 요리 세션으로의 진입점이 필요하다. `Link` 컴포넌트를 사용하여 Next.js의 클라이언트 사이드 네비게이션을 활용한다.

### 6단계: 요리 세션 페이지 생성

- `apps/web/app/(main)/cooking/[recipeId]/page.tsx`
  - 서버 컴포넌트: `recipeId`를 클라이언트 컴포넌트에 전달
  - 인증 불필요 (비로그인 사용자도 접근 가능)

> **Why:** 레시피 추천과 마찬가지로 요리 도우미도 비로그인 사용자에게 열어두어 접근성을 높였다. 인증 없이도 WebSocket 연결과 AI 응답이 가능하므로 별도 토큰 전달이 필요하지 않다.

- `apps/web/app/(main)/cooking/[recipeId]/CookingSession.tsx`
  - 3개 훅 통합: `useCookingSocket` + `useAudioRecorder` + `useAudioPlayer`
  - AI 재생 중 VAD 자동 비활성화 (`enabled: !isPlaying`)
  - 레시피 데이터는 `sessionStorage`에서 로드
  - 텍스트 입력 폴백 (음성 불가 환경 대응)
  - 헤더: 뒤로가기 + 연결 상태 + 종료 버튼

> **Why:** 세 훅을 하나의 컴포넌트에서 조합하여 소켓-녹음-재생 간의 상호작용을 관리한다. `sessionStorage`를 사용한 이유는 레시피 데이터가 이전 페이지(추천 결과)에서 생성되므로 URL 파라미터로 전달하기엔 크기가 크고, DB 조회 없이 빠르게 접근할 수 있기 때문이다. 텍스트 입력 폴백은 소음이 심한 환경이나 마이크 권한 거부 시에도 기능을 사용할 수 있게 하기 위함이다.

---

## Phase 3: 최적화 (미구현)

### 1단계: WebSocket 재연결 로직

- **대상 파일**: `apps/web/hooks/useCookingSocket.ts`
- **구현 내용**:
  - Socket.IO `reconnection` 옵션 활성화 (`reconnectionAttempts: 5`, `reconnectionDelay: 1000`)
  - `reconnect` 이벤트에서 활성 세션이 있으면 자동 재입장 (`start_session` 재전송)
  - `reconnect_failed` 이벤트에서 사용자에게 재연결 실패 알림 + 수동 재연결 버튼 제공
  - 재연결 시도 중 UI 상태 표시 ("재연결 중...")

> **Why:** 요리 중에는 세션이 수십 분 이상 유지된다. 이 동안 Wi-Fi 불안정, 모바일 네트워크 전환 등으로 연결이 끊길 가능성이 높다. 자동 재연결 없이는 사용자가 페이지를 새로고침해야 하고, 이때 대화 기록과 세션이 모두 초기화된다. 재연결 시 세션 자동 재입장으로 끊김 없는 경험을 제공한다. 5회 제한을 둔 이유는 무한 재시도가 서버에 부담을 주고 사용자에게 거짓 희망을 줄 수 있기 때문이다.

### 2단계: AI 응답 중단 기능

- **대상 파일**:
  - `apps/api/src/cooking-session/cooking-session.gateway.ts` — `stop_response` 이벤트 핸들러 추가
  - `apps/api/src/cooking-session/cooking-session.service.ts` — `AbortController` 기반 스트리밍 취소
  - `apps/web/hooks/useCookingSocket.ts` — `stopResponse` 메서드 추가
  - `apps/web/app/(main)/cooking/[recipeId]/CookingSession.tsx` — 중단 버튼 UI
- **구현 내용**:
  - 세션별 `AbortController` 관리
  - 클라이언트에서 `stop_response` emit → 서버에서 현재 AI 스트리밍 + TTS abort
  - 클라이언트에서 오디오 재생 큐 즉시 비우기 (`useAudioPlayer.stop()`)
  - VoiceControl에 "중단" 제스처 또는 버튼 추가

> **Why:** AI가 긴 응답을 생성하는 동안 사용자가 새 질문을 하고 싶거나, 이미 충분한 정보를 얻었을 때 중단할 수 있어야 한다. 중단 없이는 AI 응답이 끝날 때까지 VAD가 비활성화되어 대기해야 한다. 서버 측에서도 `AbortController`로 스트리밍을 취소해야 불필요한 AI API 호출 비용과 TTS 비용을 절약할 수 있다.

### 3단계: 마이크 권한 거부 상세 처리

- **대상 파일**:
  - `apps/web/hooks/useAudioRecorder.ts` — 에러 타입 세분화
  - `apps/web/components/cooking/VoiceControl.tsx` — 권한 거부 시 안내 UI
- **구현 내용**:
  - `NotAllowedError`: 브라우저 설정 안내 메시지 + 텍스트 입력 모드로 자동 전환
  - `NotFoundError`: 마이크 장치 없음 안내
  - `NotReadableError`: 다른 앱이 마이크 사용 중 안내
  - 권한 상태 변경 감지 (`navigator.permissions.query`)로 실시간 반영

> **Why:** 현재 구현은 모든 마이크 에러를 동일하게 처리한다. 하지만 사용자가 "왜 안 되는지"를 알아야 해결할 수 있다. 권한 거부는 브라우저 설정 안내, 장치 없음은 외장 마이크 연결 안내 등 에러 원인별로 맞춤 가이드를 제공하면 이탈률을 줄일 수 있다. `navigator.permissions.query`로 권한 상태를 실시간 감지하면 사용자가 브라우저 설정에서 권한을 허용한 후 별도 새로고침 없이 자동으로 마이크를 활성화할 수 있다.

### 4단계: 세션 타임아웃 사용자 알림

- **대상 파일**:
  - `apps/api/src/cooking-session/cooking-session.gateway.ts` — 타임아웃 전 알림 emit
  - `apps/web/hooks/useCookingSocket.ts` — `session_warning` 이벤트 처리
  - `apps/web/app/(main)/cooking/[recipeId]/CookingSession.tsx` — 경고 토스트
- **구현 내용**:
  - 타임아웃 10분 전 `session_warning` 이벤트 emit
  - 클라이언트에서 토스트 알림 ("세션이 10분 후 만료됩니다")
  - 사용자가 음성/텍스트 입력 시 타임아웃 자동 리셋 (이미 구현됨)

> **Why:** 현재 2시간 타임아웃은 서버에서 묵시적으로 세션을 삭제한다. 사용자 입장에서는 갑자기 세션이 끊기는 것처럼 보여 혼란스럽다. 사전 알림으로 사용자가 상호작용(타임아웃 리셋)하거나 대화를 정리할 시간을 준다.

### 5단계: TTS 지연 최소화 추가 최적화

- **대상 파일**: `apps/api/src/cooking-session/cooking-session.service.ts`
- **구현 내용**:
  - 현재: 문장 완성 후 TTS 요청 (직렬)
  - 개선: 문장 감지 즉시 TTS 요청을 Promise로 병렬 실행, 오디오 청크 순서 보장
  - 한국어 문장 종결 패턴 개선: `~요`, `~다`, `~세요` 등 어미 기반 분할 추가

> **Why:** 현재 구현은 문장 감지 → TTS 요청 → 응답 대기 → 다음 문장 처리가 직렬로 실행된다. 만약 AI가 2번째 문장을 생성하는 동안 1번째 문장의 TTS가 아직 진행 중이면 불필요한 대기가 발생한다. TTS 요청을 병렬로 보내되 재생 순서만 보장하면 전체 지연을 줄일 수 있다. 한국어 어미 기반 분할은 영어와 달리 한국어는 마침표 없이 `~요`, `~다`로 문장이 끝나는 경우가 많아, 현재 `.!?` 기반 분할로는 문장이 너무 길어질 수 있기 때문이다.
