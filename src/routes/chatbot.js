const express = require('express');
const {
    generateHuggingFaceText,
    getHuggingFaceErrorMessage,
    getHuggingFaceErrorStatus
} = require('../services/huggingFace');

const router = express.Router();

function buildChatPrompt(message, history) {
    const recent = Array.isArray(history) ? history.slice(-10) : [];
    const historyText = recent
        .filter(chatMsg => chatMsg && chatMsg.text && chatMsg.text.trim())
        .map(chatMsg => `${chatMsg.role === 'user' ? '사용자' : '브랜딩핏'}: ${chatMsg.text}`)
        .join('\n');

    return `이전 대화:
${historyText || '없음'}

사용자 질문:
${message}

브랜딩핏 서비스 맥락에 맞춰 한국어로 친절하고 실무적으로 답변해줘. 답변은 너무 길지 않게, 필요한 경우 짧은 bullet로 정리해줘.`;
}

router.post('/query', async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: '메시지 내용이 비어있습니다.' });
    }

    try {
        const response = await generateHuggingFaceText({
            systemInstruction: 'You are a friendly, professional AI branding and business consultant for Branding fit. Answer in Korean. Use concise, useful guidance.',
            prompt: buildChatPrompt(message, history)
        });

        return res.json({ response, provider: 'huggingface' });
    } catch (error) {
        console.error('❌ Chatbot Hugging Face API call failed:', error.message);
        return res.status(getHuggingFaceErrorStatus(error)).json({
            error: getHuggingFaceErrorMessage(error, 'Hugging Face 챗봇 응답 생성 중 오류가 발생했습니다.')
        });
    }
});

module.exports = router;
