const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const db = require('./config/database'); // Initialize SQLite Database
const authRouter = require('./routes/auth');
const brandRouter = require('./routes/brand');
const chatbotRouter = require('./routes/chatbot');
const logoRouter = require('./routes/logo');
const requestRouter = require('./routes/request');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic Middlewares
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Session & Passport Middlewares
app.use(session({
    secret: process.env.SESSION_SECRET || 'branding_fit_secret_fallback',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));
app.use(passport.initialize());
app.use(passport.session());

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/brand', brandRouter);
app.use('/api/chatbot', chatbotRouter);
app.use('/api/logo', logoRouter);
app.use('/api/request', requestRouter);

// Serve static files from the 'public' directory with explicit UTF-8 charset
app.use(express.static(path.join(__dirname, '../public'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.svg')) {
            res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
        } else if (filePath.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
        } else if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        } else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css; charset=utf-8');
        }
    }
}));

// Health Check API
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date(),
        uptime: process.uptime()
    });
});

// Keep unmatched API requests as JSON errors instead of falling through to index.html.
app.use('/api', (req, res) => {
    res.status(404).json({
        success: false,
        error: '요청한 API를 찾을 수 없습니다. 서버를 재시작한 뒤 다시 시도해 주세요.'
    });
});

// Fallback to serve index.html for SPA router support
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(` Branding fit Server is running on port ${PORT}`);
    console.log(` Access URL: http://localhost:${PORT}`);
    console.log(`==================================================`);
});
