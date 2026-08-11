const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('server mounts design request API route', () => {
    const server = fs.readFileSync(path.join(root, 'src/server.js'), 'utf8');
    assert.match(server, /requestRouter/);
    assert.match(server, /app\.use\('\/api\/request'/);
});

test('database initializes design request table', () => {
    const database = fs.readFileSync(path.join(root, 'src/config/database.js'), 'utf8');
    assert.match(database, /CREATE TABLE IF NOT EXISTS design_requests/);
    assert.match(database, /privacy_agreed/);
    assert.match(database, /brand_name VARCHAR\(100\)/);
});

test('request route validates and inserts design requests', () => {
    const route = fs.readFileSync(path.join(root, 'src/routes/request.js'), 'utf8');
    assert.match(route, /validateDesignRequest/);
    assert.match(route, /INSERT INTO design_requests/);
    assert.match(route, /router\.post\('\/'/);
});

test('chatbot route uses Hugging Face as the only AI provider', () => {
    const route = fs.readFileSync(path.join(root, 'src/routes/chatbot.js'), 'utf8');
    assert.match(route, /generateHuggingFaceText/);
    assert.doesNotMatch(route, /generateGeminiText/);
    assert.doesNotMatch(route, /OPENAI_API_KEY/);
    assert.doesNotMatch(route, /callOpenAIChat/);
});


test('workspace generation pipeline uses Hugging Face for text and images', () => {
    const huggingFace = fs.readFileSync(path.join(root, 'src/services/huggingFace.js'), 'utf8');
    const prompts = fs.readFileSync(path.join(root, 'src/services/brandPrompts.js'), 'utf8');
    const brandRoute = fs.readFileSync(path.join(root, 'src/routes/brand.js'), 'utf8');
    const logoRoute = fs.readFileSync(path.join(root, 'src/routes/logo.js'), 'utf8');
    const workspace = fs.readFileSync(path.join(root, 'public/js/workspace.js'), 'utf8');
    const database = fs.readFileSync(path.join(root, 'src/config/database.js'), 'utf8');

    assert.match(huggingFace, /generateHuggingFaceImage/);
    assert.match(huggingFace, /generateHuggingFaceJson/);
    assert.match(huggingFace, /generateHuggingFaceText/);
    assert.match(huggingFace, /HUGGINGFACE_API_TOKEN/);
    assert.match(huggingFace, /HF_IMAGE_MODEL/);
    assert.match(huggingFace, /HF_TEXT_MODEL/);
    assert.match(huggingFace, /HF_IMAGE_PROVIDER/);
    assert.match(huggingFace, /DEFAULT_HF_IMAGE_PROVIDER = process\.env\.HF_IMAGE_PROVIDER \|\| 'fal-ai'/);
    assert.match(huggingFace, /InferenceClient/);
    assert.match(huggingFace, /textToImage/);
    assert.match(huggingFace, /imageToImage/);
    assert.doesNotMatch(huggingFace, /imageTextToImage/);
    assert.match(huggingFace, /generateHuggingFaceImageEdit/);
    assert.match(huggingFace, /HF_MOCKUP_IMAGE_MODEL/);
    assert.match(huggingFace, /provider:\s*DEFAULT_HF_IMAGE_PROVIDER/);
    assert.match(huggingFace, /model:\s*DEFAULT_HF_IMAGE_MODEL/);
    assert.match(huggingFace, /model = DEFAULT_HF_IMAGE_EDIT_MODEL/);
    assert.doesNotMatch(huggingFace, /HF_IMAGE_PROVIDER_MODEL/);
    assert.doesNotMatch(huggingFace, /api-inference\.huggingface\.co/);
    assert.match(huggingFace, /router\.huggingface\.co\/v1\/chat\/completions/);
    assert.match(prompts, /buildLogoPrompt/);
    assert.match(prompts, /Do not use Chinese characters/);
    assert.match(prompts, /buildMockupPrompt/);
    assert.match(prompts, /Use the provided input image as the exact brand logo reference/);
    assert.match(prompts, /physically printed, embossed, foil-stamped, engraved, or screen-printed/);
    assert.doesNotMatch(prompts, /ready for logo compositing/);
    assert.match(prompts, /buildGuidebookPrompt/);
    assert.match(brandRoute, /generateHuggingFaceJson/);
    assert.match(brandRoute, /buildGuidebookPrompt/);
    assert.doesNotMatch(brandRoute, /generateGeminiJson/);
    assert.doesNotMatch(brandRoute, /Gemini/);
    assert.doesNotMatch(brandRoute, /generateMockDNA/);
    assert.match(logoRoute, /generateHuggingFaceImage/);
    assert.match(logoRoute, /generateHuggingFaceImageEdit/);
    assert.doesNotMatch(logoRoute, /createTemplateLogo/);
    assert.doesNotMatch(logoRoute, /buildTemplateLogoSvg/);
    assert.match(logoRoute, /buildMockupPrompt/);
    assert.match(logoRoute, /resolvePublicAsset\(logo_url\)/);
    assert.match(logoRoute, /router\.post\('\/mockups'/);
    assert.doesNotMatch(logoRoute, /createMockupWithLogo/);
    assert.doesNotMatch(logoRoute, /buildMockupTemplateSvg/);
    assert.doesNotMatch(logoRoute, /getPhotoMockupBackgroundPath/);
    assert.doesNotMatch(logoRoute, /backgroundDataUri/);
    assert.match(logoRoute, /provider:\s*'huggingface'/);
    const mockupRoute = logoRoute.slice(logoRoute.indexOf("router.post('/mockups'"));
    assert.match(mockupRoute, /generateHuggingFaceImageEdit/);
    assert.doesNotMatch(logoRoute, /base_mockup_image_url/);
    assert.doesNotMatch(logoRoute, /generateGeminiImage/);
    assert.doesNotMatch(logoRoute, /readPublicAssetAsInlineData/);
    assert.match(workspace, /\/api\/logo\/mockups/);
    assert.match(workspace, /mockup_image_url/);
    assert.match(workspace, /renderInlineLogoMockup/);
    assert.match(database, /mockup_urls TEXT/);
    assert.match(database, /guidebook_content TEXT/);
});


test('Gemini service is not used for generation', () => {
    const services = fs.readdirSync(path.join(root, 'src/services'));
    const brandRoute = fs.readFileSync(path.join(root, 'src/routes/brand.js'), 'utf8');
    const chatbotRoute = fs.readFileSync(path.join(root, 'src/routes/chatbot.js'), 'utf8');

    assert.doesNotMatch(services.join('\n'), /^gemini\.js$/m);
    assert.doesNotMatch(brandRoute, /services\/gemini/);
    assert.doesNotMatch(chatbotRoute, /services\/gemini/);
});


test('request route exposes authenticated request archive', () => {
    const route = fs.readFileSync(path.join(root, 'src/routes/request.js'), 'utf8');
    const database = fs.readFileSync(path.join(root, 'src/config/database.js'), 'utf8');

    assert.ok(route.includes("router.get('/list'"));
    assert.match(route, /로그인이 필요합니다/);
    assert.ok(route.includes('WHERE user_id = ?'));
    assert.match(route, /SELECT id, name, email, phone, brand_name, attachment_name, content, status, created_at/);
    assert.ok(route.includes('phone ? String(phone).trim() : null'));
    assert.ok(route.includes("brandName ? String(brandName).trim() : null"));
    assert.ok(database.includes("addColumnIfMissing('design_requests', 'phone'"));
    assert.ok(database.includes("addColumnIfMissing('design_requests', 'brand_name'"));
});

test('brand PDF embeds project Korean fonts and UTF-8 filename headers', () => {
    const brandRoute = fs.readFileSync(path.join(root, 'src/routes/brand.js'), 'utf8');

    assert.match(brandRoute, /Pretendard-Regular\.otf/);
    assert.match(brandRoute, /Pretendard-Bold\.otf/);
    assert.match(brandRoute, /getKoreanFontPath\(isBold\)/);
    assert.match(brandRoute, /filename\*=UTF-8/);
    assert.doesNotMatch(brandRoute, /isAsciiText/);
    assert.ok(fs.existsSync(path.join(root, 'src/assets/fonts/Pretendard-Regular.otf')));
    assert.ok(fs.existsSync(path.join(root, 'src/assets/fonts/Pretendard-Bold.otf')));
});
