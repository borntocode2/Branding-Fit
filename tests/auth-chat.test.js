const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('auth client keeps returnTo and protects member routes', () => {
    const auth = fs.readFileSync(path.join(root, 'public/js/auth.js'), 'utf8');
    assert.match(auth, /branding_fit_return_to/);
    assert.match(auth, /guardProtectedNavigation/);
    assert.match(auth, /restoreReturnToAfterLogin/);
});

test('mypage includes account logout and withdrawal actions', () => {
    const html = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
    const css = fs.readFileSync(path.join(root, 'public/css/style.css'), 'utf8');
    assert.match(html, /class="mypage-account-actions"[\s\S]*id="btn-mypage-logout"[\s\S]*id="btn-mypage-withdraw"/);
    assert.ok(html.indexOf('id="btn-mypage-logout"') < html.indexOf('id="btn-mypage-withdraw"'));
    assert.match(css, /border:\s*1px solid rgba\(255, 255, 255, 0\.52\)/);
    assert.match(css, /color:\s*rgba\(255, 255, 255, 0\.52\)/);
    assert.match(css, /\.mypage-outline-btn:not\(\.danger\):hover,[\s\S]*border-color:\s*#fff/);
    assert.match(css, /\.mypage-outline-btn:not\(\.danger\):hover,[\s\S]*color:\s*#fff/);
    assert.match(css, /\.mypage-outline-btn\.danger:hover,[\s\S]*background:\s*#ef4444/);
    assert.match(css, /\.mypage-outline-btn\.danger:hover,[\s\S]*color:\s*#fff/);
});

test('auth backend exposes withdrawal endpoint placeholder', () => {
    const authRoute = fs.readFileSync(path.join(root, 'src/routes/auth.js'), 'utf8');
    assert.match(authRoute, /router\.delete\('\/withdraw'/);
    assert.match(authRoute, /DELETE FROM brands/);
});

test('auth backend exposes profile update endpoint', () => {
    const authRoute = fs.readFileSync(path.join(root, 'src/routes/auth.js'), 'utf8');
    const database = fs.readFileSync(path.join(root, 'src/config/database.js'), 'utf8');
    const server = fs.readFileSync(path.join(root, 'src/server.js'), 'utf8');

    assert.match(authRoute, /router\.patch\('\/profile'/);
    assert.match(authRoute, /UPDATE users SET nickname = \?, profile_image = \?/);
    assert.match(authRoute, /nickname\.length > 6/);
    assert.match(authRoute, /닉네임은 1~6자 이내/);
    assert.match(authRoute, /isValidProfileImage/);
    assert.match(database, /addColumnIfMissing\('users', 'profile_image', 'profile_image TEXT'\)/);
    assert.match(server, /express\.json\(\{ limit: '2mb' \}\)/);
    assert.match(server, /app\.use\('\/api'/);
    assert.match(server, /요청한 API를 찾을 수 없습니다/);
});

test('chatbot persists current conversation during the session', () => {
    const chatbot = fs.readFileSync(path.join(root, 'public/js/chatbot.js'), 'utf8');
    assert.match(chatbot, /sessionStorage/);
    assert.match(chatbot, /branding_fit_chat_history/);
});


test('auth client exposes login modal controls for embedded home page', () => {
    const auth = fs.readFileSync(path.join(root, 'public/js/auth.js'), 'utf8');
    const home = fs.readFileSync(path.join(root, 'public/home.html'), 'utf8');

    assert.match(auth, /window\.openLoginModal\s*=\s*openLoginModal/);
    assert.match(auth, /window\.closeLoginModal\s*=\s*closeLoginModal/);
    assert.match(auth, /window\.brandingFitAuth\.openLoginModal\s*=\s*openLoginModal/);
    assert.match(home, /parentWindow\.brandingFitAuth\?\.openLoginModal/);
});


test('embedded home navigation reflects authenticated state', () => {
    const auth = fs.readFileSync(path.join(root, 'public/js/auth.js'), 'utf8');
    const home = fs.readFileSync(path.join(root, 'public/home.html'), 'utf8');

    assert.match(auth, /notifyEmbeddedHomeAuthState/);
    assert.match(auth, /home-page-frame/);
    assert.match(home, /syncAuthState/);
    assert.match(home, /마이페이지/);
    assert.match(home, /#\/mypage/);
});


test('oauth failures return to the app route with a visible auth error', () => {
    const authRoute = fs.readFileSync(path.join(root, 'src/routes/auth.js'), 'utf8');
    const auth = fs.readFileSync(path.join(root, 'public/js/auth.js'), 'utf8');

    assert.match(authRoute, /auth_error=google#\//);
    assert.match(authRoute, /auth_error=github#\//);
    assert.doesNotMatch(authRoute, /#\/\?error=auth_failed/);
    assert.match(auth, /showAuthErrorFromQuery/);
    assert.match(auth, /URLSearchParams\(window\.location\.search\)/);
});


test('brand archive local fallback is scoped to the signed-in user', () => {
    const workspace = fs.readFileSync(path.join(root, 'public/js/workspace.js'), 'utf8');
    const mypage = fs.readFileSync(path.join(root, 'public/js/mypage.js'), 'utf8');
    const auth = fs.readFileSync(path.join(root, 'public/js/auth.js'), 'utf8');

    assert.match(workspace, /getScopedBrandStorageKey/);
    assert.match(mypage, /getScopedBrandStorageKey/);
    assert.match(workspace, /localStorage\.getItem\(getScopedBrandStorageKey\(\)\)/);
    assert.match(mypage, /localStorage\.getItem\(getScopedBrandStorageKey\(\)\)/);
    assert.match(auth, /getScopedBrandStorageKey/);
    assert.doesNotMatch(auth, /removeItem\('branding_fit_saved_brands'\)/);
});


test('brand list api only returns the authenticated user archive', () => {
    const brandRoute = fs.readFileSync(path.join(root, 'src/routes/brand.js'), 'utf8');

    assert.match(brandRoute, /로그인이 필요합니다/);
    assert.match(brandRoute, /WHERE user_id = \?/);
    assert.doesNotMatch(brandRoute, /user_id = \? OR user_id IS NULL/);
    assert.doesNotMatch(brandRoute, /SELECT \* FROM brands ORDER BY id DESC/);
});


test('brand delete api is scoped to the authenticated user', () => {
    const brandRoute = fs.readFileSync(path.join(root, 'src/routes/brand.js'), 'utf8');

    assert.match(brandRoute, /DELETE FROM brands WHERE id = \? AND user_id = \?/);
    assert.match(brandRoute, /삭제할 브랜드를 찾을 수 없습니다/);
});
