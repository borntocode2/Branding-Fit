const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const db = require('../config/database');

const router = express.Router();

// Helper to find or create user in DB
function findOrCreateUser(profile, done) {
    const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || `${profile.id}@brandingfit.com`;
    const nickname = profile.displayName || profile.username || email.split('@')[0];
    const provider = profile.provider;
    const providerId = profile.id;

    db.get(
        'SELECT * FROM users WHERE provider = ? AND provider_id = ?',
        [provider, providerId],
        (err, user) => {
            if (err) return done(err);
            if (user) {
                return done(null, user);
            }

            // If not found by provider/provider_id, check if email already exists to avoid UNIQUE constraint error
            db.get(
                'SELECT * FROM users WHERE email = ?',
                [email],
                (err2, userByEmail) => {
                    if (err2) return done(err2);
                    
                    if (userByEmail) {
                        // User exists with same email, update provider info to link the account
                        db.run(
                            'UPDATE users SET provider = ?, provider_id = ? WHERE id = ?',
                            [provider, providerId, userByEmail.id],
                            (updateErr) => {
                                if (updateErr) return done(updateErr);
                                userByEmail.provider = provider;
                                userByEmail.provider_id = providerId;
                                return done(null, userByEmail);
                             }
                        );
                    } else {
                        // Create new user if not found at all
                        db.run(
                            'INSERT INTO users (email, nickname, provider, provider_id) VALUES (?, ?, ?, ?)',
                            [email, nickname, provider, providerId],
                            function (insertErr) {
                                if (insertErr) return done(insertErr);
                                
                                // Retrieve newly created user
                                db.get(
                                    'SELECT * FROM users WHERE id = ?',
                                    [this.lastID],
                                    (selectErr, newUser) => {
                                        if (selectErr) return done(selectErr);
                                        return done(null, newUser);
                                    }
                                );
                            }
                        );
                    }
                }
            );
        }
    );
}

// Passport Serialization
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
        done(err, user);
    });
});

// Configure Google OAuth Strategy
const hasGoogleKeys = process.env.GOOGLE_CLIENT_ID && 
                      process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here' &&
                      process.env.GOOGLE_CLIENT_SECRET &&
                      process.env.GOOGLE_CLIENT_SECRET !== 'your_google_client_secret_here';

if (hasGoogleKeys) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.CALLBACK_URL_HOST || 'http://localhost:3000'}/api/auth/google/callback`
    }, (accessToken, refreshToken, profile, done) => {
        findOrCreateUser(profile, done);
    }));
} else {
    console.warn('⚠️ Google OAuth keys are missing or placeholder in .env. Google Login will be unavailable.');
}

// Configure GitHub OAuth Strategy
const hasGitHubKeys = process.env.GITHUB_CLIENT_ID && 
                      process.env.GITHUB_CLIENT_ID !== 'your_github_client_id_here' &&
                      process.env.GITHUB_CLIENT_SECRET &&
                      process.env.GITHUB_CLIENT_SECRET !== 'your_github_client_secret_here';

if (hasGitHubKeys) {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.CALLBACK_URL_HOST || 'http://localhost:3000'}/api/auth/github/callback`
    }, (accessToken, refreshToken, profile, done) => {
        findOrCreateUser(profile, done);
    }));
} else {
    console.warn('⚠️ GitHub OAuth keys are missing or placeholder in .env. GitHub Login will be unavailable.');
}

// ----------------------------------------------------
// Authentication Routes
// ----------------------------------------------------

// 1. Google Auth Routes
router.get('/google', (req, res, next) => {
    if (!hasGoogleKeys) {
        return res.status(501).send('구글 OAuth 키가 설정되지 않아 사용할 수 없습니다. .env 파일을 확인해 주세요.');
    }
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', {
        successRedirect: '/#/',
        failureRedirect: '/?auth_error=google#/'
    })(req, res, next);
});

// 2. GitHub Auth Routes
router.get('/github', (req, res, next) => {
    if (!hasGitHubKeys) {
        return res.status(501).send('깃허브 OAuth 키가 설정되지 않아 사용할 수 없습니다. .env 파일을 확인해 주세요.');
    }
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});

router.get('/github/callback', (req, res, next) => {
    passport.authenticate('github', {
        successRedirect: '/#/',
        failureRedirect: '/?auth_error=github#/'
    })(req, res, next);
});

// 3. Logout Route
router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.json({ success: true, message: 'Logged out successfully.' });
        });
    });
});

// 4. Withdraw route
router.delete('/withdraw', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, error: '로그인이 필요합니다.' });
    }

    const userId = req.user.id;

    db.serialize(() => {
        db.run('DELETE FROM brands WHERE user_id = ?', [userId], (brandErr) => {
            if (brandErr) {
                console.error('❌ Failed to delete user brands:', brandErr.message);
                return res.status(500).json({ success: false, error: '브랜드 데이터 삭제 중 오류가 발생했습니다.' });
            }

            db.run('DELETE FROM users WHERE id = ?', [userId], (userErr) => {
                if (userErr) {
                    console.error('❌ Failed to delete user:', userErr.message);
                    return res.status(500).json({ success: false, error: '회원 데이터 삭제 중 오류가 발생했습니다.' });
                }

                req.logout((logoutErr) => {
                    if (logoutErr) {
                        return res.status(500).json({ success: false, error: '세션 종료 중 오류가 발생했습니다.' });
                    }
                    req.session.destroy(() => {
                        res.clearCookie('connect.sid');
                        res.json({ success: true });
                    });
                });
            });
        });
    });
});

function isValidProfileImage(value) {
    if (!value) return true;
    if (typeof value !== 'string') return false;
    if (value.length > 1.5 * 1024 * 1024) return false;
    return /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/i.test(value);
}

// 4. Update profile route
router.patch('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, error: '로그인이 필요합니다.' });
    }

    const nickname = String(req.body.nickname || '').trim();
    const profileImage = req.body.profileImage === null ? '' : String(req.body.profileImage || '').trim();

    if (!nickname || nickname.length > 6) {
        return res.status(400).json({ success: false, error: '닉네임은 1~6자 이내로 입력해 주세요.' });
    }

    if (!isValidProfileImage(profileImage)) {
        return res.status(400).json({ success: false, error: '프로필 이미지는 1.5MB 이하의 PNG/JPG/WEBP/GIF 데이터여야 합니다.' });
    }

    db.run(
        'UPDATE users SET nickname = ?, profile_image = ? WHERE id = ?',
        [nickname, profileImage || null, req.user.id],
        (err) => {
            if (err) {
                console.error('❌ Failed to update user profile:', err.message);
                return res.status(500).json({ success: false, error: '프로필 저장 중 오류가 발생했습니다.' });
            }

            db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (selectErr, user) => {
                if (selectErr || !user) {
                    return res.status(500).json({ success: false, error: '프로필 정보를 다시 불러오지 못했습니다.' });
                }
                req.user = user;
                return res.json({ success: true, user });
            });
        }
    );
});

// 4. Check session route
router.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false, user: null });
    }
});

// 5. Developer Mock Login (OAuth 우회 테스트용)
router.get('/mock-login', (req, res, next) => {
    const mockProfile = {
        id: 'mock-user-123',
        provider: 'mock',
        displayName: 'MBC Dev Study',
        emails: [{ value: 'mbcdevstudy@gmail.com' }]
    };

    findOrCreateUser(mockProfile, (err, user) => {
        if (err) return next(err);
        req.login(user, (loginErr) => {
            if (loginErr) return next(loginErr);
            res.redirect('/#/');
        });
    });
});

module.exports = router;
