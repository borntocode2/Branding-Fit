const express = require('express');
const db = require('../config/database');
const { validateDesignRequest } = require('../shared/specData');

const router = express.Router();

// GET /api/request/list - fetch design requests for the signed-in user.
router.get('/list', (req, res) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ success: false, error: '로그인이 필요합니다.' });
    }

    db.all(
        `SELECT id, name, email, phone, brand_name, attachment_name, content, status, created_at
         FROM design_requests
         WHERE user_id = ?
         ORDER BY id DESC`,
        [req.user.id],
        (err, rows) => {
            if (err) {
                console.error('❌ Failed to fetch design request list:', err.message);
                return res.status(500).json({
                    success: false,
                    error: '디자인 의뢰 목록 조회 중 오류가 발생했습니다.'
                });
            }

            return res.json({
                success: true,
                requests: rows || []
            });
        }
    );
});

// POST /api/request - submit a design request.
// File upload is intentionally deferred until storage policy is finalized.
router.post('/', (req, res) => {
    const validation = validateDesignRequest(req.body);
    if (!validation.valid) {
        return res.status(400).json({
            success: false,
            errors: validation.errors
        });
    }

    const userId = req.user ? req.user.id : null;
    const { name, email, phone, brandName, content, attachmentName } = req.body;

    db.run(
        `INSERT INTO design_requests (
            user_id, name, email, phone, brand_name, attachment_name, content, privacy_agreed
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            userId,
            String(name).trim(),
            String(email).trim(),
            phone ? String(phone).trim() : null,
            brandName ? String(brandName).trim() : null,
            attachmentName ? String(attachmentName).trim() : null,
            String(content).trim(),
            1
        ],
        function (err) {
            if (err) {
                console.error('❌ Failed to save design request:', err.message);
                return res.status(500).json({
                    success: false,
                    error: '디자인 의뢰 저장 중 오류가 발생했습니다.'
                });
            }

            return res.status(201).json({
                success: true,
                request_id: this.lastID,
                status: 'received'
            });
        }
    );
});

module.exports = router;
