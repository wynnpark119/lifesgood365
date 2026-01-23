/**
 * 다중 제품 시나리오 생성기
 * - 서로 다른 카테고리의 제품 2개 이상을 조합
 * - 카테고리가 명확히 분리될수록 더 좋은 시나리오
 */

// 제품 카테고리 정의
const productCategories: Record<string, string[]> = {
  "환경": ["공기청정기", "가습기", "제습기", "에어컨"],
  "주방": ["정수기", "식기세척기", "오븐", "냉장고"],
  "세탁": ["세탁기", "건조기"],
  "의류관리": ["스타일러"],
  "청소": ["무선청소기", "로봇청소기"],
  "엔터테인먼트": ["TV", "프로젝터", "사운드바"],
  "플랫폼": ["씽큐", "webOS"],
  "위생": ["신발관리기"],
  "미래가전": ["AI로봇"],
};

// 카테고리 거리 계산 (멀수록 더 좋은 조합)
const categoryDistance: Record<string, number> = {
  "환경": 1,
  "주방": 2,
  "세탁": 3,
  "의류관리": 3,
  "청소": 4,
  "엔터테인먼트": 5,
  "플랫폼": 6,
  "위생": 4,
  "미래가전": 7,
};

// 제품에서 카테고리 찾기
function getCategory(product: string): string | null {
  for (const [category, products] of Object.entries(productCategories)) {
    if (products.includes(product)) return category;
  }
  return null;
}

// 카테고리 간 거리 계산
function getCategoryDiff(cat1: string, cat2: string): number {
  return Math.abs(categoryDistance[cat1] - categoryDistance[cat2]);
}

// 다중 제품 시나리오 인터페이스
interface MultiProductScenario {
  id: string;
  cluster: string;
  products: { name: string; category: string; role: string }[];
  title: string;
  hook: string;
  outline: string[];
  synergy: string;
  categoryDiversity: number; // 카테고리 다양성 점수 (높을수록 좋음)
}

// 시나리오 데이터 - 다른 카테고리 제품 조합
const multiProductScenarios: MultiProductScenario[] = [
  // ===== 털 관리 클러스터 =====
  {
    id: "MPS001",
    cluster: "털 제거 & 청소",
    products: [
      { name: "스타일러", category: "의류관리", role: "의류 털 제거 + 살균" },
      { name: "세탁기", category: "세탁", role: "침구류 깊숙한 털 제거" },
      { name: "공기청정기", category: "환경", role: "공중 부유 털 포집" },
    ],
    title: "3단계 완벽 털 제거 루틴: 옷-침구-공기까지",
    hook: "아무리 청소해도 사라지지 않는 반려견 털, 단계별로 해결하세요",
    outline: [
      "1. 외출 전 스타일러로 오늘 입을 옷의 털 + 냄새 동시 제거 (5분)",
      "2. 주 2회 세탁기 펫케어 코스로 침구와 패브릭 깊숙한 털 세탁",
      "3. 공기청정기 24시간 가동으로 실내 공기 중 부유 털 포집",
      "4. 3가지 가전 조합으로 옷-침구-공기 모든 공간의 털 완벽 관리",
    ],
    synergy: "의류관리 + 세탁 + 환경 3개 카테고리 조합으로, 털이 접촉하는 모든 표면(옷, 침구)과 공간(공기)을 커버",
    categoryDiversity: 3,
  },
  {
    id: "MPS002",
    cluster: "털 제거 & 청소",
    products: [
      { name: "로봇청소기", category: "청소", role: "바닥 자동 청소" },
      { name: "에어컨", category: "환경", role: "필터로 공기 중 털 포집" },
    ],
    title: "부재중 털 관리: 바닥과 공기를 동시에",
    hook: "외출 중에도 집안 털 관리가 자동으로 됩니다",
    outline: [
      "1. 출근 시 ThinQ 앱으로 로봇청소기 + 에어컨 동시 예약",
      "2. 로봇청소기가 바닥의 털과 먼지를 흡입하며 이동",
      "3. 에어컨 필터가 청소 중 날리는 공기 중 털까지 포집",
      "4. 퇴근 후 바닥도 공기도 깨끗한 집으로 귀가",
    ],
    synergy: "청소 + 환경 카테고리 조합으로, 바닥과 공중의 털을 동시에 관리하는 자동화 루틴",
    categoryDiversity: 2,
  },

  // ===== 냄새 관리 클러스터 =====
  {
    id: "MPS003",
    cluster: "냄새 관리",
    products: [
      { name: "공기청정기", category: "환경", role: "냄새 입자 필터링" },
      { name: "세탁기", category: "세탁", role: "섬유 냄새 제거" },
      { name: "건조기", category: "세탁", role: "고온 살균 + 냄새 완화" },
    ],
    title: "냄새 근원 차단: 공기-섬유-습기 3중 케어",
    hook: "반려견 냄새, 공기만 정화하면 끝? 섬유까지 관리해야 완벽해요",
    outline: [
      "1. 공기청정기로 24시간 공기 중 냄새 분자 필터링",
      "2. 주 2회 반려견 사용 쿠션/담요 세탁기로 깊은 세척",
      "3. 건조기 고온 건조로 세균 살균 + 잔여 냄새 완화",
      "4. 손님 방문 시에도 자신감 있는 깨끗한 집",
    ],
    synergy: "환경 + 세탁 카테고리 조합으로, 공기와 섬유 양쪽의 냄새 원인을 동시 해결",
    categoryDiversity: 2,
  },
  {
    id: "MPS004",
    cluster: "냄새 관리",
    products: [
      { name: "제습기", category: "환경", role: "습기로 인한 냄새 차단" },
      { name: "신발관리기", category: "위생", role: "현관 냄새 원천 제거" },
    ],
    title: "장마철 냄새 해결: 습기와 현관부터 잡는다",
    hook: "비 오는 날 특히 심한 냄새, 원인부터 차단하세요",
    outline: [
      "1. 산책 후 젖은 신발을 신발관리기에 즉시 투입",
      "2. 고온 건조 + 살균으로 외부 오염과 냄새 완벽 제거",
      "3. 제습기로 실내 습도 40-50% 유지, 곰팡이 원천 차단",
      "4. 비 오는 날에도 뽀송하고 상쾌한 실내 환경",
    ],
    synergy: "환경 + 위생 카테고리 조합으로, 습기와 외부 오염 두 가지 냄새 원인을 동시 차단",
    categoryDiversity: 2,
  },

  // ===== 분리불안 클러스터 =====
  {
    id: "MPS005",
    cluster: "분리불안",
    products: [
      { name: "에어컨", category: "환경", role: "쾌적한 온도 유지" },
      { name: "사운드바", category: "엔터테인먼트", role: "백색소음으로 안정" },
      { name: "씽큐", category: "플랫폼", role: "원격 모니터링 + 제어" },
    ],
    title: "외출해도 안심: 환경+소리+모니터링 3중 케어",
    hook: "혼자 남은 우리 아이, 환경부터 심리까지 케어하세요",
    outline: [
      "1. 출근 전 ThinQ로 에어컨 22-24도 자동 유지 설정",
      "2. 사운드바로 화이트노이즈 자동 재생, 외부 소음 차단",
      "3. 점심시간 ThinQ 앱으로 집 상태 확인, 필요시 원격 조절",
      "4. 쾌적한 환경과 안정적인 소리로 불안 행동 현저히 감소",
    ],
    synergy: "환경 + 엔터테인먼트 + 플랫폼 3개 카테고리 조합으로, 물리적 환경과 심리적 안정을 동시에 제공",
    categoryDiversity: 4,
  },
  {
    id: "MPS006",
    cluster: "분리불안",
    products: [
      { name: "TV", category: "엔터테인먼트", role: "시각 자극 + 정서 안정" },
      { name: "로봇청소기", category: "청소", role: "움직임으로 관심 분산" },
    ],
    title: "혼자 있어도 심심하지 않은 집: 영상+움직임",
    hook: "분리불안 완화의 핵심은 적절한 자극입니다",
    outline: [
      "1. 외출 시 TV에 Dog TV나 자연 영상 자동 재생 설정",
      "2. 오후 시간대 로봇청소기 작동 예약 (움직임 관심 유도)",
      "3. 시각적 자극과 움직임이 지루함과 불안을 해소",
      "4. 가구 물어뜯기, 짖음 등 문제 행동 현저히 감소",
    ],
    synergy: "엔터테인먼트 + 청소 카테고리 조합으로, 시각과 움직임 두 가지 자극으로 관심 분산",
    categoryDiversity: 3,
  },

  // ===== 온도 관리 클러스터 =====
  {
    id: "MPS007",
    cluster: "온도 관리",
    products: [
      { name: "에어컨", category: "환경", role: "냉방/난방으로 온도 조절" },
      { name: "씽큐", category: "플랫폼", role: "원격 온도 모니터링" },
      { name: "정수기", category: "주방", role: "시원한 물 공급" },
    ],
    title: "여름 열사병 예방: 온도-수분-모니터링 완벽 케어",
    hook: "더운 날 혼자 있는 반려견, 온도만큼 수분도 중요해요",
    outline: [
      "1. 출근 전 에어컨 25도 자동 유지 + 정수기 급수통 가득 채우기",
      "2. ThinQ 앱으로 실시간 실내 온도 모니터링",
      "3. 온도 급상승 시 즉시 알림, 원격으로 에어컨 강력 가동",
      "4. 시원한 환경과 신선한 물로 여름철 안전하게 보호",
    ],
    synergy: "환경 + 플랫폼 + 주방 3개 카테고리 조합으로, 온도와 수분 관리를 원격으로 동시에",
    categoryDiversity: 4,
  },

  // ===== 목욕 & 그루밍 클러스터 =====
  {
    id: "MPS008",
    cluster: "목욕 & 그루밍",
    products: [
      { name: "건조기", category: "세탁", role: "수건/담요 빠른 건조" },
      { name: "스타일러", category: "의류관리", role: "타올 살균 + 보송함" },
      { name: "신발관리기", category: "위생", role: "산책 후 발 관리 연계" },
    ],
    title: "목욕 후 완벽 마무리: 건조-살균-위생 루틴",
    hook: "목욕은 잘 시켰는데... 그 다음이 더 중요해요",
    outline: [
      "1. 목욕 전 건조기로 타올을 미리 데워두기 (포근한 건조)",
      "2. 목욕 후 따뜻한 타올로 감싸기, 드라이어 스트레스 최소화",
      "3. 사용한 타올은 스타일러로 살균 + 보송하게 관리",
      "4. 산책 신발은 신발관리기로 동시 관리, 다음 외출 준비 완료",
    ],
    synergy: "세탁 + 의류관리 + 위생 3개 카테고리 조합으로, 목욕 전후 위생 케어의 완성",
    categoryDiversity: 3,
  },

  // ===== 식사 관리 클러스터 =====
  {
    id: "MPS009",
    cluster: "식사 거부",
    products: [
      { name: "정수기", category: "주방", role: "신선한 물 공급" },
      { name: "오븐", category: "주방", role: "수제 간식 제작" },
      { name: "냉장고", category: "주방", role: "재료 신선도 유지" },
    ],
    title: "까다로운 입맛 공략: 신선한 물과 수제 간식",
    hook: "시판 사료와 간식 거부하는 아이, 직접 만들어보세요",
    outline: [
      "1. 냉장고에서 신선한 닭가슴살, 고구마 등 재료 꺼내기",
      "2. 오븐 에어프라이 기능으로 첨가물 없는 수제 간식 제작",
      "3. 정수기 직수로 맑고 깨끗한 물 함께 제공",
      "4. 건강한 간식과 물로 식욕 회복, 영양 균형 달성",
    ],
    synergy: "주방 카테고리 내 3개 제품이지만, 각각 보관-조리-급수로 역할 분리가 명확",
    categoryDiversity: 1,
  },
  {
    id: "MPS010",
    cluster: "식사 거부",
    products: [
      { name: "오븐", category: "주방", role: "수제 간식 제작" },
      { name: "식기세척기", category: "주방", role: "식기 위생 관리" },
      { name: "공기청정기", category: "환경", role: "조리 냄새 제거" },
    ],
    title: "수제 간식 라이프: 조리-세척-환기 완벽 루틴",
    hook: "직접 만든 간식, 위생과 환경까지 신경 쓰면 완벽해요",
    outline: [
      "1. 오븐으로 닭가슴살 저키나 고구마 칩 수제 간식 제작",
      "2. 사용한 그릇과 도구는 식기세척기 고온 살균 세척",
      "3. 조리 중 발생한 냄새는 공기청정기 터보모드로 즉시 제거",
      "4. 깨끗한 환경에서 건강한 간식, 반려견과 반려인 모두 만족",
    ],
    synergy: "주방 + 환경 카테고리 조합으로, 조리 후 위생과 실내 환경까지 케어",
    categoryDiversity: 2,
  },

  // ===== 공포 & 스트레스 클러스터 =====
  {
    id: "MPS011",
    cluster: "공포 & 스트레스",
    products: [
      { name: "사운드바", category: "엔터테인먼트", role: "백색소음 마스킹" },
      { name: "TV", category: "엔터테인먼트", role: "시각 자극으로 주의 분산" },
      { name: "가습기", category: "환경", role: "쾌적한 습도로 안정" },
    ],
    title: "천둥 공포증 완화: 소리-영상-환경 3중 차단",
    hook: "폭풍이 와도 무섭지 않은 집을 만들어주세요",
    outline: [
      "1. 날씨 예보 확인 후 미리 사운드바 백색소음 재생",
      "2. TV에 차분한 자연 영상 재생으로 시각적 주의 분산",
      "3. 가습기로 습도 50% 유지, 정전기와 건조함 완화",
      "4. 청각-시각-촉각 3중 안정으로 공포 반응 현저히 감소",
    ],
    synergy: "엔터테인먼트 + 환경 카테고리 조합으로, 감각적 안정 환경 조성",
    categoryDiversity: 2,
  },

  // ===== 어린이 & 반려견 공존 클러스터 =====
  {
    id: "MPS012",
    cluster: "어린이 & 반려견",
    products: [
      { name: "로봇청소기", category: "청소", role: "실시간 바닥 청결" },
      { name: "공기청정기", category: "환경", role: "알레르겐 제거" },
      { name: "식기세척기", category: "주방", role: "식기 위생 분리" },
    ],
    title: "아이와 반려견 함께: 청결-공기-위생 완벽 분리",
    hook: "아이 건강 걱정? 철저한 분리 관리가 답이에요",
    outline: [
      "1. 로봇청소기 하루 3회 예약으로 바닥 항시 청결 유지",
      "2. 공기청정기 24시간 가동으로 털과 알레르겐 제거",
      "3. 식기세척기로 아이 식기와 반려견 그릇 분리 고온 세척",
      "4. 청결한 환경에서 아이와 반려견 모두 건강하게",
    ],
    synergy: "청소 + 환경 + 주방 3개 카테고리 조합으로, 바닥-공기-식기 3단계 위생 관리",
    categoryDiversity: 4,
  },

  // ===== 건강 & 의료 클러스터 =====
  {
    id: "MPS013",
    cluster: "건강 & 의료",
    products: [
      { name: "공기청정기", category: "환경", role: "알레르겐 필터링" },
      { name: "제습기", category: "환경", role: "진드기 번식 억제" },
      { name: "세탁기", category: "세탁", role: "침구 알레르겐 제거" },
    ],
    title: "피부 알레르기 완화: 공기-습도-침구 종합 관리",
    hook: "계속 긁는 우리 아이, 환경부터 바꿔보세요",
    outline: [
      "1. 공기청정기로 먼지, 진드기, 곰팡이 포자 99.9% 필터링",
      "2. 제습기로 습도 40-50% 유지, 진드기 번식 환경 차단",
      "3. 주 2회 세탁기 펫케어 코스로 침구 깊은 세탁",
      "4. 2-3주 후 긁기 행동 감소, 피부 상태 눈에 띄게 개선",
    ],
    synergy: "환경 + 세탁 카테고리 조합으로, 알레르기 원인을 공기와 섬유 양쪽에서 차단",
    categoryDiversity: 2,
  },

  // ===== 스마트홈 통합 클러스터 =====
  {
    id: "MPS014",
    cluster: "입양 & 일반",
    products: [
      { name: "씽큐", category: "플랫폼", role: "가전 통합 제어" },
      { name: "에어컨", category: "환경", role: "온도 자동 관리" },
      { name: "로봇청소기", category: "청소", role: "청소 자동화" },
      { name: "공기청정기", category: "환경", role: "공기질 관리" },
    ],
    title: "직장인 반려인의 하루: ThinQ 원터치 자동화",
    hook: "바쁜 직장인도 완벽한 반려생활이 가능합니다",
    outline: [
      "1. 출근 모드 실행: 에어컨 25도 유지, 로봇청소기 10시 작동 예약",
      "2. 공기청정기 자동 모드로 하루 종일 공기질 관리",
      "3. 점심시간 앱으로 집 상태 확인, 필요시 원격 조절",
      "4. 퇴근 모드 실행: 깨끗하고 쾌적한 집에서 반려견과 휴식",
    ],
    synergy: "플랫폼 + 환경 + 청소 3개 카테고리 4개 제품 조합으로, 반려생활 완전 자동화",
    categoryDiversity: 5,
  },

  // ===== 산책 & 외출 클러스터 =====
  {
    id: "MPS015",
    cluster: "목욕 & 그루밍",
    products: [
      { name: "신발관리기", category: "위생", role: "산책 신발 살균" },
      { name: "로봇청소기", category: "청소", role: "현관 주변 청소" },
      { name: "공기청정기", category: "환경", role: "외부 먼지 제거" },
    ],
    title: "산책 후 귀가 루틴: 현관에서 외부 오염 차단",
    hook: "산책 후 집 안으로 들어오는 세균, 현관에서 막으세요",
    outline: [
      "1. 귀가 즉시 반려견 발 닦고, 신발은 신발관리기에 투입",
      "2. 로봇청소기 스팟 청소로 현관 주변 먼지와 흙 제거",
      "3. 공기청정기 터보모드로 외부에서 들어온 먼지 포집",
      "4. 5분 루틴으로 외부 오염 완벽 차단, 깨끗한 실내 유지",
    ],
    synergy: "위생 + 청소 + 환경 3개 카테고리 조합으로, 현관에서 공기까지 외부 오염 3중 차단",
    categoryDiversity: 4,
  },
];

// 콘솔 출력 함수
function printScenarios() {
  console.log("\n" + "=".repeat(80));
  console.log("🐕 다중 제품 연결 시나리오 (Multi-Product Scenarios)");
  console.log("=".repeat(80));
  console.log("📌 규칙: 서로 다른 카테고리 제품 2개 이상 조합");
  console.log("📌 카테고리 다양성 점수가 높을수록 더 좋은 시나리오\n");

  // 카테고리 다양성 점수별로 정렬 (높은 순)
  const sortedScenarios = [...multiProductScenarios].sort(
    (a, b) => b.categoryDiversity - a.categoryDiversity
  );

  sortedScenarios.forEach((scenario, index) => {
    console.log("-".repeat(80));
    console.log(`\n📋 [${scenario.id}] ${scenario.title}`);
    console.log(`   클러스터: ${scenario.cluster}`);
    console.log(`   ⭐ 카테고리 다양성 점수: ${scenario.categoryDiversity}/5`);
    console.log("\n   🔗 연결 제품:");
    scenario.products.forEach((product, i) => {
      console.log(`      ${i + 1}. ${product.name} (${product.category}) - ${product.role}`);
    });
    console.log(`\n   🎯 훅: "${scenario.hook}"`);
    console.log("\n   📝 시나리오 흐름:");
    scenario.outline.forEach((step) => {
      console.log(`      ${step}`);
    });
    console.log(`\n   💡 시너지 효과:\n      ${scenario.synergy}`);
    console.log("");
  });

  // 통계 출력
  console.log("=".repeat(80));
  console.log("📊 통계 요약");
  console.log("-".repeat(80));
  console.log(`총 시나리오 수: ${multiProductScenarios.length}개`);

  const avgProducts =
    multiProductScenarios.reduce((sum, s) => sum + s.products.length, 0) /
    multiProductScenarios.length;
  console.log(`평균 제품 수: ${avgProducts.toFixed(1)}개`);

  const avgDiversity =
    multiProductScenarios.reduce((sum, s) => sum + s.categoryDiversity, 0) /
    multiProductScenarios.length;
  console.log(`평균 카테고리 다양성: ${avgDiversity.toFixed(1)}/5`);

  // 클러스터별 분포
  const clusterCount: Record<string, number> = {};
  multiProductScenarios.forEach((s) => {
    clusterCount[s.cluster] = (clusterCount[s.cluster] || 0) + 1;
  });
  console.log("\n클러스터별 시나리오 수:");
  Object.entries(clusterCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cluster, count]) => {
      console.log(`   - ${cluster}: ${count}개`);
    });

  // 가장 많이 사용된 제품
  const productUsage: Record<string, number> = {};
  multiProductScenarios.forEach((s) => {
    s.products.forEach((p) => {
      productUsage[p.name] = (productUsage[p.name] || 0) + 1;
    });
  });
  console.log("\n제품별 사용 빈도 (TOP 5):");
  Object.entries(productUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([product, count]) => {
      console.log(`   - ${product}: ${count}회`);
    });

  console.log("\n" + "=".repeat(80));
}

// 실행
printScenarios();
