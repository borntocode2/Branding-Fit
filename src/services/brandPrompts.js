function stringifyKeywords(keywords) {
    if (Array.isArray(keywords)) return keywords.join(', ');
    return keywords || '없음';
}

function buildBrandDnaPrompt({ brand_name, industry, keywords, usp, target_age }) {
    return `브랜드명: ${brand_name}
업종: ${industry}
키워드: ${stringifyKeywords(keywords)}
USP/강점: ${usp || '입력 없음'}
타깃 연령: ${target_age || '전 연령층'}

위 정보를 바탕으로 실제 창업자가 바로 사용할 수 있는 브랜드 DNA를 만들어줘.
반드시 아래 JSON 키만 반환해.
{
  "slogan": "한국어 슬로건 40자 이내",
  "persona": "브랜드 세계관과 성격을 2~3문장으로 설명",
  "primary_color": "#RRGGBB",
  "secondary_color": "#RRGGBB",
  "point_color": "#RRGGBB",
  "font_title": "Google Font 영문명",
  "font_body": "Google Font 영문명"
}`;
}

function buildLogoPrompt({ brand_name, industry, dna, style }) {
    const styleMap = {
        minimal: 'minimal emblem logo, clean geometry, premium whitespace',
        badge: 'premium badge logo, compact seal composition, strong symbol',
        geometric: 'geometric symbol logo, precise vector-like shapes, modern identity',
        typography: 'typographic monogram logo, refined letterform, brand name integrated'
    };

    return `Create a professional finished brand logo image.
Brand name: ${brand_name}
Industry: ${industry}
Slogan: ${dna && dna.slogan ? dna.slogan : ''}
Brand persona: ${dna && dna.persona ? dna.persona : ''}
Logo direction: ${styleMap[style] || styleMap.minimal}
Color palette: primary ${dna && dna.primary_color ? dna.primary_color : '#111827'}, secondary ${dna && dna.secondary_color ? dna.secondary_color : '#F8FAFC'}, accent ${dna && dna.point_color ? dna.point_color : '#4F46E5'}.

Requirements:
- Square 1:1 logo presentation on a clean neutral background.
- Professional Korean startup / small business brand identity quality.
- Make the brand name readable if included.
- Do not use Chinese characters, Japanese characters, Hanzi, Kanji, Hanja, pseudo-Asian glyphs, or any random foreign-looking text.
- If exact brand-name typography is uncertain, prefer a clean symbol-only mark with no extra lettering.
- Avoid random extra words, watermarks, QR codes, UI frames, or mockup scenes.
- Use a polished vector-logo look with precise edges and balanced spacing.`;
}

function buildMockupPrompt({ type, brand_name, industry, dna }) {
    const common = `Use the provided input image as the exact brand logo reference.
Brand name: ${brand_name}
Industry: ${industry}
Slogan: ${dna && dna.slogan ? dna.slogan : ''}
Brand persona: ${dna && dna.persona ? dna.persona : ''}
Color palette: ${dna && dna.primary_color ? dna.primary_color : '#111827'}, ${dna && dna.secondary_color ? dna.secondary_color : '#F8FAFC'}, ${dna && dna.point_color ? dna.point_color : '#4F46E5'}.

Critical logo requirements:
- The provided input image is the only logo that may appear.
- Apply that exact logo to the product surface as if it is physically printed, embossed, foil-stamped, engraved, or screen-printed.
- Preserve the logo's main shape, color relationship, and composition as much as possible.
- Do not invent a different logo, do not add fake text, and do not rewrite the brand name.
- Do not use Chinese characters, Japanese characters, Hanzi, Kanji, Hanja, pseudo-Asian glyphs, or random lettering.`;

    const scenes = {
        card: 'a realistic premium business card on a clean studio table, the provided logo printed on the front card, natural paper grain, soft shadows, commercial product photography',
        bag: 'a realistic canvas tote bag or premium shopping bag mockup, the provided logo screen-printed on the front fabric, natural folds, lifestyle product photography, refined neutral set',
        cup: 'a realistic matte tumbler or takeaway cup mockup, the provided logo printed on the front surface, subtle curvature and lighting, premium studio photography'
    };

    return `${common}

Create a real photographic mockup scene: ${scenes[type] || scenes.card}.
The result must look like a real photographed product, not a flat vector composition, not a UI mockup, and not a blank placeholder.`;
}

function buildGuidebookPrompt(brandData) {
    return `다음 브랜드 데이터를 바탕으로 실무형 브랜드 가이드북 문구를 작성해줘.
브랜드명: ${brandData.brand_name}
업종: ${brandData.industry}
슬로건: ${brandData.slogan || ''}
페르소나: ${brandData.persona || ''}
컬러: Primary ${brandData.primary_color || ''}, Secondary ${brandData.secondary_color || ''}, Point ${brandData.point_color || ''}
폰트: 제목 ${brandData.font_title || ''}, 본문 ${brandData.font_body || ''}

반드시 아래 JSON 키만 반환해.
{
  "brand_overview": "브랜드 핵심 설명 2~3문장",
  "logo_usage": "로고 사용 원칙 2~3문장",
  "color_usage": "컬러 시스템 사용 가이드 2~3문장",
  "typography_usage": "타이포그래피 사용 가이드 2~3문장",
  "mockup_strategy": "명함/패키지/굿즈 적용 전략 2~3문장"
}`;
}

function getBrandDnaSystemInstruction() {
    return 'You are a senior Korean brand strategist. Return only strict JSON. Do not include markdown.';
}

function getGuidebookSystemInstruction() {
    return 'You are a senior Korean brand guideline writer. Return only strict JSON. Do not include markdown.';
}

module.exports = {
    buildBrandDnaPrompt,
    buildGuidebookPrompt,
    buildLogoPrompt,
    buildMockupPrompt,
    getBrandDnaSystemInstruction,
    getGuidebookSystemInstruction
};
