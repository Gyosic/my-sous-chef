# My Sous Chef

AI 기반 요리 어시스턴트 웹 애플리케이션입니다. 보유한 재료를 입력하면 AI가 레시피를 추천해주고, 요리 중에는 음성/텍스트로 실시간 AI 요리 가이드를 받을 수 있습니다.

## 주요 기능

- **AI 레시피 추천** - 재료를 입력하면 Claude 또는 GPT가 맞춤 레시피 3개를 추천
- **실시간 요리 가이드** - WebSocket 기반 AI 요리 어시스턴트가 단계별로 안내
- **음성 인터랙션** - 요리 중 핸즈프리 음성 입력(Whisper STT) 및 음성 출력(OpenAI TTS)
- **레시피 관리** - 추천받은 레시피 저장 및 직접 레시피 등록
- **재료 관리** - 보유 재료 및 유통기한 관리
- **소셜 로그인** - Google, Naver OAuth 지원

## 기술 스택

| 영역     | 기술                                                           |
| -------- | -------------------------------------------------------------- |
| Frontend | Next.js 16, React 19, Tailwind CSS v4, Zustand, TanStack Query |
| Backend  | NestJS 11, Socket.IO, Drizzle ORM                              |
| Database | PostgreSQL                                                     |
| AI       | Anthropic Claude, OpenAI GPT-4.1, Whisper, TTS                 |
| Auth     | NextAuth v5 (Google, Naver OAuth)                              |
| Infra    | Turborepo, pnpm, Docker                                        |

## 프로젝트 구조

```
my-sous-chef/
├── apps/
│   ├── api/           # NestJS 백엔드 API (port 4000)
│   └── web/           # Next.js 프론트엔드 (port 3000)
├── packages/
│   ├── db/            # 공유 DB 스키마 및 타입 (Drizzle ORM)
│   ├── ui/            # 공유 UI 컴포넌트 (shadcn/ui)
│   ├── eslint-config/ # 공유 ESLint 설정
│   └── typescript-config/ # 공유 TypeScript 설정
```

## 시작하기

### 사전 요구사항

- Node.js 20+
- pnpm 10+
- PostgreSQL

### 환경 변수 설정

**apps/web/.env**

```env
API_BASEURL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000
AUTH_URL=http://localhost:3000
AUTH_SECRET=your-auth-secret
AUTH_DRIZZLE_URL=postgresql://user:password@localhost:5432/chef
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
AUTH_NAVER_ID=your-naver-client-id
AUTH_NAVER_SECRET=your-naver-client-secret
DATABASE_URL=postgresql://user:password@localhost:5432/chef
```

**apps/api/.env**

```env
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/chef
AUTH_SECRET=your-auth-secret
ANTHROPIC_API_KEY=your-anthropic-api-key
OPENAI_API_KEY=your-openai-api-key
CORS_ORIGIN=http://localhost:3000
```

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 데이터베이스 마이그레이션
pnpm --filter @repo/db db:migrate

# 전체 개발 서버 실행
pnpm dev
```

### 개별 실행

```bash
# 프론트엔드만
turbo dev --filter=web

# 백엔드만
turbo dev --filter=api

# DB Studio (시각적 데이터 관리)
pnpm --filter @repo/db db:studio
```

### 빌드

```bash
# 전체 빌드
npm run build:script

# Docker 빌드 (프론트엔드)
docker build -t my-sous-chef-web .
```

## API 엔드포인트

### REST API

| Method | Endpoint                                    | 설명               |
| ------ | ------------------------------------------- | ------------------ |
| GET    | `/api/recommends?ingredients=...&model=...` | AI 레시피 추천     |
| POST   | `/api/recipes`                              | 레시피 저장        |
| GET    | `/api/recipes`                              | 저장된 레시피 목록 |

### WebSocket (`/cooking` namespace)

| Event                       | 방향             | 설명               |
| --------------------------- | ---------------- | ------------------ |
| `start_session`             | Client -> Server | 요리 세션 시작     |
| `text_message`              | Client -> Server | 텍스트 메시지 전송 |
| `audio_chunk` / `audio_end` | Client -> Server | 음성 입력          |
| `ai_response_chunk`         | Server -> Client | AI 응답 스트리밍   |
| `ai_audio_chunk`            | Server -> Client | TTS 음성 출력      |
| `end_session`               | Client -> Server | 세션 종료          |
