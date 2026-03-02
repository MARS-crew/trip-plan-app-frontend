## 🇰🇷 프로젝트 정보

본 프로젝트는 2026년 마스외전의 여행 계획 AI 프로젝트입니다.

### 📦 실행 방법

1. 저장소를 클론합니다.
2. 의존성을 설치합니다:
   ```sh
   npm install
   ```
3. Metro 서버를 실행합니다:
   ```sh
   npm start
   ```
4. Android 에뮬레이터 또는 연결된 기기에서 앱을 빌드/실행:
   ```sh
   npm run android
   ```

> **주의**: Android 빌드를 위해 **Java 17**이 설치되어 있어야 합니다. OpenJDK 17을 설치하거나 `brew install openjdk@17` 등의 방법을 사용하세요.

### 🛠 권장 개발 환경

- Node.js 16 이상 (LTS 권장)
- npm
- Android Studio (Android SDK)
- Java JDK 17

### 🧱 프로젝트 구조 (간단 요약)

```
src/
  App.tsx             # 애플리케이션 진입점
  components/         # 재사용 UI 컴포넌트
  hooks/              # 커스텀 React hooks
  navigation/         # React Navigation 설정
  screens/            # 화면 단위 컴포넌트
  services/           # API 호출 및 비즈니스 로직
  assets/             # 이미지, 폰트 등 정적 리소스
```
그 외 Android, iOS 네이티브 코드와 설정 파일이 각각 `android/`와 `ios/` 폴더에 위치합니다.


### 📄 코드컨벤션 참고

https://www.notion.so/3175c24e663e801ab445fb5bbbe127d1?source=copy_link


### 💡 추가 팁

- 환경 설정은 [React Native 공식 문서](https://reactnative.dev/docs/environment-setup)를 참고하세요.
- `npm run lint` 또는 `npm test` 등의 스크립트가 있다면 적절히 추가하세요.
- CI/CD 설정이나 코드 스타일 가이드(ESLint, Prettier) 등의 문서를 추가하면 협업에 도움이 됩니다.
- 자주 사용하는 명령어 목록을 `package.json`의 `scripts`에 정리해 두세요.

### ⚠️ 자주 발생하는 문제

- Java 버전 충돌: `JAVA_HOME`이 올바른지 확인하고, `java -version`을 통해 17인지 체크하세요.
- 종속성 설치 실패 시 `node_modules`를 삭제 후 재설치(`npm ci` 또는 `yarn install --force`)를 시도합니다.
