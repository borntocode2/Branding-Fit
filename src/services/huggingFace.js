const fs = require('fs');
const path = require('path');
const { InferenceClient } = require('@huggingface/inference');

const HF_TOKEN_PLACEHOLDER = 'your_huggingface_api_token_here';
const DEFAULT_HF_IMAGE_MODEL = process.env.HF_IMAGE_MODEL || 'black-forest-labs/FLUX.1-schnell';
const DEFAULT_HF_IMAGE_EDIT_MODEL = process.env.HF_MOCKUP_IMAGE_MODEL || process.env.HF_IMAGE_EDIT_MODEL || 'black-forest-labs/FLUX.2-dev';
const DEFAULT_HF_IMAGE_PROVIDER = process.env.HF_IMAGE_PROVIDER || 'fal-ai';
const DEFAULT_HF_TEXT_MODEL = process.env.HF_TEXT_MODEL || 'Qwen/Qwen2.5-7B-Instruct';

function getHuggingFaceToken() {
    const token = process.env.HUGGINGFACE_API_TOKEN || process.env.HF_TOKEN;
    if (!token || token === HF_TOKEN_PLACEHOLDER) {
        return null;
    }
    return token;
}

function createHuggingFaceConfigError() {
    const error = new Error('HUGGINGFACE_API_TOKEN이 설정되어야 AI 생성 기능을 사용할 수 있습니다.');
    error.statusCode = 503;
    return error;
}

function requireHuggingFaceToken() {
    const token = getHuggingFaceToken();
    if (!token) {
        throw createHuggingFaceConfigError();
    }
    return token;
}


function getMimeType(filePath) {
    const extension = path.extname(filePath).toLowerCase();
    if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg';
    if (extension === '.webp') return 'image/webp';
    if (extension === '.svg') return 'image/svg+xml';
    return 'image/png';
}

function getExtensionFromContentType(contentType) {
    if ((contentType || '').includes('jpeg') || (contentType || '').includes('jpg')) return 'jpg';
    if ((contentType || '').includes('webp')) return 'webp';
    return 'png';
}

async function readHuggingFaceError(response) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        const payload = await response.json().catch(() => null);
        if (payload && payload.error) return payload.error;
        if (payload && payload.message) return payload.message;
        return JSON.stringify(payload || {});
    }
    return response.text().catch(() => `Hugging Face image API HTTP ${response.status}`);
}

function stripJsonFence(text) {
    return String(text || '')
        .trim()
        .replace(/^\`\`\`(?:json)?/i, '')
        .replace(/\`\`\`$/i, '')
        .trim();
}

function parseHuggingFaceJson(text) {
    return JSON.parse(stripJsonFence(text));
}

function extractChatText(payload) {
    const choice = payload && Array.isArray(payload.choices) ? payload.choices[0] : null;
    if (choice && choice.message && typeof choice.message.content === 'string') {
        return choice.message.content;
    }
    if (choice && typeof choice.text === 'string') return choice.text;
    return '';
}

async function generateHuggingFaceText({ prompt, systemInstruction, temperature = 0.7 }) {
    const token = requireHuggingFaceToken();
    const model = DEFAULT_HF_TEXT_MODEL;

    const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: 'system', content: systemInstruction || 'You are a helpful AI assistant.' },
                { role: 'user', content: prompt }
            ],
            temperature,
            stream: false
        })
    });

    if (!response.ok) {
        throw new Error(await readHuggingFaceError(response));
    }

    const payload = await response.json();
    const text = extractChatText(payload);
    if (!text) {
        throw new Error('Hugging Face 텍스트 응답이 비어있습니다.');
    }
    return text;
}

async function generateHuggingFaceJson({ prompt, systemInstruction, temperature = 0.4 }) {
    const text = await generateHuggingFaceText({ prompt, systemInstruction, temperature });
    return parseHuggingFaceJson(text);
}

async function generateHuggingFaceImage({
    prompt,
    outputDir,
    publicDir,
    filenamePrefix,
    width = 1024,
    height = 1024
}) {
    const token = requireHuggingFaceToken();
    const model = DEFAULT_HF_IMAGE_MODEL;
    const client = new InferenceClient(token);

    const imageBlob = await client.textToImage({
        provider: DEFAULT_HF_IMAGE_PROVIDER,
        model: DEFAULT_HF_IMAGE_MODEL,
        inputs: prompt,
        parameters: {
            width,
            height,
            num_inference_steps: Number(process.env.HF_IMAGE_STEPS || 4),
            guidance_scale: Number(process.env.HF_IMAGE_GUIDANCE || 3.5),
            negative_prompt: 'watermark, blurry, low quality, extra text, misspelled letters, distorted logo, duplicate logo'
        }
    });

    const contentType = imageBlob.type || 'image/png';
    if (!contentType.startsWith('image/')) {
        throw new Error('Hugging Face 응답이 이미지가 아닙니다.');
    }

    fs.mkdirSync(outputDir, { recursive: true });
    const extension = getExtensionFromContentType(contentType);
    const filename = `${filenamePrefix}_${Date.now()}.${extension}`;
    const filePath = path.join(outputDir, filename);
    const buffer = Buffer.from(await imageBlob.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    return {
        filePath,
        publicPath: `${publicDir}/${filename}`,
        mimeType: contentType,
        prompt,
        provider: 'huggingface',
        inferenceProvider: DEFAULT_HF_IMAGE_PROVIDER,
        model
    };
}

async function generateHuggingFaceImageEdit({
    prompt,
    imagePath,
    outputDir,
    publicDir,
    filenamePrefix,
    width = 1024,
    height = 1024
}) {
    const token = requireHuggingFaceToken();
    const model = DEFAULT_HF_IMAGE_EDIT_MODEL;
    const client = new InferenceClient(token);
    const inputBuffer = fs.readFileSync(imagePath);
    const inputBlob = new Blob([inputBuffer], { type: getMimeType(imagePath) });

    const imageBlob = await client.imageToImage({
        provider: DEFAULT_HF_IMAGE_PROVIDER,
        model,
        inputs: inputBlob,
        parameters: {
            prompt,
            width,
            height,
            num_inference_steps: Number(process.env.HF_MOCKUP_IMAGE_STEPS || process.env.HF_IMAGE_STEPS || 8),
            guidance_scale: Number(process.env.HF_MOCKUP_IMAGE_GUIDANCE || process.env.HF_IMAGE_GUIDANCE || 3.5),
            negative_prompt: 'watermark, blurry, low quality, extra text, misspelled letters, distorted logo, duplicate logo, different logo, fake logo, random logo, Chinese characters, Japanese characters, Hanzi, Kanji, Hanja'
        }
    });

    const contentType = imageBlob.type || 'image/png';
    if (!contentType.startsWith('image/')) {
        throw new Error('Hugging Face 응답이 이미지가 아닙니다.');
    }

    fs.mkdirSync(outputDir, { recursive: true });
    const extension = getExtensionFromContentType(contentType);
    const filename = `${filenamePrefix}_${Date.now()}.${extension}`;
    const filePath = path.join(outputDir, filename);
    const buffer = Buffer.from(await imageBlob.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    return {
        filePath,
        publicPath: `${publicDir}/${filename}`,
        mimeType: contentType,
        prompt,
        provider: 'huggingface',
        inferenceProvider: DEFAULT_HF_IMAGE_PROVIDER,
        model
    };
}

function getHuggingFaceErrorStatus(error) {
    return error && error.statusCode ? error.statusCode : 500;
}

function getHuggingFaceErrorMessage(error, fallback = 'Hugging Face AI 생성 중 오류가 발생했습니다.') {
    return error && error.message ? error.message : fallback;
}

module.exports = {
    generateHuggingFaceImage,
    generateHuggingFaceImageEdit,
    generateHuggingFaceJson,
    generateHuggingFaceText,
    getHuggingFaceErrorMessage,
    getHuggingFaceErrorStatus
};
