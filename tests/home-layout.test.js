const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('home reveals brand redefinition copy as a portfolio backdrop', () => {
    const html = fs.readFileSync(path.join(root, 'public/home.html'), 'utf8');
    const portfolioStart = html.indexOf('<section class="portfolio-section"');
    const introStart = html.indexOf('<section class="intro-section"');
    const portfolioMarkup = html.slice(portfolioStart, introStart);
    const trackStart = portfolioMarkup.indexOf('<div class="portfolio-track"');
    const introMarkup = html.slice(introStart);

    assert.match(portfolioMarkup, /portfolio-redefinition-backdrop/);
    assert.match(portfolioMarkup, /TEXT-BASED<br>BRAND<br>REDEFINITION/);
    assert.match(portfolioMarkup, /View more portfolio/);
    assert.ok(
        portfolioMarkup.indexOf('<div class="portfolio-redefinition-backdrop"') < trackStart,
        'brand redefinition copy should sit behind the horizontal portfolio track'
    );
    assert.doesNotMatch(
        portfolioMarkup.slice(trackStart),
        /portfolio-redefinition-copy/,
        'brand redefinition copy should not be a horizontal track item'
    );
    assert.doesNotMatch(introMarkup, /TEXT-BASED<br>BRAND<br>REDEFINITION/);
});

test('home intro continues after the portfolio brand start handoff', () => {
    const html = fs.readFileSync(path.join(root, 'public/home.html'), 'utf8');
    const introStart = html.indexOf('<section class="intro-section"');
    const introMarkup = html.slice(introStart);
    const firstBoxMatch = introMarkup.match(/<div class="intro-center-box active" data-index="0">([\s\S]*?)<\/div>/);

    assert.ok(firstBoxMatch, 'expected first active intro box');
    assert.match(firstBoxMatch[1], /디자인의<br>경계를 허물다/);
    assert.doesNotMatch(introMarkup, /브랜드의<br>시작을 함께/);
});


test('home portfolio scroll reveals backdrop during the closing view more panel', () => {
    const html = fs.readFileSync(path.join(root, 'public/home.html'), 'utf8');

    assert.match(html, /getPortfolioEndX/);
    assert.match(html, /getElementById\("portfolioBackdrop"\)/);
    assert.match(html, /querySelector\("\.view-more-section"\)/);
    assert.match(html, /return -targetRight/);
    assert.match(html, /clipPath:\s*"inset\(0 0 0 100%\)"/);
    assert.match(html, /clipPath:\s*"inset\(0 0 0 0%\)"/);
    assert.doesNotMatch(html, /xPercent:\s*-100/);
    assert.doesNotMatch(html, /portfolioSection,\s*\{\s*xPercent/s);
});

test('home portfolio scroll pushes the view more panel fully offscreen', () => {
    const html = fs.readFileSync(path.join(root, 'public/home.html'), 'utf8');

    assert.match(html, /const targetRight = target\.offsetLeft \+ target\.offsetWidth/);
    assert.match(html, /return -targetRight/);
    assert.doesNotMatch(html, /return backdropLeft - targetRight/);
});

test('home portfolio closing frame leaves only the centered backdrop copy visible', () => {
    const html = fs.readFileSync(path.join(root, 'public/home.html'), 'utf8');

    assert.match(html, /const portfolioTitle = portfolioSection\.querySelector\("\.portfolio-fixed-title"\)/);
    assert.match(html, /portfolioTimeline\.to\(portfolioTitle,\s*\{\s*opacity:\s*0/s);
    assert.match(html, /portfolioTimeline\.to\(portfolioBackdrop,\s*\{[\s\S]*opacity:\s*1/);
});

test('home hands off from portfolio copy to intro copy without a section movement', () => {
    const html = fs.readFileSync(path.join(root, 'public/home.html'), 'utf8');
    const portfolioStart = html.indexOf('<section class="portfolio-section"');
    const introStart = html.indexOf('<section class="intro-section"');
    const portfolioMarkup = html.slice(portfolioStart, introStart);

    assert.match(portfolioMarkup, /portfolio-intro-handoff/);
    assert.match(portfolioMarkup, /브랜드의<br>시작을 함께/);
    assert.match(html, /const portfolioIntroHandoff = document\.getElementById\("portfolioIntroHandoff"\)/);
    assert.match(html, /function getPortfolioScrollDistance\(\)/);
    assert.match(html, /window\.innerHeight \* \(1\.68 \+ portfolioIntroSteps\.length \* 2\.05\)/);
    assert.match(html, /portfolioTimeline\.to\(portfolioBackdrop,\s*\{\s*opacity:\s*0/s);
    assert.match(html, /portfolioTimeline\.to\(step,\s*\{\s*opacity:\s*1/s);
    assert.match(html, /const startAt = 0\.9 \+ index \* 0\.56/);
    assert.match(html, /duration:\s*0\.56\s*\r?\n\s*\}, startAt\);/);
    assert.match(html, /portfolioTimeline\.to\(step,\s*\{\s*opacity:\s*0/s);
});

test('home intro sequence pairs each fading copy with one diagonal image', () => {
    const html = fs.readFileSync(path.join(root, 'public/home.html'), 'utf8');
    const portfolioStart = html.indexOf('<section class="portfolio-section"');
    const introStart = html.indexOf('<section class="intro-section"');
    const portfolioMarkup = html.slice(portfolioStart, introStart);
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    assert.ok(styleMatch, 'expected inline home styles');
    const css = styleMatch[1];

    for (const index of [1, 2, 3, 4, 6]) {
        const fileName = 'intro-' + String(index).padStart(2, '0') + '.png';
        assert.ok(fs.existsSync(path.join(root, 'public/assets/images/introduction', fileName)));
        assert.ok(portfolioMarkup.includes('/assets/images/introduction/' + fileName));
    }

    assert.ok(fs.existsSync(path.join(root, 'public/assets/videos/introduction/intro-05.mp4')));
    assert.ok(portfolioMarkup.includes('/assets/videos/introduction/intro-05.mp4'));
    assert.match(portfolioMarkup, /<video src="\/assets\/videos\/introduction\/intro-05\.mp4" autoplay muted loop playsinline preload="metadata"><\/video>/);

    const stepCount = (portfolioMarkup.match(/class="portfolio-intro-step"/g) || []).length;
    const visualCount = (portfolioMarkup.match(/class="portfolio-intro-visual"/g) || []).length;
    assert.equal(stepCount, 7);
    assert.equal(visualCount, 6);
    assert.doesNotMatch(portfolioMarkup, /portfolio-intro-gallery/);
    assert.match(css, /\.portfolio-intro-visual \{[\s\S]*width:\s*clamp\(540px, 54vw, 1050px\)/);
    assert.match(css, /\.portfolio-intro-visual img,[\s\S]*\.portfolio-intro-visual video \{/);
    assert.match(css, /\.portfolio-intro-step:nth-child\(1\) \.portfolio-intro-visual[\s\S]*left:\s*6%/);
    assert.match(css, /\.portfolio-intro-step:nth-child\(2\) \.portfolio-intro-visual[\s\S]*right:\s*5%/);
    assert.match(css, /\.portfolio-intro-step:nth-child\(3\) \.portfolio-intro-visual[\s\S]*left:\s*6%/);
    assert.match(html, /const copy = step\.querySelector\("\.portfolio-intro-copy"\)/);
    assert.match(html, /const visual = step\.querySelector\("\.portfolio-intro-visual"\)/);
    assert.match(html, /y:\s*\(\) => window\.innerHeight \* 0\.72 \+ visual\.offsetHeight/);
    assert.match(html, /y:\s*\(\) => -\(window\.innerHeight \* 0\.72 \+ visual\.offsetHeight\)/);
    assert.match(html, /gsap\.set\(portfolioIntroSteps,\s*\{[\s\S]*y:\s*0/);
    assert.match(html, /portfolioTimeline\.fromTo\(copy,\s*\{[\s\S]*y:\s*0[\s\S]*y:\s*0/);
    assert.doesNotMatch(css.match(/\.portfolio-intro-visual \{[\s\S]*?\}/)?.[0] || '', /filter:/);
    assert.doesNotMatch(css.match(/\.portfolio-intro-visual img \{[\s\S]*?\}/)?.[0] || '', /filter:/);
    assert.doesNotMatch(css.match(/\.portfolio-intro-visual img \{[\s\S]*?\}/)?.[0] || '', /opacity:/);
    assert.match(css, /\.portfolio-intro-handoff::after[\s\S]*z-index:\s*0/);
    assert.match(css, /\.portfolio-intro-visual \{[\s\S]*z-index:\s*2/);
});

test('home runs the full intro sequence inside the portfolio pin', () => {
    const html = fs.readFileSync(path.join(root, 'public/home.html'), 'utf8');
    const portfolioStart = html.indexOf('<section class="portfolio-section"');
    const introStart = html.indexOf('<section class="intro-section"');
    const portfolioMarkup = html.slice(portfolioStart, introStart);
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    assert.ok(styleMatch, 'expected inline home styles');

    assert.match(portfolioMarkup, /디자인의<br>경계를 허물다/);
    assert.match(portfolioMarkup, /원클릭<br>에셋 연동/);
    assert.match(portfolioMarkup, /Automated<br>Design System/);
    assert.match(portfolioMarkup, /Unified Brand<br>Kit Builder/);
    assert.match(portfolioMarkup, /class="intro-btn portfolio-intro-cta">디자인 시작하기/);
    assert.doesNotMatch(portfolioMarkup, /portfolio-intro-handoff" id="portfolioIntroHandoff" aria-hidden="true"/);
    assert.match(styleMatch[1], /\.portfolio-intro-cta[\s\S]*pointer-events:\s*auto/);
    assert.match(html, /const portfolioIntroSteps = document\.querySelectorAll\("\.portfolio-intro-step"\)/);
    assert.match(html, /portfolioIntroSteps\.forEach\(\(step, index\) =>/);
    assert.match(html, /pointerEvents:\s*"none"/);
    assert.match(html, /pointerEvents:\s*"auto"/);
    assert.match(html, /bindClick\("\.nav-auth button, #submitBrand, \.intro-btn", saveDraftAndOpenWorkspace\);/);
    assert.doesNotMatch(html, /ScrollTrigger\.create\(\{\s*trigger:\s*introSection/s);
    assert.match(styleMatch[1], /\.intro-section[\s\S]*display:\s*none/);
});

test('home portfolio backdrop copy is fixed at the center of the viewport', () => {
    const html = fs.readFileSync(path.join(root, 'public/home.html'), 'utf8');
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    assert.ok(styleMatch, 'expected inline home styles');
    const css = styleMatch[1];

    assert.match(css, /\.portfolio-redefinition-backdrop[\s\S]*left:\s*50%/);
    assert.match(css, /\.portfolio-redefinition-backdrop[\s\S]*right:\s*auto/);
    assert.match(css, /\.portfolio-redefinition-backdrop[\s\S]*transform:\s*translate\(-50%, -50%\)/);
    assert.match(css, /\.portfolio-redefinition-backdrop[\s\S]*text-align:\s*center/);
    assert.doesNotMatch(css, /\.portfolio-redefinition-backdrop[\s\S]*right:\s*clamp/);
});


test('home hero uses a blurred autoplaying video background', () => {
    const html = fs.readFileSync(path.join(root, 'public/home.html'), 'utf8');
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    assert.ok(styleMatch, 'expected inline home styles');
    const css = styleMatch[1];
    const videoPath = path.join(root, 'public/assets/videos/hero-bg.mp4');

    assert.ok(fs.existsSync(videoPath));
    assert.ok(html.includes('class="hero-bg-video" autoplay muted loop playsinline'));
    assert.ok(html.includes('src="/assets/videos/hero-bg.mp4"'));
    assert.match(css, /\.hero-bg-video[\s\S]*filter:\s*blur\(18px\) saturate\(1\.08\) brightness\(0\.62\)/);
    assert.match(css, /\.hero-bg::after[\s\S]*rgba\(18, 18, 18, 0\.38\)/);
});

test('home layout uses responsive viewport sizing instead of fixed canvas width', () => {
    const html = fs.readFileSync(path.join(root, 'public/home.html'), 'utf8');
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    assert.ok(styleMatch, 'expected inline home styles');
    const css = styleMatch[1];

    assert.match(css, /body, html[\s\S]*width:\s*100%/);
    assert.match(css, /nav[\s\S]*width:\s*100%/);
    assert.match(css, /\.hero-section[\s\S]*width:\s*100%/);
    assert.match(css, /\.hero-section[\s\S]*min-height:\s*clamp\(760px, 100svh, 1080px\)/);
    assert.match(css, /\.portfolio-section[\s\S]*width:\s*100%/);
    assert.match(css, /\.intro-fixed-viewport[\s\S]*width:\s*100%/);
    assert.match(css, /\.logo-marquee-section[\s\S]*width:\s*100%/);
    assert.match(css, /footer[\s\S]*width:\s*100%/);
    assert.match(css, /@media\s*\(max-width:\s*900px\)/);
    assert.match(css, /@media\s*\(max-width:\s*640px\)/);
    assert.match(css, /--page-gutter:\s*clamp\(24px, 4\.2vw, 80px\)/);
    assert.match(css, /clamp\(/);
    assert.doesNotMatch(css, /width:\s*1920px/);
    assert.doesNotMatch(css, /width:\s*724px/);
    assert.doesNotMatch(css, /width:\s*740px/);
});


test('home rolling bar uses bundled logo images instead of brand-name text', () => {
    const html = fs.readFileSync(path.join(root, 'public/home.html'), 'utf8');
    const marqueeMatch = html.match(/<div class="logo-marquee-section"[\s\S]*?<\/div>\s*<\/div>/);
    assert.ok(marqueeMatch, 'expected logo marquee section');

    const marqueeHtml = marqueeMatch[0];
    const imageRefs = [...marqueeHtml.matchAll(/\/assets\/images\/rollingbar\/logo(\d+)\.png/g)]
        .map((match) => Number(match[1]));
    assert.equal(imageRefs.length, 46);
    assert.deepEqual(imageRefs.slice(0, 23), Array.from({ length: 23 }, (_, index) => index + 1));
    assert.deepEqual(imageRefs.slice(23), Array.from({ length: 23 }, (_, index) => index + 1));

    for (let index = 1; index <= 23; index += 1) {
        assert.ok(
            fs.existsSync(path.join(root, `public/assets/images/rollingbar/logo${index}.png`)),
            `missing rollingbar logo${index}.png`,
        );
    }

    assert.doesNotMatch(marqueeHtml, />오름흑돼지</);
    assert.doesNotMatch(marqueeHtml, />SkillUpBase</);
});

test('home uses slightly smaller typography and keeps final intro title on one line', () => {
    const html = fs.readFileSync(path.join(root, 'public/home.html'), 'utf8');
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    assert.ok(styleMatch, 'expected inline home styles');
    const css = styleMatch[1];

    assert.match(css, /\.hero-title \{[\s\S]*font-size:\s*clamp\(39px, 3\.35vw, 64px\)/);
    assert.match(css, /\.portfolio-intro-title \{[\s\S]*font-size:\s*clamp\(40px, 3\.95vw, 74px\)/);
    assert.match(css, /\.intro-main-title-end \{[\s\S]*font-size:\s*clamp\(32px, 2\.65vw, 50px\)/);
    assert.match(css, /\.intro-title-nowrap \{[\s\S]*white-space:\s*nowrap/);
    assert.ok(html.includes('<span class="intro-title-nowrap">당신의 브랜드를 디자인해 보세요.</span>'));
});

test("home intro copy is flex-centered without transform-based positioning", () => {
    const html = fs.readFileSync(path.join(root, "public/home.html"), "utf8");
    const styleMatch = html.match(new RegExp("<style>([\\s\\S]*?)</style>"));
    assert.ok(styleMatch, "expected inline home styles");
    const css = styleMatch[1];
    const introCopyBlock = css.match(new RegExp("\\.portfolio-intro-copy \\{[\\s\\S]*?\\n        \\}"))?.[0] || "";

    assert.match(introCopyBlock, /inset:\s*0/);
    assert.match(introCopyBlock, /display:\s*flex/);
    assert.match(introCopyBlock, /align-items:\s*center/);
    assert.match(introCopyBlock, /justify-content:\s*center/);
    assert.doesNotMatch(introCopyBlock, /transform:\s*translate/);
});

test('home portfolio title keeps clear of the preview cards', () => {
    const html = fs.readFileSync(path.join(root, 'public/home.html'), 'utf8');
    const styleMatch = html.match(new RegExp('<style>([\\s\\S]*?)</style>'));
    assert.ok(styleMatch, 'expected inline home styles');
    const css = styleMatch[1];

    assert.ok(css.includes('top: clamp(96px, 11vh, 128px);'));
    assert.ok(css.includes('left: var(--page-gutter);'));
    assert.ok(css.includes('padding-left: clamp(260px, 28vw, 520px);'));
    assert.ok(css.includes('padding-left: 176px;'));
    assert.ok(css.includes('padding-top: 112px;'));
});
