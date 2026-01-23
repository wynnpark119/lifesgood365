// 제품 카테고리별 색상 매핑
export const categoryColors: Record<string, string> = {
  "환경": "bg-green-100 text-green-800 border-green-200",
  "주방": "bg-orange-100 text-orange-800 border-orange-200",
  "세탁": "bg-blue-100 text-blue-800 border-blue-200",
  "의류관리": "bg-purple-100 text-purple-800 border-purple-200",
  "청소": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "엔터테인먼트": "bg-pink-100 text-pink-800 border-pink-200",
  "플랫폼": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "위생": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "미래가전": "bg-gray-100 text-gray-800 border-gray-200",
};

// 제품명으로 카테고리 찾기
export const productToCategory: Record<string, string> = {
  "공기청정기": "환경",
  "가습기": "환경",
  "제습기": "환경",
  "에어컨": "환경",
  "정수기": "주방",
  "식기세척기": "주방",
  "오븐": "주방",
  "냉장고": "주방",
  "세탁기": "세탁",
  "건조기": "세탁",
  "스타일러": "의류관리",
  "무선청소기": "청소",
  "로봇청소기": "청소",
  "TV": "엔터테인먼트",
  "프로젝터": "엔터테인먼트",
  "사운드바": "엔터테인먼트",
  "씽큐": "플랫폼",
  "webOS": "플랫폼",
  "신발관리기": "위생",
  "AI로봇": "미래가전",
};

// 제품명으로 색상 클래스 가져오기
export function getProductColorClass(productName: string): string {
  const category = productToCategory[productName];
  return category ? categoryColors[category] : "bg-gray-100 text-gray-800 border-gray-200";
}

// 카테고리명으로 색상 클래스 가져오기
export function getCategoryColorClass(category: string): string {
  return categoryColors[category] || "bg-gray-100 text-gray-800 border-gray-200";
}
