# GitHub → Cloudflare Pages 자동 배포

## 이 앱의 방식

서버 없는 정적 앱입니다. Node.js 24.19.0으로 TypeScript 문법을 제거하여 dist를 생성합니다. Vite나 Wrangler를 사용하지 않습니다. API, 데이터베이스, 서버 Secret은 필요 없습니다. 브라우저 저장은 접속 도메인별로 분리되므로 기존 로컬 저장이 공개 주소로 자동 이전되지는 않습니다. 설정에서 내보내기·가져오기로 이전할 수 있습니다.

## 전용 대상

- GitHub 예정 저장소: gohard0427/nomination-please
- 브랜치: main
- Cloudflare 계정: 사용자가 지정한 계정
- Pages 예정 프로젝트 이름: nomination-please

이 이름은 배포 완료를 의미하지 않습니다. 기존 substation-mvp 및 작업자 명단 저장소는 사용하지 않습니다.

## Pages 설정

Cloudflare Dashboard → Workers & Pages → Create application → Pages → Connect to Git(또는 Import an existing Git repository) → GitHub 연결 → nomination-please 선택.

- Production branch: main
- Framework preset: None
- Root directory: 저장소 루트(비워둠)
- Build command: npm ci && npm run build
- Build output directory: dist
- Environment variable: NODE_VERSION = 24.19.0 (Production과 Preview에 적용)

.node-version에도 같은 버전이 지정돼 있습니다. Node 24.3 이상이 필요한 빌드 API를 사용하므로 기본 구버전 Node로 빌드하지 마세요. 무료 Pages를 사용하고 유료 추가 서비스는 필요 없습니다.

Save and Deploy 후 성공한 배포의 Visit site 주소를 사용하세요. 실제 주소는 Cloudflare가 반환한 값을 확인해야 합니다. 이후 main 커밋은 Pages의 Git 연동이 자동 배포합니다. 수동 업로드 전용 프로젝트는 이 방식을 대신할 수 없습니다.

## 실패 확인

Workers & Pages → 해당 프로젝트 → Deployments → 실패한 배포 → View build log. 빌드 로그에서 Node 버전과 최초 오류를 확인하세요. 비밀 값이 있으면 가리고 관련 오류만 공유하세요. 코드를 수정하지 않은 반복 배포로 추측하지 않습니다.

## 다운로드

GitHub 저장소의 초록색 Code → Download ZIP. 비공개 저장소는 로그인한 소유자에게 표시됩니다.

## 업로드 제외

.env, 비밀 키, node_modules, 로컬 Sites 설정(.openai), 빌드 산출물 dist는 소스 업로드 대상에서 제외합니다. Pages가 Git 소스로부터 dist를 직접 빌드합니다.
