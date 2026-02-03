# Life's Good 365 AI ↔ Monthly LG 분기 작업 계획

## 목표
- **기존 페이지 유지**: Life's Good 365 AI 대시보드는 그대로 유지
- **Monthly LG 추가**: 동일 기능 + 데이터만 다른 Monthly LG 대시보드
- **히든 인덱스**: 나만 접근 가능한 페이지에서 두 대시보드 선택 후 진입

---

## 1. 현재 구조 요약

| 구분 | 내용 |
|------|------|
| **페이지** | `/`(Overview), `/reddit`, `/clusters`, `/scenarios`, `/settings/products`, `/logs` |
| **데이터** | `public/data/` 아래 CSV 4종: `reddit_cluster_results.csv`, `reddit_g.csv`, `lg_g.csv`, `lg_scenarios.csv` |
| **상태** | Zustand 단일 스토어, `initializeStore()` 한 번 호출로 CSV 로드 |
| **브랜딩** | `layout.tsx` 메타, `Sidebar.tsx` 로고/타이틀 "Life's Good 365 AI" |

---

## 2. 아키텍처 선택: Variant 기반 단일 라우트

- **선택**: 페이지를 복제하지 않고 **variant(브랜드)** 하나만 두고, 데이터/UI만 분기
- **장점**: 페이지·컴포넌트 한 벌만 유지, 기능 추가/수정 시 한 곳만 수정

| 항목 | 처리 방식 |
|------|-----------|
| URL 구조 | 기존 그대로 `/`, `/reddit`, `/scenarios` 등 유지 |
| 분기 기준 | `variant`: `"lg365"` \| `"monthly"` (쿠키 + 선택 페이지에서 설정) |
| 데이터 | variant별 폴더: `public/data/`(lg365), `public/data/monthly/`(Monthly LG) |
| UI 텍스트 | variant에 따라 "Life's Good 365 AI" / "Monthly LG" 등 표시 |

---

## 3. 작업 단계

### Phase 1: Variant 인프라
1. **variant 타입/상수**
   - `lib/constants.ts` 또는 `lib/variant.ts`: `Variant = "lg365" | "monthly"`, 기본값 `"lg365"`
2. **variant 저장/조회**
   - 쿠키 키 예: `lg-dashboard-variant` (또는 `lg_variant`)
   - 유틸: `getVariant()`, `setVariant(v)` (클라이언트에서 쿠키 읽기/쓰기)
3. **스토어 확장**
   - `store`: `variant: Variant` 추가
   - `initializeStore(variant?)`: 인자 또는 쿠키에서 variant 읽어서 해당 variant용 CSV 경로로 로드
4. **CSV 로더 분기**
   - `lib/csv.ts`: `loadRedditCSV(variant)`, `loadProductCSV(variant)` 등에서  
     `variant === "monthly"` → `/data/monthly/reddit_cluster_results.csv` 등으로 fetch

### Phase 2: 데이터 구조 (Monthly LG용)
1. **폴더**
   - `public/data/monthly/` 생성
2. **파일**
   - Monthly LG용 CSV 4개 복사 후 내용만 교체  
     (`reddit_cluster_results.csv`, `reddit_g.csv`, `lg_g.csv`, `lg_scenarios.csv`)
   - 당장은 lg365와 동일 파일 복사해 두고, 이후 실제 Monthly 데이터로 교체 가능

### Phase 3: 히든 인덱스(게이트) 페이지
1. **경로**
   - `app/gate/page.tsx` (또는 `app/_gate/page.tsx`, `app/dev/page.tsx`)
   - 노출하지 않으므로 사이드바/일반 네비에는 링크 없음
2. **역할**
   - "Life's Good 365 AI" / "Monthly LG" 두 카드(또는 버튼)만 표시
   - 선택 시 `setVariant("lg365")` 또는 `setVariant("monthly")` 호출 후 `router.push("/")` 로 대시보드 진입
3. **접근 제어(선택)**
   - 나만 보려면: URL을 아는 사람만 접근 (예: `/gate` 비공개 공유)
   - 필요 시 나중에 쿼리 키 추가: `/gate?key=비밀값` 검사 후 진입 허용

### Phase 4: 기존 라우트가 variant 인식하도록
1. **Layout**
   - Root layout 또는 공통 레이아웃에서 쿠키/스토어의 variant 읽기
   - `StoreInitializer`: 초기화 시 `getVariant()`로 variant 결정 → `initializeStore(variant)` 호출
2. **Sidebar**
   - `variant`에 따라 타이틀/로고 텍스트: "Life's Good 365 AI" vs "Monthly LG"
3. **메타**
   - `layout.tsx`의 `metadata`는 정적이므로, variant별 동적 타이틀은 클라이언트 컴포넌트에서 `document.title` 설정하거나, gate에서 진입한 뒤 한 번만 설정해도 됨 (선택)

### Phase 5: 기존 페이지 유지 및 검증
- 기존 `/`, `/reddit`, `/clusters`, `/scenarios`, `/settings/products`, `/logs` 는 **삭제/경로 변경 없음**
- gate에서 "Life's Good 365 AI" 선택 시 현재와 동일하게 동작 (데이터는 `public/data/`)
- "Monthly LG" 선택 시 동일 페이지들이 `public/data/monthly/` 데이터로 동작하는지 확인

---

## 4. 파일 변경 목록 (체크리스트)

| 파일 | 작업 |
|------|------|
| `lib/constants.ts` 또는 `lib/variant.ts` | 신규: Variant 타입, 쿠키 키, getVariant/setVariant |
| `lib/csv.ts` | load 함수들에 variant 인자 추가, fetch 경로 분기 |
| `lib/store.ts` | variant 상태 추가, initializeStore(variant) 시그니처 및 내부에서 csv 로더에 variant 전달 |
| `components/StoreInitializer.tsx` | 마운트 시 getVariant() → initializeStore(variant) |
| `app/gate/page.tsx` | 신규: 히든 인덱스, 두 브랜드 선택 UI, setVariant + push("/") |
| `components/layout/Sidebar.tsx` | useStore().variant 로 타이틀/서브타이틀 분기 |
| `app/layout.tsx` | (선택) 기본 메타만 두거나, variant는 클라이언트에서 document.title 로 처리 |
| `public/data/monthly/` | 폴더 생성 + CSV 4종 복사(내용은 이후 Monthly 데이터로 교체) |

---

## 5. 흐름 정리

1. 사용자가 **히든 URL** (`/gate`) 접속
2. "Life's Good 365 AI" 또는 "Monthly LG" 선택 → `setVariant` 후 `/`로 이동
3. `StoreInitializer`가 쿠키의 variant를 읽고 `initializeStore(variant)` 호출
4. CSV는 `variant === "monthly"` 일 때 `public/data/monthly/*.csv` 로드
5. Sidebar 등에서 variant에 따라 "Life's Good 365 AI" / "Monthly LG" 표시
6. 이후 같은 세션에서는 기존처럼 `/reddit`, `/scenarios` 등 이동 시에도 동일 variant 유지 (쿠키 유지)

---

## 6. 주의사항
- **기존 페이지 삭제 금지**: 요청대로 현재 라우트는 모두 유지
- **기능 동일**: Monthly LG는 동일 기능에 **데이터만** 다르게; 신규 페이지/라우트 추가 없음
- **히든 인덱스**: `/gate`는 네비/사이드바에 노출하지 않아 "나만 확인" 가능

이 계획대로 진행하면 Life's Good 365 AI와 Monthly LG를 한 코드베이스에서 분기해 사용할 수 있습니다.
