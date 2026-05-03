# 🌿 세계 동화 교육 브리핑

0-7세 유아교육자를 위한 세계 동화 교육 브리핑 서비스

---

## 🚀 Vercel 배포 방법 (10분 완성)

### STEP 1. GitHub에 올리기

1. [github.com](https://github.com) 접속 → 로그인
2. 우측 상단 **"+"** → **"New repository"** 클릭
3. Repository name: `fairytale-briefing` 입력 → **"Create repository"**
4. 이 폴더의 모든 파일을 업로드
   - **"uploading an existing file"** 클릭
   - 파일 전체 드래그 앤 드롭
   - **"Commit changes"** 클릭

---

### STEP 2. Vercel에 배포하기

1. [vercel.com](https://vercel.com) 접속 → GitHub 계정으로 로그인
2. **"New Project"** 클릭
3. `fairytale-briefing` 저장소 선택 → **"Import"**
4. **"Deploy"** 클릭 (설정 변경 없이)
5. 🎉 배포 완료! `https://fairytale-briefing.vercel.app` 같은 URL 생성

---

### STEP 3. 환경변수 설정 (API 키 입력)

Vercel 대시보드 → 프로젝트 → **Settings** → **Environment Variables**

아래 3가지 입력:

| 변수명 | 값 |
|--------|-----|
| `ANTHROPIC_API_KEY` | console.anthropic.com에서 발급한 API 키 |
| `GMAIL_USER` | 발송에 사용할 Gmail 주소 |
| `GMAIL_APP_PASSWORD` | 구글 앱 비밀번호 (아래 참고) |

환경변수 입력 후 **Deployments** → **Redeploy** 클릭

---

### 📌 구글 앱 비밀번호 발급 방법

1. [myaccount.google.com](https://myaccount.google.com) → **보안**
2. **2단계 인증** 활성화 (필수)
3. 검색창에 **"앱 비밀번호"** 검색
4. 앱: **기타(직접 입력)** → "동화브리핑" 입력
5. 생성된 **16자리 비밀번호** 복사 → `GMAIL_APP_PASSWORD`에 입력

---

### 📌 Anthropic API 키 발급 방법

1. [console.anthropic.com](https://console.anthropic.com) 접속
2. 회원가입 후 **API Keys** → **Create Key**
3. 생성된 키 복사 → `ANTHROPIC_API_KEY`에 입력

---

## 💰 비용

| 항목 | 비용 |
|------|------|
| Vercel 호스팅 | 무료 |
| Claude API (매일 1회) | 약 월 500-1,000원 |
| Gmail 발송 | 무료 |

---

## 📁 파일 구조

```
fairytale-briefing/
├── app/
│   ├── layout.js          # 앱 레이아웃
│   ├── page.js            # 메인 페이지
│   └── api/
│       ├── generate/
│       │   └── route.js   # Claude API 브리핑 생성
│       └── send-email/
│           └── route.js   # Gmail 발송
├── package.json
├── next.config.js
└── .env.local.example     # 환경변수 예시
```
