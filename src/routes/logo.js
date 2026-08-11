const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const { buildLogoPrompt, buildMockupPrompt } = require('../services/brandPrompts');
const {
    generateHuggingFaceImage,
    generateHuggingFaceImageEdit,
    getHuggingFaceErrorMessage,
    getHuggingFaceErrorStatus
} = require('../services/huggingFace');

const router = express.Router();

const PUBLIC_DIR = path.join(__dirname, '../../public');
const GENERATED_DIR = path.join(PUBLIC_DIR, 'assets/images/generated');
const GENERATED_PUBLIC_DIR = '/assets/images/generated';
if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

function logPromptHistory(filename, brandName, industry, prompt) {
    const logFilePath = path.join(__dirname, '../../이미지_프롬프트_내역.md');
    const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    const logLine = `| ${now} | \`${filename}\` | ${brandName} | ${industry} | ${prompt.replace(/\|/g, '\\|').replace(/\n/g, ' ')} |\n`;

    try {
        fs.appendFileSync(logFilePath, logLine, 'utf8');
    } catch (err) {
        console.error('❌ Failed to write prompt log history:', err.message);
    }
}

function resolvePublicAsset(publicPath) {
    const cleanPath = String(publicPath || '').split('?')[0];
    if (!cleanPath.startsWith('/')) return null;
    const absolutePath = path.normalize(path.join(PUBLIC_DIR, cleanPath));
    if (!absolutePath.startsWith(PUBLIC_DIR + path.sep)) return null;
    return fs.existsSync(absolutePath) ? absolutePath : null;
}

function updateBrandLogoDb(brandId, logoUrl) {
    if (!brandId) return;
    db.run('UPDATE brands SET logo_url = ? WHERE id = ?', [logoUrl, brandId], (err) => {
        if (err) console.error('❌ Failed to update logo_url in database:', err.message);
    });
}

function updateBrandMockupsDb(brandId, mockups) {
    if (!brandId) return;
    db.run('UPDATE brands SET mockup_urls = ? WHERE id = ?', [JSON.stringify(mockups), brandId], (err) => {
        if (err) console.error('❌ Failed to update mockup_urls in database:', err.message);
    });
}

router.post('/generate', async (req, res) => {
    const { brand_id, brand_name, industry, primary_color, secondary_color, style, dna } = req.body;

    if (!brand_name) {
        return res.status(400).json({ success: false, error: '브랜드 이름은 필수 입력 항목입니다.' });
    }

    const normalizedDna = dna || {
        primary_color,
        secondary_color,
        point_color: primary_color,
        slogan: '',
        persona: ''
    };

    const prompt = buildLogoPrompt({
        brand_name,
        industry: industry || '일반',
        dna: normalizedDna,
        style
    });

    try {
        const result = await generateHuggingFaceImage({
            prompt,
            outputDir: GENERATED_DIR,
            publicDir: GENERATED_PUBLIC_DIR,
            filenamePrefix: 'logo_' + (brand_id || 'temp'),
            width: 1024,
            height: 1024
        });

        const filename = path.basename(result.filePath);
        logPromptHistory(filename, brand_name, industry || '일반', prompt);
        updateBrandLogoDb(brand_id, result.publicPath);

        return res.json({
            success: true,
            logo_url: result.publicPath,
            is_mock: false,
            provider: result.provider,
            model: result.model,
            prompt
        });
    } catch (err) {
        console.error('❌ Hugging Face logo generation error:', err.message);
        return res.status(getHuggingFaceErrorStatus(err)).json({
            success: false,
            error: getHuggingFaceErrorMessage(err, 'Hugging Face 로고 생성 중 오류가 발생했습니다.')
        });
    }
});

router.post('/mockups', async (req, res) => {
    const { brand_id, brand_name, industry, dna, logo_url } = req.body;

    if (!brand_name || !logo_url) {
        return res.status(400).json({ success: false, error: '브랜드 이름과 로고 이미지가 필요합니다.' });
    }

    const logoImagePath = resolvePublicAsset(logo_url);
    if (!logoImagePath) {
        return res.status(400).json({ success: false, error: '생성된 로고 파일을 찾을 수 없습니다.' });
    }

    const mockupTypes = [
        { type: 'card', label: '프리미엄 비즈니스 명함' },
        { type: 'bag', label: '친환경 캔버스 에코백' },
        { type: 'cup', label: '시그니처 매트 텀블러' }
    ];

    try {
        const mockups = [];
        for (const item of mockupTypes) {
            const prompt = buildMockupPrompt({
                type: item.type,
                brand_name,
                industry: industry || '일반',
                dna: dna || {}
            });
            const result = await generateHuggingFaceImageEdit({
                prompt,
                imagePath: logoImagePath,
                outputDir: GENERATED_DIR,
                publicDir: GENERATED_PUBLIC_DIR,
                filenamePrefix: 'mockup_' + item.type + '_' + (brand_id || 'temp'),
                width: 1024,
                height: 768
            });

            const filename = path.basename(result.filePath);
            logPromptHistory(filename, brand_name, industry || '일반', prompt);
            mockups.push({
                type: item.type,
                label: item.label,
                mockup_image_url: result.publicPath,
                logo_url,
                prompt,
                provider: result.provider,
                model: result.model
            });
        }

        updateBrandMockupsDb(brand_id, mockups);
        return res.json({
            success: true,
            provider: 'huggingface',
            is_mock: false,
            mockups
        });
    } catch (err) {
        console.error('❌ Hugging Face logo mockup generation error:', err.message);
        return res.status(getHuggingFaceErrorStatus(err)).json({
            success: false,
            error: getHuggingFaceErrorMessage(err, 'Hugging Face 목업 생성 중 오류가 발생했습니다.')
        });
    }
});

module.exports = router;
