# WDWD (What Do You Want To Drink)

“뭐 마실래?” - 링크 하나로 음료 주문을 빠르게 모으는 서비스입니다.
카페, 편의점, 슈퍼 등 어디를 가든 사람들의 음료 주문을 간편하게 취합하고 확인할 수 있습니다.

## 기술 스택
- **프레임워크:** Next.js 15 (App Router)
- **언어:** TypeScript
- **스타일링:** Tailwind CSS v4
- **아이콘:** lucide-react
- **백엔드/DB:** Supabase (PostgreSQL)

## 기능 가이드
1. **방 만들기:** 메인 화면에서 누구나 로그인 없이 주문방을 생성할 수 있습니다.
2. **주문 공유:** 생성된 방 링크를 사람들에게 카카오톡 등으로 공유하세요.
3. **주문 입력:** 링크를 받은 사람은 이름과 원하는 메뉴를 입력하고 제출합니다.
4. **관리자 화면:** 방을 만든 사람은 발급된 관리자 링크로 들어가 전체 주문을 요약해서 보고, "텍스트 전체 복사"를 통해 쉽게 공유/주문할 수 있습니다.

## 설정 및 로컬 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. Supabase 설정
1. [Supabase](https://supabase.com/)에서 새 프로젝트를 생성합니다.
2. `supabase/schema.sql`의 내용을 SQL Editor에 붙여넣고 실행하여 테이블을 생성합니다.
3. 프로젝트의 API 설정에서 URL과 Key를 확인합니다.

### 3. 환경 변수 설정
`.env.example` 파일을 복사하여 `.env.local`을 만들고 발급받은 값을 입력합니다.
```bash
cp .env.example .env.local
```

### 4. 개발 서버 실행
```bash
npm run dev
```
접속: [http://localhost:3000](http://localhost:3000)

## 배포 방법
본 프로젝트는 **Vercel** 배포에 최적화되어 있습니다.
1. GitHub 등에 코드를 푸시합니다.
2. Vercel에서 새 프로젝트를 생성하고 저장소를 연결합니다.
3. Environment Variables(환경 변수)에 `.env.local`에 적은 값들을 동일하게 입력합니다.
4. 배포를 진행합니다.
