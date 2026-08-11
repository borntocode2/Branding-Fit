const portfolioItems = [
  {
    id: "homeypaw",
    brandName: "HomeyPaw",
    category: "반려동물•캐릭터",
    summary: "반려동물과 보호자의 일상을 부드럽게 연결하는 펫 라이프 브랜드.",
    thumbnailLabel: "HomeyPaw",
    story:
      "HomeyPaw는 따뜻한 돌봄과 실용적인 감각을 함께 담은 반려동물 브랜드입니다.",
    colors: ["#F59E0B", "#FDE68A", "#4F46E5"],
    fonts: ["Pretendard", "Pretendard"],
    images: [],
  },
  {
    id: "neulbom",
    brandName: "늘봄",
    category: "브랜드•상품",
    summary: "매일의 회복과 지속 가능한 루틴을 제안하는 웰니스 상품 브랜드.",
    thumbnailLabel: "늘봄",
    story:
      "늘봄은 바쁜 생활 속에서도 몸과 마음을 균형 있게 돌보도록 돕는 브랜드입니다.",
    colors: ["#22C55E", "#A7F3D0", "#121212"],
    fonts: ["Pretendard", "Noto Sans KR"],
    images: [],
  },
  {
    id: "voyagemate",
    brandName: "VoyageMate",
    category: "플랫폼•어플",
    summary: "여행 준비부터 기록까지 이어주는 모바일 여행 플랫폼.",
    thumbnailLabel: "VoyageMate",
    story:
      "VoyageMate는 여행의 설렘과 실행을 하나의 흐름으로 연결하는 스마트 플랫폼입니다.",
    colors: ["#388EF6", "#3BB2F6", "#010207"],
    fonts: ["Pretendard", "Inter"],
    images: [],
  },
  {
    id: "view-more",
    brandName: "VIEW MORE PORTFOLIO",
    category: "전체",
    summary: "더 많은 브랜딩 사례를 확인하세요.",
    thumbnailLabel: "VIEW MORE",
    story: "Branding Fit의 다양한 결과물을 모아 보여주는 확장 패널입니다.",
    colors: ["#4F46E5", "#EC4899", "#121212"],
    fonts: ["Pretendard"],
    images: [],
    isViewMore: true,
  },
];

const portfolioCategories = [
  "전체",
  "카페•식당",
  "패션•뷰티",
  "브랜드•상품",
  "방송•엔터•게임",
  "반려동물•캐릭터",
  "플랫폼•어플",
  "서비스",
  "기타",
];

function mapHomeIndustryToWorkspace(industry) {
  const value = industry || "";
  return portfolioCategories.includes(value) ? value : "기타";
}

function validateDesignRequest(input) {
  const data = input || {};
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!String(data.name || "").trim()) {
    errors.name = "필수 입력 항목입니다.";
  }

  const email = String(data.email || "").trim();
  if (!email || !emailPattern.test(email)) {
    errors.email = "올바른 이메일을 입력해 주세요.";
  }

  if (!String(data.content || "").trim()) {
    errors.content = "필수 입력 항목입니다.";
  }

  if (
    data.privacyAgreed !== true &&
    data.privacyAgreed !== "true" &&
    data.privacyAgreed !== "on"
  ) {
    errors.privacyAgreed = "동의가 필요합니다.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

module.exports = {
  portfolioItems,
  portfolioCategories,
  mapHomeIndustryToWorkspace,
  validateDesignRequest,
};
