const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('portfolio page uses figma-inspired shell, logo tiles, and shared footer', () => {
    const html = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
    const script = fs.readFileSync(path.join(root, 'public/js/public-pages.js'), 'utf8');

    assert.match(html, /portfolio-page-shell/);
    assert.match(html, /portfolio-title-block/);
    assert.match(html, /site-footer/);
    assert.match(script, /portfolio-placeholder/);
    assert.match(script, /portfolio-card-logo/);
    assert.doesNotMatch(script, /portfolio-card-arrow/);
});

test('portfolio detail locks page scroll and keeps modal content internally scrollable', () => {
    const css = fs.readFileSync(path.join(root, 'public/css/style.css'), 'utf8');
    const script = fs.readFileSync(path.join(root, 'public/js/public-pages.js'), 'utf8');
    const router = fs.readFileSync(path.join(root, 'public/js/router.js'), 'utf8');

    assert.match(css, /body\.portfolio-modal-open/);
    assert.match(css, /\.portfolio-detail-content[\s\S]*overflow-y:\s*auto/);
    assert.match(css, /\.portfolio-detail-content[\s\S]*padding:\s*0 0 24px/);
    assert.match(css, /\.portfolio-detail-panel[\s\S]*bottom:\s*0/);
    assert.match(css, /\.portfolio-detail-panel[\s\S]*width:\s*min\(80vw, 1540px\)/);
    assert.match(css, /\.portfolio-detail-panel[\s\S]*height:\s*calc\(100vh - clamp\(56px, 7vh, 86px\)\)/);
    assert.match(css, /\.portfolio-detail-panel[\s\S]*border-bottom:\s*0/);
    assert.match(css, /\.portfolio-detail-panel[\s\S]*grid-template-columns:\s*210px minmax\(0, 1fr\)/);
    assert.match(css, /\.portfolio-detail-panel[\s\S]*border-radius:\s*28px 28px 0 0/);
    assert.match(css, /\.portfolio-detail-head[\s\S]*padding:\s*30px clamp\(34px, 4vw, 72px\) 20px clamp\(42px, 4\.4vw, 76px\)/);
    assert.match(css, /\.portfolio-detail-section[\s\S]*width:\s*min\(1020px, calc\(100% - 128px\)\)/);
    assert.match(css, /\.portfolio-detail-section[\s\S]*transform:\s*translateX\(-52px\)/);
    assert.match(css, /\.portfolio-logo-blank[\s\S]*transform:\s*translateX\(-52px\)/);
    assert.match(css, /\.portfolio-detail-sidebar[\s\S]*flex-direction:\s*column/);
    assert.match(css, /\.portfolio-detail-sidebar[\s\S]*gap:\s*16px/);
    assert.match(css, /\.portfolio-detail-sidebar a[\s\S]*white-space:\s*nowrap/);
    assert.match(script, /lockPortfolioBackgroundScroll/);
    assert.match(router, /portfolio-route/);
});


test('portfolio public script syncs an initial detail hash after DOM setup', () => {
    const script = fs.readFileSync(path.join(root, 'public/js/public-pages.js'), 'utf8');

    assert.match(script, /syncPortfolioRouteOnLoad/);
    assert.match(script, /openPortfolioDetailFromRoute\(window\.location\.hash\)/);
});


test('portfolio detail tolerates optional summary markup', () => {
    const script = fs.readFileSync(path.join(root, 'public/js/public-pages.js'), 'utf8');

    assert.match(script, /summaryElement/);
    assert.doesNotMatch(script, /getElementById\('portfolio-detail-summary'\)\.textContent/);
});


test('portfolio detail renders logo and package mockup image assets', () => {
    const html = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
    const script = fs.readFileSync(path.join(root, 'public/js/public-pages.js'), 'utf8');
    const css = fs.readFileSync(path.join(root, 'public/css/style.css'), 'utf8');
    const home = fs.readFileSync(path.join(root, 'public/home.html'), 'utf8');

    assert.ok(html.includes('<a href="#portfolio-detail-mockups">패키지</a>'));
    assert.ok(!html.includes('패키지 / 웹사이트'));
    assert.match(html, /portfolio-detail-mockups-list/);
    assert.match(html, /class="portfolio-detail-closing"[\s\S]*Branding fit[\s\S]*당신의 비즈니스를 위한 최첨단 AI 디자인 파트너,[\s\S]*<br \/>[\s\S]*가장 빠르고 스마트하게 브랜딩을 시작하세요\./);
    assert.match(css, /\.portfolio-detail-closing\s*\{[\s\S]*width:\s*min\(1020px, calc\(100% - 128px\)\)/);
    assert.match(css, /\.portfolio-detail-closing\s*\{[\s\S]*margin:\s*32px auto 0/);
    assert.match(css, /\.portfolio-detail-closing\s*\{[\s\S]*transform:\s*translateX\(-52px\)/);
    assert.match(css, /\.portfolio-detail-closing\s*\{[\s\S]*min-height:\s*112px/);
    assert.match(css, /\.portfolio-detail-closing\s*\{[\s\S]*background:\s*transparent/);
    assert.match(css, /\.portfolio-detail-closing h3[\s\S]*margin:\s*0 0 16px/);
    assert.match(css, /\.portfolio-detail-closing h3[\s\S]*font-weight:\s*900/);
    assert.match(css, /\.portfolio-detail-closing p[\s\S]*color:\s*rgba\(255, 255, 255, 0\.56\)/);
    assert.match(script, /PUBLIC_PORTFOLIO_ASSETS/);
    assert.match(script, /logoImage/);
    assert.match(script, /mockupImages/);
    assert.match(script, /portfolio-mockup-image/);
    assert.match(script, /event.preventDefault()/);
    assert.match(css, /\.portfolio-card-logo[\s\S]*object-fit:\s*cover/);
    assert.match(css, /\.portfolio-mockup-image[\s\S]*object-fit:\s*cover/);
    assert.ok(home.includes('/assets/images/portfolio/urbanvibe/home-preview.jpg'));
    assert.ok(home.includes('/assets/images/portfolio/godash/home-preview.jpg'));
    assert.ok(home.includes('/assets/images/portfolio/skillupbase/home-preview.jpg'));

    [
        'public/assets/images/portfolio/dongdong/logo.jpg',
        'public/assets/images/portfolio/dongdong/mockup-5.png',
        'public/assets/images/portfolio/urbanvibe/home-preview.jpg',
        'public/assets/images/portfolio/urbanvibe/mockup-5.png'
    ].forEach(assetPath => {
        assert.ok(fs.existsSync(path.join(root, assetPath)), assetPath + ' should exist');
    });
});


test('portfolio categories include every uploaded brand grouping', () => {
    const script = fs.readFileSync(path.join(root, 'public/js/public-pages.js'), 'utf8');

    [
        '그랑프르닐',
        '막걸리 동동',
        '메종드스크류',
        '아뜰리에 커피',
        '오름흑돼지',
        '조이포켓',
        '테일팩토리',
        '펫보그',
        '프라임볼',
        '호미포',
        '바이브스트림',
        '솜버테일',
        '늘봄',
        '데일리리추얼',
        '모듈로직',
        'EcoPulse',
        '페이지앤쿠옛',
        '폼스페이스',
        'SkillUpBase',
        'FrameDesign',
        '이지스파트너스',
        '머슬아트',
        '허브앤라운지'
    ].forEach(name => {
        assert.ok(script.includes(`"brandName": "${name}"`), name + ' should be present');
    });

    assert.ok(script.includes('\"category\": \"서비스\"'));
    assert.ok(script.includes('\"category\": \"기타\"'));
    assert.ok(!script.includes('서비스•기타'));
    assert.ok(script.includes('\"id\": \"asset-flow\"'));
});

test('portfolio assets exist for the requested category additions', () => {
    [
        'public/assets/images/portfolio/grand-prunil/logo.jpeg',
        'public/assets/images/portfolio/joy-pocket/mockup-5.png',
        'public/assets/images/portfolio/aegis-partners/logo.jpeg',
        'public/assets/images/portfolio/hub-lounge/mockup-5.jpeg',
        'public/assets/images/portfolio/asset-flow/logo.jpeg'
    ].forEach(assetPath => {
        assert.ok(fs.existsSync(path.join(root, assetPath)), assetPath + ' should exist');
    });
});


test('portfolio detail switches close and top controls at package scroll', () => {
    const html = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
    const css = fs.readFileSync(path.join(root, 'public/css/style.css'), 'utf8');
    const script = fs.readFileSync(path.join(root, 'public/js/public-pages.js'), 'utf8');

    assert.match(html, /class="portfolio-close-label">Close/);
    assert.match(html, /class="portfolio-close-icon" aria-hidden="true">×/);
    assert.match(css, /\.portfolio-modal-close \{[\s\S]*width:\s*50px/);
    assert.match(css, /\.portfolio-close-label \{[\s\S]*position:\s*absolute/);
    assert.match(css, /\.portfolio-modal-close:hover,[\s\S]*width:\s*112px/);
    assert.match(css, /\.portfolio-modal-close:hover \.portfolio-close-label[\s\S]*position:\s*static/);
    assert.match(css, /\.portfolio-detail-modal\.is-package-visible \.portfolio-modal-close[\s\S]*opacity:\s*0/);
    assert.match(css, /\.portfolio-detail-modal\.is-package-visible \.portfolio-top-btn[\s\S]*opacity:\s*1/);
    assert.match(css, /\.portfolio-top-btn \{[\s\S]*position:\s*absolute/);
    assert.match(css, /\.portfolio-top-btn \{[\s\S]*right:\s*clamp\(34px, 4vw, 72px\)/);
    assert.match(css, /\.portfolio-top-btn \{[\s\S]*bottom:\s*34px/);
    assert.match(css, /\.portfolio-top-btn \{[\s\S]*height:\s*50px/);
    assert.match(css, /\.portfolio-modal-close \{[\s\S]*height:\s*50px/);
    assert.match(css, /\.portfolio-close-icon \{[\s\S]*place-items:\s*center/);
    assert.match(css, /\.portfolio-detail-sidebar a:hover[\s\S]*text-decoration:\s*underline/);
    assert.match(script, /updatePortfolioDetailScrollState/);
    assert.match(script, /mockups\.offsetTop - 96/);
    assert.match(script, /classList\.toggle\('is-package-visible'/);
    assert.match(script, /classList\.toggle\('active'/);
    assert.match(script, /scroller\.scrollTo\(\{ top: target\.offsetTop/);
});

test('portfolio detail badge uses the selected brand logo image', () => {
    const css = fs.readFileSync(path.join(root, 'public/css/style.css'), 'utf8');
    const script = fs.readFileSync(path.join(root, 'public/js/public-pages.js'), 'utf8');

    assert.match(script, /badge\.innerHTML = item\.logoImage/);
    assert.ok(script.includes(`'<img src="' + item.logoImage`));
    assert.match(css, /\.portfolio-detail-brand-mark img \{[\s\S]*object-fit:\s*cover/);
});
