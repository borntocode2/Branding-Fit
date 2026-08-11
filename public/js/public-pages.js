// public/js/public-pages.js

const PUBLIC_PORTFOLIO_ITEMS = [
  {
    id: "grand-prunil",
    brandName: "그랑프르닐",
    category: "카페•식당",
    summary: "그랑프르닐 - 식음 공간의 첫인상을 선명하게 만드는 브랜드.",
    thumbnailLabel: "그랑프르닐",
    story:
      "맛과 공간의 무드를 로고, 컬러, 패키지 이미지로 일관되게 연결했습니다.",
    colors: ["#6B4C35", "#F4E7D4", "#C9A56A"],
    fonts: ["Pretendard", "Cormorant Garamond"],
    surface: "#F2E6D3",
  },
  {
    id: "dongdong",
    brandName: "막걸리 동동",
    category: "카페•식당",
    summary: "막걸리 동동 - 식음 공간의 첫인상을 선명하게 만드는 브랜드.",
    thumbnailLabel: "막걸리 동동",
    story:
      "맛과 공간의 무드를 로고, 컬러, 패키지 이미지로 일관되게 연결했습니다.",
    colors: ["#28285E", "#F8F7F0", "#A7A6D8"],
    fonts: ["Pretendard", "Noto Sans KR"],
    surface: "#F8F7F0",
  },
  {
    id: "maison-sucre",
    brandName: "메종드스크류",
    category: "카페•식당",
    summary: "메종드스크류 - 식음 공간의 첫인상을 선명하게 만드는 브랜드.",
    thumbnailLabel: "메종드스크류",
    story:
      "맛과 공간의 무드를 로고, 컬러, 패키지 이미지로 일관되게 연결했습니다.",
    colors: ["#8B5E4A", "#F8EFE6", "#D8B78A"],
    fonts: ["Pretendard", "Cormorant Garamond"],
    surface: "#F7EEE5",
  },
  {
    id: "atelier-coffee",
    brandName: "아뜰리에 커피",
    category: "카페•식당",
    summary: "아뜰리에 커피 - 식음 공간의 첫인상을 선명하게 만드는 브랜드.",
    thumbnailLabel: "아뜰리에 커피",
    story:
      "맛과 공간의 무드를 로고, 컬러, 패키지 이미지로 일관되게 연결했습니다.",
    colors: ["#6C4630", "#D2B48C", "#1E1815"],
    fonts: ["Pretendard", "Cormorant Garamond"],
    surface: "#F3E8D0",
  },
  {
    id: "oreum-black-pork",
    brandName: "오름흑돼지",
    category: "카페•식당",
    summary: "오름흑돼지 - 식음 공간의 첫인상을 선명하게 만드는 브랜드.",
    thumbnailLabel: "오름흑돼지",
    story:
      "맛과 공간의 무드를 로고, 컬러, 패키지 이미지로 일관되게 연결했습니다.",
    colors: ["#252422", "#B85B3A", "#F7F1E3"],
    fonts: ["Pretendard", "Noto Sans KR"],
    surface: "#FFFDF8",
  },
  {
    id: "les-sens-fleur",
    brandName: "레상스휘르",
    category: "패션•뷰티",
    summary: "레상스휘르 - 감각적인 취향과 소재감을 담은 패션·뷰티 브랜드.",
    thumbnailLabel: "레상스휘르",
    story:
      "섬세한 타이포그래피와 질감 중심의 비주얼로 브랜드의 분위기를 구축했습니다.",
    colors: ["#8E6D5A", "#F5EFE8", "#C9AFA1"],
    fonts: ["Pretendard", "Cormorant Garamond"],
    surface: "#F5EFE8",
  },
  {
    id: "luce",
    brandName: "루체",
    category: "패션•뷰티",
    summary: "루체 - 감각적인 취향과 소재감을 담은 패션·뷰티 브랜드.",
    thumbnailLabel: "루체",
    story:
      "섬세한 타이포그래피와 질감 중심의 비주얼로 브랜드의 분위기를 구축했습니다.",
    colors: ["#6F8069", "#F5F1E8", "#B59A6A"],
    fonts: ["Pretendard", "Cormorant Garamond"],
    surface: "#F2EBDD",
  },
  {
    id: "lueur",
    brandName: "Lueur",
    category: "패션•뷰티",
    summary: "Lueur - 감각적인 취향과 소재감을 담은 패션·뷰티 브랜드.",
    thumbnailLabel: "Lueur",
    story:
      "섬세한 타이포그래피와 질감 중심의 비주얼로 브랜드의 분위기를 구축했습니다.",
    colors: ["#C8B7A1", "#F4F1EC", "#8E745F"],
    fonts: ["Pretendard", "Cormorant Garamond"],
    surface: "#EFE9E2",
  },
  {
    id: "renutre",
    brandName: "리뉴트르",
    category: "패션•뷰티",
    summary: "리뉴트르 - 감각적인 취향과 소재감을 담은 패션·뷰티 브랜드.",
    thumbnailLabel: "리뉴트르",
    story:
      "섬세한 타이포그래피와 질감 중심의 비주얼로 브랜드의 분위기를 구축했습니다.",
    colors: ["#7D8A78", "#F4F1E8", "#C8BFA9"],
    fonts: ["Pretendard", "Noto Sans KR"],
    surface: "#F3F0E7",
  },
  {
    id: "urbanvibe",
    brandName: "URBANVIBE",
    category: "패션•뷰티",
    summary: "URBANVIBE - 감각적인 취향과 소재감을 담은 패션·뷰티 브랜드.",
    thumbnailLabel: "URBANVIBE",
    story:
      "섬세한 타이포그래피와 질감 중심의 비주얼로 브랜드의 분위기를 구축했습니다.",
    colors: ["#B6F22F", "#111111", "#6B6B6B"],
    fonts: ["Pretendard", "Pretendard"],
    surface: "#3B3B3B",
  },
  {
    id: "neulbom",
    brandName: "늘봄",
    category: "브랜드•상품",
    summary: "늘봄 - 제품의 가치와 사용 경험을 명확하게 전달하는 브랜드.",
    thumbnailLabel: "늘봄",
    story: "상품이 놓이는 모든 접점에서 기억되는 시각 시스템을 설계했습니다.",
    colors: ["#22C55E", "#A7F3D0", "#121212"],
    fonts: ["Pretendard", "Noto Sans KR"],
    surface: "#F5F8F2",
  },
  {
    id: "daily-ritual",
    brandName: "데일리리추얼",
    category: "브랜드•상품",
    summary:
      "데일리리추얼 - 제품의 가치와 사용 경험을 명확하게 전달하는 브랜드.",
    thumbnailLabel: "데일리리추얼",
    story: "상품이 놓이는 모든 접점에서 기억되는 시각 시스템을 설계했습니다.",
    colors: ["#E08D61", "#F8E9DA", "#5E463A"],
    fonts: ["Pretendard", "Noto Sans KR"],
    surface: "#F4E4D5",
  },
  {
    id: "modullogic",
    brandName: "모듈로직",
    category: "브랜드•상품",
    summary: "모듈로직 - 제품의 가치와 사용 경험을 명확하게 전달하는 브랜드.",
    thumbnailLabel: "모듈로직",
    story: "상품이 놓이는 모든 접점에서 기억되는 시각 시스템을 설계했습니다.",
    colors: ["#202C34", "#E8ECEF", "#4B6472"],
    fonts: ["Pretendard", "Inter"],
    surface: "#E9EEF0",
  },
  {
    id: "ecopulse",
    brandName: "EcoPulse",
    category: "브랜드•상품",
    summary: "EcoPulse - 제품의 가치와 사용 경험을 명확하게 전달하는 브랜드.",
    thumbnailLabel: "EcoPulse",
    story: "상품이 놓이는 모든 접점에서 기억되는 시각 시스템을 설계했습니다.",
    colors: ["#497554", "#E7E0D2", "#A8C69A"],
    fonts: ["Pretendard", "Pretendard"],
    surface: "#EFE8DC",
  },
  {
    id: "page-and-quiet",
    brandName: "페이지앤쿠옛",
    category: "브랜드•상품",
    summary:
      "페이지앤쿠옛 - 제품의 가치와 사용 경험을 명확하게 전달하는 브랜드.",
    thumbnailLabel: "페이지앤쿠옛",
    story: "상품이 놓이는 모든 접점에서 기억되는 시각 시스템을 설계했습니다.",
    colors: ["#7C6A56", "#F3E8D8", "#C6A06C"],
    fonts: ["Pretendard", "Cormorant Garamond"],
    surface: "#F2E7D7",
  },
  {
    id: "formspace",
    brandName: "폼스페이스",
    category: "브랜드•상품",
    summary: "폼스페이스 - 제품의 가치와 사용 경험을 명확하게 전달하는 브랜드.",
    thumbnailLabel: "폼스페이스",
    story: "상품이 놓이는 모든 접점에서 기억되는 시각 시스템을 설계했습니다.",
    colors: ["#5E5A50", "#F2EFE6", "#BDB6A6"],
    fonts: ["Pretendard", "Inter"],
    surface: "#EEEAE0",
  },
  {
    id: "viewwave",
    brandName: "바이브스트림",
    category: "방송•엔터•게임",
    summary:
      "바이브스트림 - 콘텐츠의 세계관과 몰입감을 확장하는 엔터테인먼트 브랜드.",
    thumbnailLabel: "바이브스트림",
    story:
      "움직임과 서사를 연상시키는 그래픽 언어로 강한 첫인상을 만들었습니다.",
    colors: ["#0A344C", "#61D6F8", "#031018"],
    fonts: ["Pretendard", "Pretendard"],
    surface: "#0D2634",
  },
  {
    id: "somber-tale",
    brandName: "솜버테일",
    category: "방송•엔터•게임",
    summary:
      "솜버테일 - 콘텐츠의 세계관과 몰입감을 확장하는 엔터테인먼트 브랜드.",
    thumbnailLabel: "솜버테일",
    story:
      "움직임과 서사를 연상시키는 그래픽 언어로 강한 첫인상을 만들었습니다.",
    colors: ["#211D1C", "#C8A85D", "#ECE5D4"],
    fonts: ["Pretendard", "Cormorant Garamond"],
    surface: "#2A2522",
  },
  {
    id: "joy-pocket",
    brandName: "조이포켓",
    category: "반려동물•캐릭터",
    summary: "조이포켓 - 친근한 캐릭터성과 돌봄의 감정을 담은 브랜드.",
    thumbnailLabel: "조이포켓",
    story:
      "따뜻한 톤과 기억하기 쉬운 형태로 브랜드의 애착 포인트를 만들었습니다.",
    colors: ["#FFB84D", "#FFF5D8", "#2C5EEA"],
    fonts: ["Pretendard", "Pretendard"],
    surface: "#FFF4D6",
  },
  {
    id: "tale-factory",
    brandName: "테일팩토리",
    category: "반려동물•캐릭터",
    summary: "테일팩토리 - 친근한 캐릭터성과 돌봄의 감정을 담은 브랜드.",
    thumbnailLabel: "테일팩토리",
    story:
      "따뜻한 톤과 기억하기 쉬운 형태로 브랜드의 애착 포인트를 만들었습니다.",
    colors: ["#6B4F35", "#EAD7B7", "#243049"],
    fonts: ["Pretendard", "Noto Sans KR"],
    surface: "#E8D6B8",
  },
  {
    id: "petvogue",
    brandName: "펫보그",
    category: "반려동물•캐릭터",
    summary: "펫보그 - 친근한 캐릭터성과 돌봄의 감정을 담은 브랜드.",
    thumbnailLabel: "펫보그",
    story:
      "따뜻한 톤과 기억하기 쉬운 형태로 브랜드의 애착 포인트를 만들었습니다.",
    colors: ["#EAB6C3", "#FFFFFF", "#A1737F"],
    fonts: ["Pretendard", "Cormorant Garamond"],
    surface: "#E9ACBC",
  },
  {
    id: "prime-bowl",
    brandName: "프라임볼",
    category: "반려동물•캐릭터",
    summary: "프라임볼 - 친근한 캐릭터성과 돌봄의 감정을 담은 브랜드.",
    thumbnailLabel: "프라임볼",
    story:
      "따뜻한 톤과 기억하기 쉬운 형태로 브랜드의 애착 포인트를 만들었습니다.",
    colors: ["#1E4436", "#F4EFE2", "#D0A55A"],
    fonts: ["Pretendard", "Noto Sans KR"],
    surface: "#F1ECDE",
  },
  {
    id: "homeypaw",
    brandName: "호미포",
    category: "반려동물•캐릭터",
    summary: "호미포 - 친근한 캐릭터성과 돌봄의 감정을 담은 브랜드.",
    thumbnailLabel: "호미포",
    story:
      "따뜻한 톤과 기억하기 쉬운 형태로 브랜드의 애착 포인트를 만들었습니다.",
    colors: ["#78917B", "#D8D8D8", "#2A302B"],
    fonts: ["Pretendard", "Pretendard"],
    surface: "#F6F4EF",
  },
  {
    id: "godash",
    brandName: "GoDash",
    category: "플랫폼•어플",
    summary:
      "GoDash - 사용자의 흐름과 기능을 직관적으로 연결하는 플랫폼 브랜드.",
    thumbnailLabel: "GoDash",
    story:
      "디지털 접점에서 읽기 쉬운 로고와 확장 가능한 디자인 시스템을 구성했습니다.",
    colors: ["#1C3E70", "#F28C2E", "#D8D2C7"],
    fonts: ["Pretendard", "Pretendard"],
    surface: "#DCD7CE",
  },
  {
    id: "voyagemate",
    brandName: "VoyageMate",
    category: "플랫폼•어플",
    summary:
      "VoyageMate - 사용자의 흐름과 기능을 직관적으로 연결하는 플랫폼 브랜드.",
    thumbnailLabel: "VoyageMate",
    story:
      "디지털 접점에서 읽기 쉬운 로고와 확장 가능한 디자인 시스템을 구성했습니다.",
    colors: ["#388EF6", "#3BB2F6", "#010207"],
    fonts: ["Pretendard", "Inter"],
    surface: "#D9F4FF",
  },
  {
    id: "asset-flow",
    brandName: "에셋플로우",
    category: "플랫폼•어플",
    summary:
      "에셋플로우 - 사용자의 흐름과 기능을 직관적으로 연결하는 플랫폼 브랜드.",
    thumbnailLabel: "에셋플로우",
    story:
      "디지털 접점에서 읽기 쉬운 로고와 확장 가능한 디자인 시스템을 구성했습니다.",
    colors: ["#6D5DF6", "#F3F0FF", "#242238"],
    fonts: ["Pretendard", "Inter"],
    surface: "#F1EEFF",
  },
  {
    id: "connectus",
    brandName: "ConnectUs",
    category: "플랫폼•어플",
    summary:
      "ConnectUs - 사용자의 흐름과 기능을 직관적으로 연결하는 플랫폼 브랜드.",
    thumbnailLabel: "ConnectUs",
    story:
      "디지털 접점에서 읽기 쉬운 로고와 확장 가능한 디자인 시스템을 구성했습니다.",
    colors: ["#2166B1", "#41C7C7", "#F5FAFF"],
    fonts: ["Pretendard", "Inter"],
    surface: "#EEF8FF",
  },
  {
    id: "skillupbase",
    brandName: "SkillUpBase",
    category: "서비스",
    summary: "SkillUpBase - 전문성과 신뢰를 중심에 둔 서비스 브랜드.",
    thumbnailLabel: "SkillUpBase",
    story:
      "서비스의 핵심 가치를 명확한 구조와 안정적인 컬러 시스템으로 표현했습니다.",
    colors: ["#197A85", "#EAF2ED", "#113D43"],
    fonts: ["Pretendard", "Pretendard"],
    surface: "#F4F6EF",
  },
  {
    id: "framedesign",
    brandName: "FrameDesign",
    category: "서비스",
    summary: "FrameDesign - 전문성과 신뢰를 중심에 둔 서비스 브랜드.",
    thumbnailLabel: "FrameDesign",
    story:
      "서비스의 핵심 가치를 명확한 구조와 안정적인 컬러 시스템으로 표현했습니다.",
    colors: ["#C9A75E", "#2F2F2F", "#0F0F0F"],
    fonts: ["Pretendard", "Pretendard"],
    surface: "#333333",
  },
  {
    id: "aegis-partners",
    brandName: "이지스파트너스",
    category: "서비스",
    summary: "이지스파트너스 - 전문성과 신뢰를 중심에 둔 서비스 브랜드.",
    thumbnailLabel: "이지스파트너스",
    story:
      "서비스의 핵심 가치를 명확한 구조와 안정적인 컬러 시스템으로 표현했습니다.",
    colors: ["#1F2E3D", "#E7E1D6", "#8A765D"],
    fonts: ["Pretendard", "Inter"],
    surface: "#E8E2D7",
  },
  {
    id: "muscleart",
    brandName: "머슬아트",
    category: "기타",
    summary: "머슬아트 - 고유한 분야의 개성과 에너지를 담은 브랜드.",
    thumbnailLabel: "머슬아트",
    story: "브랜드가 가진 분위기와 사용 장면을 균형 있게 시각화했습니다.",
    colors: ["#202020", "#D7D7D7", "#8BE05A"],
    fonts: ["Pretendard", "Pretendard"],
    surface: "#E2E2E2",
  },
  {
    id: "hub-lounge",
    brandName: "허브앤라운지",
    category: "기타",
    summary: "허브앤라운지 - 고유한 분야의 개성과 에너지를 담은 브랜드.",
    thumbnailLabel: "허브앤라운지",
    story: "브랜드가 가진 분위기와 사용 장면을 균형 있게 시각화했습니다.",
    colors: ["#3F4A3D", "#E9E2D5", "#B79063"],
    fonts: ["Pretendard", "Noto Sans KR"],
    surface: "#E8E1D3",
  },
];

const PUBLIC_PORTFOLIO_ASSETS = {
  "grand-prunil": {
    logoImage: "/assets/images/portfolio/grand-prunil/logo.jpeg",
    mockupImages: [
      "/assets/images/portfolio/grand-prunil/mockup-1.png",
      "/assets/images/portfolio/grand-prunil/mockup-2.png",
      "/assets/images/portfolio/grand-prunil/mockup-3.png",
    ],
  },
  dongdong: {
    logoImage: "/assets/images/portfolio/dongdong/logo.jpg",
    mockupImages: [
      "/assets/images/portfolio/dongdong/mockup-1.png",
      "/assets/images/portfolio/dongdong/mockup-2.png",
      "/assets/images/portfolio/dongdong/mockup-3.png",
      "/assets/images/portfolio/dongdong/mockup-4.png",
      "/assets/images/portfolio/dongdong/mockup-5.png",
    ],
  },
  "maison-sucre": {
    logoImage: "/assets/images/portfolio/maison-sucre/logo.jpeg",
    mockupImages: [
      "/assets/images/portfolio/maison-sucre/mockup-1.jpeg",
      "/assets/images/portfolio/maison-sucre/mockup-2.jpeg",
      "/assets/images/portfolio/maison-sucre/mockup-3.jpeg",
      "/assets/images/portfolio/maison-sucre/mockup-4.jpeg",
      "/assets/images/portfolio/maison-sucre/mockup-5.jpeg",
    ],
  },
  "atelier-coffee": {
    logoImage: "/assets/images/portfolio/atelier-coffee/logo.png",
    mockupImages: [
      "/assets/images/portfolio/atelier-coffee/mockup-5.png",
      "/assets/images/portfolio/atelier-coffee/mockup-3.png",
      "/assets/images/portfolio/atelier-coffee/mockup-2.png",
    ],
  },
  "oreum-black-pork": {
    logoImage: "/assets/images/portfolio/oreum-black-pork/logo.jpg",
    mockupImages: [
      "/assets/images/portfolio/oreum-black-pork/mockup-1.png",
      "/assets/images/portfolio/oreum-black-pork/mockup-2.png",
      "/assets/images/portfolio/oreum-black-pork/mockup-3.png",
    ],
  },
  "les-sens-fleur": {
    logoImage: "/assets/images/portfolio/les-sens-fleur/logo.png",
    mockupImages: [
      "/assets/images/portfolio/les-sens-fleur/mockup-1.png",
      "/assets/images/portfolio/les-sens-fleur/mockup-2.png",
      "/assets/images/portfolio/les-sens-fleur/mockup-3.png",
    ],
  },
  luce: {
    logoImage: "/assets/images/portfolio/luce/logo.png",
    mockupImages: [
      "/assets/images/portfolio/luce/mockup-1.png",
      "/assets/images/portfolio/luce/mockup-2.png",
      "/assets/images/portfolio/luce/mockup-3.png",
    ],
  },
  lueur: {
    logoImage: "/assets/images/portfolio/lueur/logo.png",
    mockupImages: [
      "/assets/images/portfolio/lueur/mockup-1.png",
      "/assets/images/portfolio/lueur/mockup-2.png",
      "/assets/images/portfolio/lueur/mockup-3.png",
      "/assets/images/portfolio/lueur/mockup-4.png",
    ],
  },
  renutre: {
    logoImage: "/assets/images/portfolio/renutre/logo.png",
    mockupImages: [
      "/assets/images/portfolio/renutre/mockup-1.png",
      "/assets/images/portfolio/renutre/mockup-2.png",
      "/assets/images/portfolio/renutre/mockup-3.png",
      "/assets/images/portfolio/renutre/mockup-4.png",
      "/assets/images/portfolio/renutre/mockup-5.png",
      "/assets/images/portfolio/renutre/mockup-6.png",
    ],
  },
  urbanvibe: {
    logoImage: "/assets/images/portfolio/urbanvibe/logo.png",
    mockupImages: [
      "/assets/images/portfolio/urbanvibe/mockup-1.png",
      "/assets/images/portfolio/urbanvibe/mockup-2.png",
      "/assets/images/portfolio/urbanvibe/mockup-3.png",
    ],
  },
  neulbom: {
    logoImage: "/assets/images/portfolio/neulbom/logo.png",
    mockupImages: [
      "/assets/images/portfolio/neulbom/mockup-1.png",
      "/assets/images/portfolio/neulbom/mockup-2.png",
      "/assets/images/portfolio/neulbom/mockup-3.png",
      "/assets/images/portfolio/neulbom/mockup-4.png",
      "/assets/images/portfolio/neulbom/mockup-5.png",
      "/assets/images/portfolio/neulbom/mockup-6.png",
    ],
  },
  "daily-ritual": {
    logoImage: "/assets/images/portfolio/daily-ritual/logo.png",
    mockupImages: [
      "/assets/images/portfolio/daily-ritual/mockup-1.png",
      "/assets/images/portfolio/daily-ritual/mockup-2.png",
      "/assets/images/portfolio/daily-ritual/mockup-3.png",
      "/assets/images/portfolio/daily-ritual/mockup-4.png",
      "/assets/images/portfolio/daily-ritual/mockup-5.png",
    ],
  },
  modullogic: {
    logoImage: "/assets/images/portfolio/modullogic/logo.jpeg",
    mockupImages: [
      "/assets/images/portfolio/modullogic/mockup-1.jpeg",
      "/assets/images/portfolio/modullogic/mockup-2.jpeg",
      "/assets/images/portfolio/modullogic/mockup-3.jpeg",
      "/assets/images/portfolio/modullogic/mockup-4.jpeg",
    ],
  },
  ecopulse: {
    logoImage: "/assets/images/portfolio/ecopulse/logo.png",
    mockupImages: [
      "/assets/images/portfolio/ecopulse/mockup-1.png",
      "/assets/images/portfolio/ecopulse/mockup-2.png",
      "/assets/images/portfolio/ecopulse/mockup-3.png",
      "/assets/images/portfolio/ecopulse/mockup-4.png",
      "/assets/images/portfolio/ecopulse/mockup-5.png",
      "/assets/images/portfolio/ecopulse/mockup-6.png",
    ],
  },
  "page-and-quiet": {
    logoImage: "/assets/images/portfolio/page-and-quiet/logo.jpeg",
    mockupImages: [
      "/assets/images/portfolio/page-and-quiet/mockup-1.png",
      "/assets/images/portfolio/page-and-quiet/mockup-2.jpeg",
      "/assets/images/portfolio/page-and-quiet/mockup-3.jpeg",
      "/assets/images/portfolio/page-and-quiet/mockup-4.jpeg",
    ],
  },
  formspace: {
    logoImage: "/assets/images/portfolio/formspace/logo.png",
    mockupImages: [
      "/assets/images/portfolio/formspace/mockup-1.png",
      "/assets/images/portfolio/formspace/mockup-2.png",
      "/assets/images/portfolio/formspace/mockup-3.png",
      "/assets/images/portfolio/formspace/mockup-4.png",
    ],
  },
  viewwave: {
    logoImage: "/assets/images/portfolio/viewwave/logo.jpeg",
    mockupImages: [
      "/assets/images/portfolio/viewwave/mockup-1.jpeg",
      "/assets/images/portfolio/viewwave/mockup-2.jpeg",
      "/assets/images/portfolio/viewwave/mockup-3.jpeg",
    ],
  },
  "somber-tale": {
    logoImage: "/assets/images/portfolio/somber-tale/logo.png",
    mockupImages: [
      "/assets/images/portfolio/somber-tale/mockup-1.jpeg",
      "/assets/images/portfolio/somber-tale/mockup-2.jpeg",
      "/assets/images/portfolio/somber-tale/mockup-3.jpeg",
    ],
  },
  "joy-pocket": {
    logoImage: "/assets/images/portfolio/joy-pocket/logo.png",
    mockupImages: [
      "/assets/images/portfolio/joy-pocket/mockup-1.jpeg",
      "/assets/images/portfolio/joy-pocket/mockup-2.jpeg",
      "/assets/images/portfolio/joy-pocket/mockup-3.jpeg",
    ],
  },
  "tale-factory": {
    logoImage: "/assets/images/portfolio/tale-factory/logo.jpeg",
    mockupImages: [
      "/assets/images/portfolio/tale-factory/mockup-1.jpeg",
      "/assets/images/portfolio/tale-factory/mockup-2.jpeg",
      "/assets/images/portfolio/tale-factory/mockup-3.jpeg",
    ],
  },
  petvogue: {
    logoImage: "/assets/images/portfolio/petvogue/logo.jpg",
    mockupImages: [
      "/assets/images/portfolio/petvogue/mockup-1.png",
      "/assets/images/portfolio/petvogue/mockup-2.png",
      "/assets/images/portfolio/petvogue/mockup-3.png",
      "/assets/images/portfolio/petvogue/mockup-4.png",
      "/assets/images/portfolio/petvogue/mockup-5.png",
      "/assets/images/portfolio/petvogue/mockup-6.png",
    ],
  },
  "prime-bowl": {
    logoImage: "/assets/images/portfolio/prime-bowl/logo.jpg",
    mockupImages: [
      "/assets/images/portfolio/prime-bowl/mockup-1.png",
      "/assets/images/portfolio/prime-bowl/mockup-2.png",
      "/assets/images/portfolio/prime-bowl/mockup-3.png",
      "/assets/images/portfolio/prime-bowl/mockup-4.png",
      "/assets/images/portfolio/prime-bowl/mockup-5.png",
      "/assets/images/portfolio/prime-bowl/mockup-6.png",
    ],
  },
  homeypaw: {
    logoImage: "/assets/images/portfolio/homeypaw/logo.png",
    mockupImages: [
      "/assets/images/portfolio/homeypaw/mockup-1.png",
      "/assets/images/portfolio/homeypaw/mockup-2.png",
      "/assets/images/portfolio/homeypaw/mockup-3.png",
      "/assets/images/portfolio/homeypaw/mockup-4.png",
      "/assets/images/portfolio/homeypaw/mockup-5.png",
    ],
  },
  godash: {
    logoImage: "/assets/images/portfolio/godash/logo.png",
    mockupImages: [
      "/assets/images/portfolio/godash/mockup-1.png",
      "/assets/images/portfolio/godash/mockup-2.png",
      "/assets/images/portfolio/godash/mockup-3.png",
      "/assets/images/portfolio/godash/mockup-4.png",
      "/assets/images/portfolio/godash/mockup-5.png",
    ],
  },
  voyagemate: {
    logoImage: "/assets/images/portfolio/voyagemate/logo.jpg",
    mockupImages: [
      "/assets/images/portfolio/voyagemate/mockup-1.png",
      "/assets/images/portfolio/voyagemate/mockup-2.png",
      "/assets/images/portfolio/voyagemate/mockup-3.png",
    ],
  },
  "asset-flow": {
    logoImage: "/assets/images/portfolio/asset-flow/logo.jpeg",
    mockupImages: [
      "/assets/images/portfolio/asset-flow/mockup-1.jpeg",
      "/assets/images/portfolio/asset-flow/mockup-2.jpeg",
      "/assets/images/portfolio/asset-flow/mockup-3.jpeg",
    ],
  },
  connectus: {
    logoImage: "/assets/images/portfolio/connectus/logo.png",
    mockupImages: [
      "/assets/images/portfolio/connectus/mockup-1.png",
      "/assets/images/portfolio/connectus/mockup-2.png",
      "/assets/images/portfolio/connectus/mockup-3.png",
    ],
  },
  skillupbase: {
    logoImage: "/assets/images/portfolio/skillupbase/logo.jpg",
    mockupImages: [
      "/assets/images/portfolio/skillupbase/mockup-1.png",
      "/assets/images/portfolio/skillupbase/mockup-2.png",
      "/assets/images/portfolio/skillupbase/mockup-3.png",
      "/assets/images/portfolio/skillupbase/mockup-4.png",
      "/assets/images/portfolio/skillupbase/mockup-5.png",
      "/assets/images/portfolio/skillupbase/mockup-6.png",
    ],
  },
  framedesign: {
    logoImage: "/assets/images/portfolio/framedesign/logo.png",
    mockupImages: [
      "/assets/images/portfolio/framedesign/mockup-1.png",
      "/assets/images/portfolio/framedesign/mockup-2.png",
      "/assets/images/portfolio/framedesign/mockup-3.png",
      "/assets/images/portfolio/framedesign/mockup-4.png",
      "/assets/images/portfolio/framedesign/mockup-5.png",
    ],
  },
  "aegis-partners": {
    logoImage: "/assets/images/portfolio/aegis-partners/logo.jpeg",
    mockupImages: [
      "/assets/images/portfolio/aegis-partners/mockup-1.jpeg",
      "/assets/images/portfolio/aegis-partners/mockup-2.jpeg",
      "/assets/images/portfolio/aegis-partners/mockup-3.jpeg",
      "/assets/images/portfolio/aegis-partners/mockup-4.jpeg",
      "/assets/images/portfolio/aegis-partners/mockup-5.jpeg",
    ],
  },
  muscleart: {
    logoImage: "/assets/images/portfolio/muscleart/logo.png",
    mockupImages: [
      "/assets/images/portfolio/muscleart/mockup-1.png",
      "/assets/images/portfolio/muscleart/mockup-2.png",
      "/assets/images/portfolio/muscleart/mockup-3.png",
      "/assets/images/portfolio/muscleart/mockup-4.png",
    ],
  },
  "hub-lounge": {
    logoImage: "/assets/images/portfolio/hub-lounge/logo.jpeg",
    mockupImages: [
      "/assets/images/portfolio/hub-lounge/mockup-1.jpeg",
      "/assets/images/portfolio/hub-lounge/mockup-2.jpeg",
      "/assets/images/portfolio/hub-lounge/mockup-3.jpeg",
      "/assets/images/portfolio/hub-lounge/mockup-4.jpeg",
      "/assets/images/portfolio/hub-lounge/mockup-5.jpeg",
    ],
  },
};

PUBLIC_PORTFOLIO_ITEMS.forEach((item) => {
  Object.assign(item, PUBLIC_PORTFOLIO_ASSETS[item.id] || {});
});

const PUBLIC_PORTFOLIO_CATEGORIES = [
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

document.addEventListener("DOMContentLoaded", () => {
  initPortfolioPage();
  initPortfolioModal();
  initDesignRequestForm();
  syncPortfolioRouteOnLoad();
});

function syncPortfolioRouteOnLoad() {
  if (
    window.location.hash.startsWith("#/portfolio/") &&
    typeof window.openPortfolioDetailFromRoute === "function"
  ) {
    window.openPortfolioDetailFromRoute(window.location.hash);
  }
}

function initPortfolioPage() {
  const filterBar = document.getElementById("portfolio-filter-bar");
  const emptyReset = document.getElementById("portfolio-empty-reset");
  if (!filterBar) return;

  filterBar.innerHTML = PUBLIC_PORTFOLIO_CATEGORIES.map(
    (category) =>
      '<button type="button" class="portfolio-filter-btn" data-category="' +
      category +
      '">' +
      category +
      "</button>",
  ).join("");

  filterBar.addEventListener("click", (event) => {
    const button = event.target.closest(".portfolio-filter-btn");
    if (!button) return;
    const category = button.dataset.category;
    const hash =
      category === "전체"
        ? "#/portfolio"
        : "#/portfolio?category=" + encodeURIComponent(category);
    window.location.hash = hash;
  });

  if (emptyReset) {
    emptyReset.addEventListener("click", () => {
      window.location.hash = "#/portfolio";
    });
  }

  window.renderPortfolioPage(window.location.hash || "#/portfolio");
}

window.renderPortfolioPage = function renderPortfolioPage(hash) {
  const grid = document.getElementById("portfolio-list-grid");
  const empty = document.getElementById("portfolio-empty-state");
  const filterButtons = document.querySelectorAll(".portfolio-filter-btn");
  if (!grid) return;

  const category = getPortfolioCategoryFromHash(hash);
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.category === category);
  });

  const items =
    category === "전체"
      ? PUBLIC_PORTFOLIO_ITEMS
      : PUBLIC_PORTFOLIO_ITEMS.filter((item) => item.category === category);

  grid.innerHTML = items.map((item) => createPortfolioCard(item)).join("");
  if (empty) empty.hidden = items.length !== 0;

  grid.querySelectorAll(".portfolio-list-card").forEach((card) => {
    card.addEventListener("click", () => {
      window.location.hash = "#/portfolio/" + card.dataset.id;
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        window.location.hash = "#/portfolio/" + card.dataset.id;
      }
    });
  });
};

function createPortfolioCard(item) {
  const surface = item.surface || "#F4F1EA";
  const logoMarkup = item.logoImage
    ? '<img class="portfolio-card-logo" src="' +
      item.logoImage +
      '" alt="' +
      escapeAttribute(item.brandName) +
      ' 로고">'
    : '<span class="portfolio-placeholder-brand">' +
      item.thumbnailLabel +
      "</span>";

  return (
    '<button type="button" class="portfolio-list-card" data-id="' +
    item.id +
    '" aria-label="' +
    item.brandName +
    ' 상세보기">' +
    '<div class="portfolio-placeholder" style="--tile-bg:' +
    surface +
    "; --tile-accent:" +
    item.colors[0] +
    '">' +
    logoMarkup +
    "</div>" +
    "</button>"
  );
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function getPortfolioCategoryFromHash(hash) {
  const queryIndex = hash.indexOf("?");
  if (queryIndex === -1) return "전체";
  const params = new URLSearchParams(hash.slice(queryIndex + 1));
  return params.get("category") || "전체";
}

function initPortfolioModal() {
  const modal = document.getElementById("portfolio-detail-modal");
  if (!modal) return;

  modal.querySelectorAll("[data-portfolio-close]").forEach((element) => {
    element.addEventListener("click", closePortfolioDetailModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("active")) {
      closePortfolioDetailModal();
    }
  });

  const topButton = document.getElementById("portfolio-detail-top");
  if (topButton) {
    topButton.addEventListener("click", () => {
      const scroller = document.getElementById("portfolio-detail-scroll");
      if (scroller) scroller.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const scroller = document.getElementById("portfolio-detail-scroll");
  if (scroller) {
    scroller.addEventListener("scroll", updatePortfolioDetailScrollState, {
      passive: true,
    });
  }

  modal
    .querySelectorAll('.portfolio-detail-sidebar a[href^="#"]')
    .forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        event.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        const scroller = document.getElementById("portfolio-detail-scroll");
        if (target && scroller) {
          scroller.scrollTo({ top: target.offsetTop, behavior: "smooth" });
        }
      });
    });
}

window.openPortfolioDetailFromRoute = function openPortfolioDetailFromRoute(
  hash,
) {
  const id = decodeURIComponent(hash.replace("#/portfolio/", "").split("?")[0]);
  const item = PUBLIC_PORTFOLIO_ITEMS.find((entry) => entry.id === id);
  const modal = document.getElementById("portfolio-detail-modal");
  if (!modal) return;

  if (!item) {
    alert("해당 포트폴리오를 찾을 수 없습니다.");
    window.location.hash = "#/portfolio";
    return;
  }

  const badge = document.getElementById("portfolio-detail-badge");
  if (badge) {
    badge.innerHTML = item.logoImage
      ? '<img src="' +
        item.logoImage +
        '" alt="' +
        escapeAttribute(item.brandName) +
        ' 로고">'
      : "<span>" + item.brandName.slice(0, 2).toUpperCase() + "</span>";
  }
  document.getElementById("portfolio-detail-category").textContent =
    item.category;
  document.getElementById("portfolio-detail-title").textContent =
    item.brandName;
  const summaryElement = document.getElementById("portfolio-detail-summary");
  if (summaryElement) summaryElement.textContent = item.summary;
  document.getElementById("portfolio-detail-story").textContent = item.story;
  document.getElementById("portfolio-detail-fonts").textContent =
    item.fonts.join(" / ");

  const logoContainer = document.getElementById("portfolio-detail-logo");
  if (logoContainer) {
    logoContainer.innerHTML = item.logoImage
      ? '<img src="' +
        item.logoImage +
        '" alt="' +
        escapeAttribute(item.brandName) +
        ' 로고">'
      : '<span id="portfolio-detail-logo-label">' +
        item.thumbnailLabel +
        "</span>";
  }

  document.getElementById("portfolio-detail-colors").innerHTML = item.colors
    .map(
      (color) =>
        '<div class="portfolio-color-chip" style="--chip-color:' +
        color +
        '">' +
        "<span>" +
        color +
        "</span>" +
        "</div>",
    )
    .join("");

  const mockupList = document.getElementById("portfolio-detail-mockups-list");
  if (mockupList) {
    const mockups = item.mockupImages || [];
    mockupList.innerHTML = mockups.length
      ? mockups
          .map(
            (image, index) =>
              '<img class="portfolio-mockup-image" src="' +
              image +
              '" alt="' +
              escapeAttribute(item.brandName) +
              " 패키지 목업 " +
              (index + 1) +
              '">',
          )
          .join("")
      : '<div class="portfolio-blank-visual portfolio-blank-wide"></div><div class="portfolio-blank-visual portfolio-blank-tall"></div><div class="portfolio-blank-visual portfolio-blank-wide muted"></div>';
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  lockPortfolioBackgroundScroll();
  const scroller = document.getElementById("portfolio-detail-scroll");
  if (scroller) scroller.scrollTop = 0;
  updatePortfolioDetailScrollState();
};

function updatePortfolioDetailScrollState() {
  const modal = document.getElementById("portfolio-detail-modal");
  const scroller = document.getElementById("portfolio-detail-scroll");
  const mockups = document.getElementById("portfolio-detail-mockups");
  if (!modal || !scroller || !mockups) return;

  const reachedPackage =
    scroller.scrollTop >= Math.max(0, mockups.offsetTop - 96);
  modal.classList.toggle("is-package-visible", reachedPackage);

  const anchors = modal.querySelectorAll(
    '.portfolio-detail-sidebar a[href^="#"]',
  );
  let activeId = "portfolio-detail-logo";
  anchors.forEach((anchor) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target && scroller.scrollTop >= target.offsetTop - 120) {
      activeId = target.id;
    }
  });
  anchors.forEach((anchor) => {
    anchor.classList.toggle(
      "active",
      anchor.getAttribute("href") === "#" + activeId,
    );
  });
}

function lockPortfolioBackgroundScroll() {
  document.body.classList.add("portfolio-modal-open");
}

function unlockPortfolioBackgroundScroll() {
  document.body.classList.remove("portfolio-modal-open");
}

function closePortfolioDetailModal() {
  const modal = document.getElementById("portfolio-detail-modal");
  if (!modal) return;
  modal.classList.remove("active", "is-package-visible");
  modal.setAttribute("aria-hidden", "true");
  unlockPortfolioBackgroundScroll();
  if (window.location.hash.startsWith("#/portfolio/")) {
    window.location.hash = "#/portfolio";
  }
}

function initDesignRequestForm() {
  const form = document.getElementById("design-request-form");
  if (!form) return;

  setupRequestBrandPicker(form);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearRequestErrors(form);

    const payload = {
      name: form.name.value.trim(),
      email: getRequestEmailValue(form),
      phone: form.phone ? form.phone.value.trim() : "",
      brandName: getRequestSelectedBrandNames().join(", "),
      content: form.content.value.trim(),
      privacyAgreed: form.privacyAgreed.checked,
    };

    const validation = validateDesignRequestClient(payload);
    if (!validation.valid) {
      showRequestErrors(form, validation.errors);
      return;
    }

    const submitButton = document.getElementById("request-submit-btn");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "제출 중...";
      submitButton.setAttribute("aria-busy", "true");
    }

    try {
      const response = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("request failed");

      const submittedName = payload.name || "고객";
      form.reset();
      resetRequestBrandPicker();
      showRequestSuccessState(submittedName);
    } catch (error) {
      alert("현재는 의뢰 API 준비 중입니다. 입력 내용은 유지됩니다.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML =
          '<span>의뢰 전송</span><span aria-hidden="true">↗</span>';
        submitButton.removeAttribute("aria-busy");
      }
    }
  });
}

function showRequestSuccessState(name) {
  const form = document.getElementById("design-request-form");
  const copy = document.querySelector(".request-form-panel .request-copy");
  const successState = document.getElementById("request-success-state");
  const successName = document.getElementById("request-success-name");

  if (!form || !successState) return;
  if (successName) successName.textContent = name || "고객";
  if (copy) {
    copy.hidden = true;
    copy.style.display = "none";
  }
  form.hidden = true;
  form.style.display = "none";
  successState.hidden = false;
  successState.style.display = "block";
}

function resetRequestSuccessState() {
  const form = document.getElementById("design-request-form");
  const copy = document.querySelector(".request-form-panel .request-copy");
  const successState = document.getElementById("request-success-state");

  if (copy) {
    copy.hidden = false;
    copy.style.removeProperty("display");
  }
  if (form) {
    form.hidden = false;
    form.style.removeProperty("display");
  }
  if (successState) {
    successState.hidden = true;
    successState.style.removeProperty("display");
  }
}

window.addEventListener("hashchange", () => {
  if (window.location.hash === "#/request") resetRequestSuccessState();
});

const requestSelectedBrands = new Map();

function setupRequestBrandPicker(form) {
  const addButton = document.getElementById("request-brand-add-btn");
  const modal = document.getElementById("request-brand-modal");
  const closeButton = document.getElementById("request-brand-modal-close");
  const backdrop = modal?.querySelector("[data-request-brand-close]");
  const picker = document.getElementById("request-brand-picker");

  picker?.querySelectorAll("[data-request-brand-name]").forEach((card) => {
    const brandName =
      card.dataset.requestBrandName ||
      card.querySelector("strong")?.textContent ||
      "";
    if (brandName)
      requestSelectedBrands.set(brandName, {
        brand_name: brandName,
        slogan: card.querySelector("small")?.textContent || "",
      });
  });
  syncRequestBrandField();

  if (addButton && !addButton.dataset.bound) {
    addButton.dataset.bound = "true";
    addButton.addEventListener("click", () => openRequestBrandModal());
  }

  if (closeButton && !closeButton.dataset.bound) {
    closeButton.dataset.bound = "true";
    closeButton.addEventListener("click", closeRequestBrandModal);
  }

  if (backdrop && !backdrop.dataset.bound) {
    backdrop.dataset.bound = "true";
    backdrop.addEventListener("click", closeRequestBrandModal);
  }

  if (modal && !modal.dataset.escapeBound) {
    modal.dataset.escapeBound = "true";
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("active"))
        closeRequestBrandModal();
    });
  }

  if (form && !form.dataset.brandPickerBound) {
    form.dataset.brandPickerBound = "true";
    form.addEventListener("click", (event) => {
      const removeButton = event.target.closest("[data-request-brand-remove]");
      if (removeButton) {
        event.preventDefault();
        event.stopPropagation();
        removeRequestBrandCard(removeButton.dataset.requestBrandRemove || "");
        return;
      }

      const card = event.target.closest(".request-brand-card");
      if (!card || !picker?.contains(card)) return;
      picker
        .querySelectorAll(".request-brand-card")
        .forEach((item) => item.classList.remove("active"));
      card.classList.add("active");
    });
  }
}

async function openRequestBrandModal() {
  const modal = document.getElementById("request-brand-modal");
  const list = document.getElementById("request-brand-modal-list");
  const empty = document.getElementById("request-brand-modal-empty");
  if (!modal || !list || !empty) return;

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  list.innerHTML =
    '<div class="request-brand-modal-loading">브랜드 목록을 불러오는 중입니다...</div>';
  empty.hidden = true;

  const brands = await loadRequestAvailableBrands();
  list.innerHTML = "";

  const selectableBrands = brands.filter(
    (brand) => brand.brand_name && !requestSelectedBrands.has(brand.brand_name),
  );
  if (selectableBrands.length === 0) {
    empty.hidden = false;
    return;
  }

  selectableBrands.forEach((brand) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "request-brand-select-card";
    button.innerHTML = buildRequestBrandSelectCardHtml(brand);
    button.addEventListener("click", () => {
      addRequestBrandCard(brand);
      closeRequestBrandModal();
    });
    list.appendChild(button);
  });
}

function closeRequestBrandModal() {
  const modal = document.getElementById("request-brand-modal");
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

async function loadRequestAvailableBrands() {
  const combined = [];

  try {
    const res = await fetch("/api/brand/list");
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.brands))
        combined.push(...data.brands);
    }
  } catch (error) {
    console.warn("Brand list fetch warning:", error);
  }

  try {
    const stored = localStorage.getItem(getRequestScopedBrandStorageKey());
    const localBrands = stored ? JSON.parse(stored) : [];
    if (Array.isArray(localBrands)) {
      localBrands.forEach((localItem) => {
        const exists = combined.some(
          (item) =>
            String(item.id || "") === String(localItem.id || "") ||
            item.brand_name === localItem.brand_name,
        );
        if (!exists) combined.push(localItem);
      });
    }
  } catch (error) {
    console.warn("Local brand list parse warning:", error);
  }

  return combined;
}

function getRequestScopedBrandStorageKey() {
  const auth = window.brandingFitAuth || {};
  const userId = auth.authenticated && auth.user ? auth.user.id : null;
  return userId
    ? "branding_fit_saved_brands:user:" + userId
    : "branding_fit_saved_brands:guest";
}

function addRequestBrandCard(brand) {
  const picker = document.getElementById("request-brand-picker");
  if (!picker || !brand?.brand_name) return;

  requestSelectedBrands.set(brand.brand_name, brand);
  const card = document.createElement("div");
  card.className = "request-brand-card active";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.dataset.requestBrandName = brand.brand_name;
  card.setAttribute("aria-label", brand.brand_name + " 브랜드 선택");
  card.innerHTML = buildRequestBrandCardHtml(brand);

  picker
    .querySelectorAll(".request-brand-card")
    .forEach((item) => item.classList.remove("active"));
  picker.appendChild(card);
  syncRequestBrandField();
}

function removeRequestBrandCard(brandName) {
  if (!brandName) return;
  const picker = document.getElementById("request-brand-picker");
  requestSelectedBrands.delete(brandName);
  picker?.querySelectorAll(".request-brand-card").forEach((card) => {
    if (card.dataset.requestBrandName === brandName) card.remove();
  });
  syncRequestBrandField();
}

function resetRequestBrandPicker() {
  const picker = document.getElementById("request-brand-picker");
  if (!picker) return;
  picker
    .querySelectorAll(".request-brand-card")
    .forEach((card) => card.remove());
  requestSelectedBrands.clear();
  syncRequestBrandField();
}

function syncRequestBrandField() {
  const hidden = document.getElementById("request-brand-name");
  if (hidden) hidden.value = getRequestSelectedBrandNames().join(", ");
}

function getRequestSelectedBrandNames() {
  return Array.from(requestSelectedBrands.keys()).filter(Boolean);
}

function buildRequestBrandCardHtml(brand) {
  const name = escapeRequestHtml(brand.brand_name || "Brand");
  const slogan = escapeRequestHtml(
    brand.slogan || brand.industry || "생성된 브랜드",
  );
  const logoUrl = brand.logo_url ? escapeRequestHtml(brand.logo_url) : "";
  const initials = escapeRequestHtml(
    String(brand.brand_name || "BF")
      .slice(0, 2)
      .toUpperCase(),
  );
  const mark = logoUrl
    ? "<img src=" + quoteAttr(logoUrl) + " alt=" + quoteAttr("") + " />"
    : "<span>" + initials + "</span>";
  return [
    "<button type=" +
      quoteAttr("button") +
      " class=" +
      quoteAttr("request-brand-remove") +
      " data-request-brand-remove=" +
      quoteAttr(name) +
      " aria-label=" +
      quoteAttr(name + " 브랜드 삭제") +
      ">&times;</button>",
    "<span class=" + quoteAttr("request-brand-mark") + ">" + mark + "</span>",
    "<strong>" + name + "</strong>",
    "<small>" + slogan + "</small>",
  ].join("");
}

function buildRequestBrandSelectCardHtml(brand) {
  const name = escapeRequestHtml(brand.brand_name || "Brand");
  const industry = escapeRequestHtml(brand.industry || "일반");
  const slogan = escapeRequestHtml(brand.slogan || "생성된 브랜드입니다.");
  const logoUrl = brand.logo_url ? escapeRequestHtml(brand.logo_url) : "";
  const initials = escapeRequestHtml(
    String(brand.brand_name || "BF")
      .slice(0, 2)
      .toUpperCase(),
  );
  const mark = logoUrl
    ? "<img src=" + quoteAttr(logoUrl) + " alt=" + quoteAttr("") + " />"
    : "<span>" + initials + "</span>";
  return [
    "<span class=" +
      quoteAttr("request-brand-select-mark") +
      ">" +
      mark +
      "</span>",
    "<span class=" + quoteAttr("request-brand-select-copy") + ">",
    "<strong>" + name + "</strong>",
    "<small>" + industry + "</small>",
    "<em>" + slogan + "</em>",
    "</span>",
  ].join("");
}

function quoteAttr(value) {
  return String.fromCharCode(34) + value + String.fromCharCode(34);
}

function escapeRequestHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getRequestEmailValue(form) {
  const localPart = form.email.value.trim();
  const domain = form.emailDomain ? form.emailDomain.value.trim() : "";
  if (!domain || domain === "direct" || localPart.includes("@"))
    return localPart;
  return localPart ? localPart + "@" + domain : "";
}

function validateDesignRequestClient(data) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.name) errors.name = "필수 입력 항목입니다.";
  if (!data.email || !emailPattern.test(data.email))
    errors.email = "올바른 이메일을 입력해 주세요.";
  if (!data.content) errors.content = "필수 입력 항목입니다.";
  if (!data.privacyAgreed) errors.privacyAgreed = "동의가 필요합니다.";
  return { valid: Object.keys(errors).length === 0, errors };
}

function clearRequestErrors(form) {
  form.querySelectorAll(".form-error").forEach((element) => {
    element.textContent = "";
  });
  form.querySelectorAll(".is-invalid").forEach((element) => {
    element.classList.remove("is-invalid");
  });
  form.querySelectorAll("[aria-describedby]").forEach((element) => {
    element.removeAttribute("aria-describedby");
  });
}

function showRequestErrors(form, errors) {
  const firstKey = Object.keys(errors)[0];
  Object.entries(errors).forEach(([key, message]) => {
    const input = form.elements[key];
    const error = document.getElementById("request-" + key + "-error");
    if (error) error.textContent = message;
    if (input) {
      input.classList.add("is-invalid");
      input.setAttribute("aria-describedby", "request-" + key + "-error");
    }
  });

  if (firstKey && form.elements[firstKey]) {
    form.elements[firstKey].focus();
    form.elements[firstKey].scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}
