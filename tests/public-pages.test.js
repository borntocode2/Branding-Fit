const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");

test("app shell contains public portfolio and request views", () => {
  const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");

  assert.match(html, /id="view-portfolio"/);
  assert.match(html, /id="portfolio-detail-modal"/);
  assert.match(html, /id="view-request"/);
  assert.match(html, /id="design-request-form"/);
});

test("login modal uses uploaded video background and provider logo buttons", () => {
  const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "public/css/style.css"), "utf8");

  assert.match(html, /class="modal-content login-modal-card"/);
  assert.match(html, /class="login-modal-visual"/);
  assert.match(html, /class="login-modal-panel"/);
  assert.match(html, /class="social-icon logo-google"/);
  assert.match(html, /class="social-icon logo-github"/);
  assert.match(html, /href="\/api\/auth\/google"/);
  assert.match(html, /href="\/api\/auth\/github"/);
  assert.match(
    html,
    /class="login-modal-video" autoplay muted loop playsinline/,
  );
  assert.match(html, /src="\/assets\/videos\/login-modal-bg\.mp4"/);
  assert.match(css, /\.login-modal-video \{[\s\S]*object-fit:\s*cover/);
  assert.match(
    css,
    /\.login-modal-card\s*\{[\s\S]*grid-template-columns:\s*1\.08fr 0\.92fr/,
  );
  assert.match(html, /pretendard\.min\.css/);
  assert.match(
    css,
    /\.login-modal-card\s*\{[\s\S]*font-family:\s*'Pretendard', var\(--font-body\)/,
  );
  assert.match(css, /\.login-modal-panel\s*\{[\s\S]*margin-left:\s*-56px/);
  assert.match(html, /class="login-visual-copy login-panel-copy"/);
  assert.doesNotMatch(css, /\.login-modal-panel::before/);
  assert.match(
    css,
    /\.login-modal-card::before\s*\{[\s\S]*background:\s*linear-gradient/,
  );
  assert.match(
    css,
    /\.login-modal-panel\s*\{[\s\S]*background:\s*rgba\(14, 14, 15, 0\.48\)/,
  );
  assert.match(
    css,
    /\.login-modal-panel\s*\{[\s\S]*backdrop-filter:\s*blur\(12px\)/,
  );
  assert.match(css, /\.login-panel-copy \{[\s\S]*margin:\s*0 0 34px/);
});

test("shared app navigation matches the landing navigation layout", () => {
  const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "public/css/style.css"), "utf8");
  const auth = fs.readFileSync(path.join(root, "public/js/auth.js"), "utf8");
  const router = fs.readFileSync(
    path.join(root, "public/js/router.js"),
    "utf8",
  );

  const navLinksIndex = html.indexOf('<ul class="nav-links">');
  const navAuthIndex = html.indexOf('<div class="nav-auth">');
  const loginIndex = html.indexOf('id="nav-login-trigger">로그인');
  const mypageIndex = html.indexOf('id="nav-mypage">마이페이지');
  const startIndex = html.indexOf('id="nav-start">디자인 시작');

  assert.ok(navLinksIndex > -1);
  assert.ok(navAuthIndex > navLinksIndex);
  assert.ok(html.includes('id="nav-portfolio">포트폴리오'));
  assert.ok(html.includes('id="nav-intro">소개'));
  assert.ok(html.includes('id="nav-request">디자인의뢰'));
  assert.ok(loginIndex > navAuthIndex);
  assert.ok(mypageIndex > loginIndex);
  assert.ok(startIndex > mypageIndex);
  assert.ok(css.includes("body:not(.home-route) .nav-menu"));
  assert.ok(css.includes("gap: 40px;"));
  assert.ok(css.includes("body:not(.home-route) .nav-links"));
  assert.ok(css.includes("gap: 30px;"));
  assert.ok(css.includes("body:not(.home-route) .nav-auth"));
  assert.ok(css.includes("gap: 20px;"));
  assert.ok(css.includes("font-weight: 400;"));
  assert.ok(
    auth.includes(
      "loginTrigger.style.display = authState.authenticated ? 'none' : '';",
    ),
  );
  assert.ok(
    auth.includes(
      "mypageLink.style.display = authState.authenticated ? 'inline-flex' : 'none';",
    ),
  );
  assert.ok(
    auth.includes(
      "mypageLink.classList.toggle('is-authenticated', authState.authenticated);",
    ),
  );
  assert.ok(!auth.includes("introLink.parentElement.style.display"));
  assert.ok(css.includes("body:not(.home-route) .nav-auth a:not(.btn-start)"));
  assert.ok(
    css.includes("body:not(.home-route) .nav-auth a:not(.btn-start)::after"),
  );
  assert.ok(css.includes("min-height: 40px;"));
  assert.ok(css.includes("line-height: 1;"));
  assert.match(css, /\.btn-start \{[\s\S]*border-radius:\s*20px/);
  assert.match(css, /\.btn-start \{[\s\S]*background:\s*transparent/);
  assert.match(
    css,
    /body:not\(\.home-route\) \.btn-start\.active \{[\s\S]*background:\s*transparent/,
  );
  assert.match(
    css,
    /body:not\(\.home-route\) \.btn-start\.active \{[\s\S]*color:\s*#fff !important/,
  );
  assert.match(
    css,
    /body:not\(\.home-route\) \.btn-start\.active \{[\s\S]*font-weight:\s*400/,
  );
  assert.match(
    css,
    /body:not\(\.home-route\) \.btn-start\.active \{[\s\S]*box-shadow:\s*none/,
  );
  assert.ok(css.includes("body:not(.home-route) .btn-mypage.is-authenticated"));
  assert.ok(
    router.includes("classList.toggle('mypage-route', hash === '#/mypage')"),
  );
  assert.match(css, /body\.mypage-route \{[\s\S]*background:\s*#121212/);
  assert.match(
    css,
    /body\.mypage-route > header \{[\s\S]*background:\s*transparent !important/,
  );
  assert.match(
    css,
    /body\.mypage-route > header \{[\s\S]*-webkit-backdrop-filter:\s*none/,
  );
  assert.ok(!css.includes("box-shadow: 0 0 15px rgba(79, 70, 229, 0.32);"));
  assert.ok(!auth.includes("createElement('li')"));
});

test("mypage shows profile and separates brand and request tabs", () => {
  const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "public/css/style.css"), "utf8");
  const mypage = fs.readFileSync(
    path.join(root, "public/js/mypage.js"),
    "utf8",
  );
  const publicPages = fs.readFileSync(
    path.join(root, "public/js/public-pages.js"),
    "utf8",
  );

  assert.match(html, /class="mypage-shell"/);
  assert.match(html, /id="mypage-provider"/);
  assert.match(html, /id="mypage-avatar-input" type="file"/);
  assert.match(html, /class="mypage-nickname-line"/);
  assert.match(html, /class="mypage-welcome-line">환영합니다\.<\/span>/);
  assert.match(html, /id="mypage-profile-edit-toggle"[^>]*>수정하기/);
  assert.match(html, /id="mypage-profile-form" hidden/);
  assert.match(html, /id="mypage-avatar-upload-btn"[^>]*>이미지 업로드/);
  assert.match(html, /id="mypage-nickname-input"[^>]*maxlength="6"/);
  assert.match(html, /id="mypage-profile-save"/);
  assert.match(html, /data-mypage-tab="brands"/);
  assert.match(html, /data-mypage-tab="requests"/);
  assert.match(html, /id="mypage-request-list"/);
  assert.match(
    html,
    /id="brand-detail-modal" class="portfolio-detail-modal brand-detail-portfolio-modal"/,
  );
  assert.match(html, /id="brand-detail-scroll"/);
  assert.match(html, /href="#brand-detail-logo"/);
  assert.match(html, /href="#brand-detail-system"/);
  assert.match(html, /href="#brand-detail-mockups"/);
  assert.match(html, /class="portfolio-detail-closing brand-detail-closing"/);
  assert.match(html, /id="btn-detail-modal-pdf"/);
  assert.match(html, /id="brand-detail-top"/);
  assert.match(
    html,
    /<h2>생성된 브랜드를 더욱 멋지게 만들어보세요\.<\/h2>[\s\S]*href="#\/request"[\s\S]*디자인 의뢰하기/,
  );
  assert.match(
    html,
    /<h2>상상이 현실이 되는 곳, 당신의 브랜드를 디자인해 보세요\.<\/h2>[\s\S]*href="#\/workspace"[\s\S]*디자인 시작하기/,
  );
  assert.match(
    html,
    /class="mypage-final-cta-video" autoplay muted loop playsinline preload="metadata"/,
  );
  assert.match(css, /.mypage-profile-panel/);
  assert.doesNotMatch(html, /mypage-avatar-edit/);
  assert.doesNotMatch(html, /mypage-nickname-edit/);
  assert.match(css, /\.mypage-nickname-view/);
  assert.match(css, /flex-direction:\s*column/);
  assert.match(css, /\.mypage-welcome-line/);
  assert.match(css, /white-space:\s*nowrap/);
  assert.match(css, /\.mypage-profile-edit-toggle/);
  assert.match(css, /\.mypage-profile-upload/);
  assert.match(css, /\.mypage-profile-edit\[hidden\]/);
  assert.match(css, /\.mypage-profile-edit-row/);
  assert.match(css, /.mypage-request-card/);
  assert.match(css, /\.brand-detail-portfolio-modal \.portfolio-detail-kicker/);
  assert.match(css, /\.brand-detail-pdf-btn/);
  assert.match(
    css,
    /\.mypage-content-panel\s*\{[\s\S]*--mypage-content-x:\s*clamp\(28px, 5vw, 92px\)/,
  );
  assert.match(
    css,
    /\.mypage-content-panel\s*\{[\s\S]*padding:\s*clamp\(72px, 10vh, 128px\) var\(--mypage-content-x\) 0/,
  );
  assert.match(
    css,
    /\.mypage-final-cta\s*\{[\s\S]*width:\s*calc\(100% \+ \(var\(--mypage-content-x\) \* 2\)\)/,
  );
  assert.match(
    css,
    /\.mypage-final-cta\s*\{[\s\S]*margin:\s*clamp\(54px, 7vw, 86px\) calc\(var\(--mypage-content-x\) \* -1\) 0/,
  );
  assert.match(
    css,
    /\.mypage-final-cta-video\s*\{[\s\S]*filter:\s*blur\(14px\) saturate\(1\.08\) brightness\(0\.56\)/,
  );
  assert.match(
    css,
    /\.mypage-final-cta-button:hover,[\s\S]*background:\s*#fff/,
  );
  assert.match(
    css,
    /\.mypage-brand-grid\s*\{[\s\S]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/,
  );
  assert.doesNotMatch(html, /mypage-empty-icon/);
  assert.match(css, /\.mypage-empty-state h3\s*\{[\s\S]*margin:\s*0 0 1rem/);
  assert.match(css, /\.mypage-empty-state p\s*\{[\s\S]*margin:\s*0 0 2\.6rem/);
  assert.match(mypage, /loadMyPageRequests/);
  assert.ok(mypage.includes("fetch('/api/request/list')"));
  assert.match(mypage, /renderMyPageProfile/);
  assert.match(mypage, /setupMyPageProfileEditor/);
  assert.match(mypage, /setupMyPageBrandDetailModal/);
  assert.match(mypage, /updateBrandDetailScrollState/);
  assert.match(mypage, /normalizeBrandMockups/);
  assert.match(mypage, /portfolio-modal-open/);
  assert.match(mypage, /setMyPageProfileEditing/);
  assert.match(mypage, /aria-expanded/);
  assert.match(mypage, /fetch\('\/api\/auth\/profile'/);
  assert.match(mypage, /readProfileJsonResponse/);
  assert.match(mypage, /content-type/);
  assert.match(mypage, /프로필 저장 API가 HTML을 반환했습니다/);
  assert.match(mypage, /profileImage: mypageProfileImageDraft/);
  assert.match(mypage, /FileReader/);
  assert.match(mypage, /request.phone/);
  assert.match(mypage, /request.brand_name/);
  assert.ok(publicPages.includes("phone: form.phone"));
  assert.ok(
    publicPages.includes("brandName: getRequestSelectedBrandNames().join"),
  );
  assert.ok(publicPages.includes("openRequestBrandModal"));
  assert.ok(publicPages.includes("removeRequestBrandCard"));
  assert.ok(publicPages.includes("data-request-brand-remove"));
  assert.ok(publicPages.includes("/api/brand/list"));
});

test("request view uses the full-screen request form design", () => {
  const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "public/css/style.css"), "utf8");
  const publicPages = fs.readFileSync(
    path.join(root, "public/js/public-pages.js"),
    "utf8",
  );

  assert.match(html, /class="request-page-shell"/);
  assert.match(html, /class="request-brand-picker"/);
  assert.match(html, /id="request-brand-add-btn"/);
  assert.match(html, /id="request-brand-modal"/);
  assert.match(html, /id="request-brand-name" name="brandName" value=""/);
  assert.match(
    html,
    /<div class="request-brand-picker" id="request-brand-picker"><\/div>/,
  );
  assert.doesNotMatch(html, /SkillUpBase 브랜드 선택/);
  assert.match(html, /id="request-phone"/);
  assert.match(html, /id="request-email-domain"/);
  assert.match(html, /class="form-group request-email-group"/);
  assert.match(html, /class="request-email-row"/);
  assert.match(
    css,
    /\.request-form \{[\s\S]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/,
  );
  assert.match(css, /\.request-form \{[\s\S]*row-gap:\s*16px/);
  assert.match(css, /\.request-brand-head \{[\s\S]*margin-bottom:\s*10px/);
  assert.match(css, /\.request-bottom-row \{[\s\S]*margin-top:\s*12px/);
  assert.match(
    css,
    /\.request-email-row \{[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\) 28px minmax\(0, 1fr\)/,
  );
  assert.match(css, /\.request-form \.form-control \{[\s\S]*width:\s*100%/);
  assert.match(
    css,
    /\.request-form select\.form-control \{[\s\S]*background-image:\s*url/,
  );
  assert.match(
    css,
    /\.request-form select\.form-control \{[\s\S]*background-position:\s*right 14px center/,
  );
  assert.match(
    css,
    /\.request-form select\.form-control \{[\s\S]*padding-right:\s*38px/,
  );
  assert.match(
    html,
    /class="request-page-video" autoplay muted loop playsinline/,
  );
  assert.match(html, /src="\/assets\/videos\/request-form-bg\.mp4"/);
  assert.match(html, /id="request-success-state" hidden/);
  assert.match(html, /id="request-success-name"/);
  assert.match(html, /href="#\/mypage"/);
  assert.match(html, /의뢰 내용 보러가기/);
  assert.match(css, /\.request-success-state \{/);
  assert.match(css, /\.request-success-home \{/);
  assert.match(css, /\.request-success-archive::after \{/);
  assert.match(publicPages, /showRequestSuccessState/);
  assert.match(publicPages, /successState\.hidden = false/);
  assert.match(publicPages, /form\.hidden = true/);
  assert.match(publicPages, /form\.style\.display = 'none'/);
  assert.match(publicPages, /copy\.style\.display = 'none'/);
  assert.match(
    css,
    /\.request-copy\[hidden\],[\s\S]*\.request-form\[hidden\] \{[\s\S]*display:\s*none !important/,
  );
  assert.doesNotMatch(publicPages, /alert\('정상적으로 처리되었습니다\.'\)/);
  assert.match(css, /\.request-page-video \{[\s\S]*object-fit:\s*cover/);
  assert.match(css, /\.request-page-video \{[\s\S]*opacity:\s*0\.9/);
  assert.match(css, /\.request-brand-modal \{/);
  assert.match(css, /\.request-brand-select-card \{/);
  assert.match(css, /\.request-brand-remove \{/);
  assert.match(
    css,
    /body\.request-route header \{[\s\S]*background:\s*transparent !important/,
  );
  assert.match(
    css,
    /body\.request-route header \{[\s\S]*backdrop-filter:\s*none/,
  );
  assert.match(
    css,
    /body\.request-route #app-container \{[\s\S]*padding-top:\s*0/,
  );
  assert.match(css, /\.request-page-shell[\s\S]*min-height:\s*100vh/);
  assert.match(
    css,
    /\.request-page-shell::after \{[\s\S]*width:\s*min\(50vw, 960px\)/,
  );
  assert.match(
    css,
    /\.request-page-shell::after \{[\s\S]*background:\s*rgba\(14, 16, 20, 0\.74\)/,
  );
  assert.ok(!css.includes("linear-gradient(90deg, rgba(14, 16, 20"));
  assert.ok(!css.includes("linear-gradient(180deg, rgba(14, 16, 20"));
  assert.ok(
    fs.existsSync(path.join(root, "public/assets/videos/request-form-bg.mp4")),
  );
  assert.ok(
    fs.existsSync(path.join(root, "public/assets/videos/login-modal-bg.mp4")),
  );
});

test("shared app footer matches the home footer layout", () => {
  const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "public/css/style.css"), "utf8");

  assert.match(html, /id="app-footer" class="site-footer"/);
  assert.match(html, /class="site-footer-brand"/);
  assert.match(html, /class="site-footer-links"/);
  assert.match(
    html,
    /<div>Office\. <span>인천 부평구 광장로 16, 부평역사쇼핑몰 6층<\/span><\/div>/,
  );
  assert.match(css, /\.site-footer \{[\s\S]*display:\s*flex/);
  assert.match(css, /\.site-footer \{[\s\S]*justify-content:\s*space-between/);
  assert.match(css, /\.site-footer-links \{[\s\S]*display:\s*flex/);
  assert.match(
    css,
    /@media \(max-width: 767px\) \{[\s\S]*\.site-footer \{[\s\S]*padding:\s*48px 24px/,
  );
  assert.match(
    css,
    /@media \(max-width: 767px\) \{[\s\S]*\.site-footer-links \{[\s\S]*flex-direction:\s*column/,
  );
});

test("router handles public portfolio, detail, and request routes", () => {
  const router = fs.readFileSync(
    path.join(root, "public/js/router.js"),
    "utf8",
  );

  assert.match(router, /#\/portfolio/);
  assert.match(router, /#\/portfolio\//);
  assert.match(router, /#\/request/);
  assert.match(router, /openPortfolioDetailFromRoute/);
});

test("home request section uses a blurred autoplaying video background", () => {
  const home = fs.readFileSync(path.join(root, "public/home.html"), "utf8");
  const videoPath = path.join(root, "public/assets/videos/main-request-bg.mp4");

  assert.ok(fs.existsSync(videoPath));
  assert.ok(
    home.includes('class="cta-bg-video" autoplay muted loop playsinline'),
  );
  assert.ok(home.includes('src="/assets/videos/main-request-bg.mp4"'));
  assert.ok(
    home.includes("filter: blur(14px) saturate(1.08) brightness(0.56);"),
  );
  assert.ok(home.includes("rgba(10, 10, 12, 0.38);"));
});

test("home page navigation anchors sections and ctas open pages", () => {
  const home = fs.readFileSync(path.join(root, "public/home.html"), "utf8");

  assert.ok(home.includes(`<li><a href="#portfolio">포트폴리오</a></li>`));
  assert.ok(home.includes(`<li><a href="#intro">소개</a></li>`));
  assert.ok(home.includes(`<li><a href="#cta">디자인의뢰</a></li>`));
  assert.ok(home.includes(`function scrollToSection(sectionId)`));
  assert.ok(home.includes(`id: "landing-portfolio"`));
  assert.ok(
    home.includes(
      `window.brandingFitLandingPortfolioTimeline = portfolioTimeline;`,
    ),
  );
  assert.ok(home.includes(`function getPortfolioTimeline()`));
  assert.ok(home.includes(`ScrollTrigger.getById("landing-portfolio")`));
  assert.ok(
    home.includes(`if (sectionId === "portfolio" && portfolioTrigger)`),
  );
  assert.ok(
    home.includes(
      `if (sectionId === "intro" && portfolioTrigger && portfolioTimeline)`,
    ),
  );
  assert.ok(home.includes(`const introStartTime = 0.92;`));
  assert.ok(!home.includes(`const introStartTime = 0.8;`));
  assert.ok(home.includes(`window.resetHeroInputs = function()`));
  assert.ok(home.includes(`selectedIndustryText.textContent = "업종";`));
  assert.ok(home.includes('id="customIndustryInput"'));
  assert.ok(home.includes('data-custom-industry-trigger="true"'));
  assert.ok(
    home.includes('if (value === "기타" && customValue) return customValue;'),
  );
  assert.ok(home.includes(`selectedKeywords = [];`));
  assert.ok(home.includes(`function scrollToHeroSection()`));
  assert.ok(home.includes(`document.querySelector(".hero-section")`));
  assert.ok(home.includes(`function resetHeroInputsAndGoHome()`));
  assert.ok(home.includes(`scrollToHeroSection();`));
  assert.ok(home.includes(`bindClick(".nav-logo", resetHeroInputsAndGoHome);`));
  assert.ok(!home.includes(`bindClick(".nav-logo", () => navigate("#/"));`));
  assert.ok(
    home.includes(
      `bindClick(".nav-links a[href='#portfolio']", () => scrollToSection("portfolio"));`,
    ),
  );
  assert.ok(
    home.includes(
      `bindClick(".nav-links a[href='#intro']", () => scrollToSection("intro"));`,
    ),
  );
  assert.ok(
    home.includes(
      `bindClick(".nav-links a[href='#cta']", () => scrollToSection("cta"));`,
    ),
  );
  assert.ok(
    home.includes(
      `class="portfolio-detail-link portfolio-preview-link" data-portfolio-id="urbanvibe"`,
    ),
  );
  assert.ok(
    home.includes(
      `class="portfolio-detail-link portfolio-preview-link" data-portfolio-id="godash"`,
    ),
  );
  assert.ok(
    home.includes(
      `class="portfolio-detail-link portfolio-preview-link" data-portfolio-id="skillupbase"`,
    ),
  );
  assert.ok(home.includes(`function openPortfolioDetailPage(event)`));
  assert.ok(
    home.includes(
      `bindClick(".portfolio-preview-link", openPortfolioDetailPage);`,
    ),
  );
  assert.ok(home.includes(`class="portfolio-detail-link portfolio-more-link"`));
  assert.ok(
    home.includes(`bindClick(".portfolio-more-link", openPortfolioPage);`),
  );
  assert.ok(home.includes(`bindClick(".cta-button", openRequestPage);`));
  assert.ok(
    !home.includes(
      `bindClick(".nav-links a[href='#/request']", openRequestPage);`,
    ),
  );
  assert.ok(
    !home.includes(
      `bindClick(".nav-auth button, #submitBrand, .intro-btn, .cta-button", saveDraftAndOpenWorkspace);`,
    ),
  );
});

test("workspace industry select uses portfolio categories", () => {
  const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
  const workspace = fs.readFileSync(
    path.join(root, "public/js/workspace.js"),
    "utf8",
  );

  [
    "카페•식당",
    "패션•뷰티",
    "브랜드•상품",
    "방송•엔터•게임",
    "반려동물•캐릭터",
    "플랫폼•어플",
    "서비스",
    "기타",
  ].forEach((category) => {
    assert.ok(
      html.includes(`<option value="${category}">${category}</option>`),
    );
  });

  assert.ok(!html.includes("카페 / 커피"));
  assert.ok(!html.includes("기타 (직접 입력)"));
  assert.ok(!html.includes('id="custom-industry-group"'));
  assert.ok(
    workspace.includes(`return categories.includes(value) ? value : '기타';`),
  );
  assert.ok(
    workspace.includes(
      `industryInput.dataset.customIndustry = mappedIndustry === '기타' && draft.industry !== '기타' ? draft.industry : '';`,
    ),
  );
  assert.ok(
    workspace.includes(
      `if (industry === '기타' && industryInput.dataset.customIndustry)`,
    ),
  );
  assert.ok(workspace.includes(`industrySelect.dataset.customIndustry = '';`));
});

test("workspace keeps generated logo scoped to the current brand session", () => {
  const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
  const workspace = fs.readFileSync(
    path.join(root, "public/js/workspace.js"),
    "utf8",
  );

  assert.match(workspace, /createBrandSession/);
  assert.match(workspace, /resetGeneratedAssetViews/);
  assert.match(
    workspace,
    /currentBrandData = createBrandSession\(\{[\s\S]*brand_id: data\.brand_id[\s\S]*dna: data\.dna/,
  );
  assert.ok(workspace.includes("logo_prompt"));
  assert.ok(workspace.includes("logo_is_mock"));
  assert.ok(workspace.includes("restoreLogoView();"));
  assert.ok(workspace.includes("renderLogoResult(currentBrandData);"));
  assert.ok(workspace.includes("resetMockupPreviewBoxes();"));
  assert.ok(
    workspace.includes(
      "Array.isArray(currentBrandData.mockups) && currentBrandData.mockups.length",
    ),
  );
  assert.ok(workspace.includes("const logoUrl = currentBrandData.logo_url;"));
  assert.ok(workspace.includes("mockup-applied-logo"));
  assert.ok(workspace.includes("mockup_image_url"));
  assert.ok(workspace.includes("renderInlineLogoMockup"));
  assert.ok(!html.includes("logo-prompt-display"));
  assert.ok(!workspace.includes("Prompt: "));
});

test("workspace loading copy uses Branding Fit AI instead of provider names", () => {
  const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
  const dnaLoadingStart = html.indexOf('id="workspace-loading-view"');
  const dnaLoadingEnd = html.indexOf('id="workspace-result-view"');
  const logoLoadingStart = html.indexOf('id="logo-loading-spinner"');
  const logoLoadingEnd = html.indexOf('id="logo-result-container"');
  const loadingCopy =
    html.slice(dnaLoadingStart, dnaLoadingEnd) +
    html.slice(logoLoadingStart, logoLoadingEnd);

  assert.match(
    loadingCopy,
    /Branding Fit AI가 당신의 브랜드 DNA를 정교하게 기획하고 있습니다/,
  );
  assert.match(
    loadingCopy,
    /Branding Fit AI가 고해상도 로고 이미지를 합성 중입니다/,
  );
  assert.doesNotMatch(loadingCopy, /Gemini AI가/);
  assert.doesNotMatch(loadingCopy, /Hugging Face AI가/);
});

test("footer support links open legal pages without inquiry link", () => {
  const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
  const home = fs.readFileSync(path.join(root, "public/home.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "public/css/style.css"), "utf8");

  const supportIndex = html.indexOf("<h3>고객지원</h3>");
  const supportSlice = html.slice(
    supportIndex,
    html.indexOf("<address>", supportIndex),
  );
  assert.ok(supportIndex > -1);
  assert.doesNotMatch(supportSlice, /문의하기/);
  assert.match(supportSlice, /href="#\/privacy"/);
  assert.match(supportSlice, /href="#\/terms"/);
  assert.doesNotMatch(home, /<h4>고객지원<\/h4>[\s\S]*문의하기/);
  assert.match(home, /href="#\/privacy" target="_parent"/);
  assert.match(home, /href="#\/terms" target="_parent"/);
  assert.match(home, /href\.startsWith\("#\/"\)[\s\S]*navigate\(href\)/);
  assert.match(css, /\.site-footer a:hover,[\s\S]*color:\s*#fff/);
});

test("legal policy and terms pages render and are routed", () => {
  const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "public/css/style.css"), "utf8");
  const router = fs.readFileSync(
    path.join(root, "public/js/router.js"),
    "utf8",
  );

  assert.match(html, /id="view-privacy" class="view legal-view"/);
  assert.match(html, /id="view-terms" class="view legal-view"/);
  assert.match(html, /PRIVACY POLICY/);
  assert.match(html, /AI API 제공자에게 전송할 수 있습니다/);
  assert.match(html, /TERMS OF SERVICE/);
  assert.match(html, /AI 생성 결과물의 성격/);
  assert.match(html, /href="#\/privacy" class="request-policy-link"/);
  assert.match(css, /\.legal-shell \{[\s\S]*min-height:\s*100vh/);
  assert.match(css, /\.legal-shell \{[\s\S]*background:\s*#0a0a0a/);
  assert.match(
    css,
    /body\.legal-route:not\(\.home-route\) > header \{[\s\S]*position:\s*relative/,
  );
  assert.match(
    css,
    /body\.legal-route > header \{[\s\S]*background:\s*#0a0a0a/,
  );
  assert.match(
    css,
    /body\.legal-route #app-container \{[\s\S]*padding-top:\s*0/,
  );
  assert.match(
    css,
    /body\.legal-route \.legal-hero \{[\s\S]*position:\s*static/,
  );
  assert.match(
    css,
    /@media \(min-width: 768px\) \{[\s\S]*body\.legal-route \.legal-layout \{[\s\S]*display:\s*grid/,
  );
  assert.match(
    css,
    /@media \(min-width: 768px\) \{[\s\S]*body\.legal-route \.legal-toc \{[\s\S]*position:\s*sticky/,
  );
  assert.match(
    css,
    /@media \(min-width: 768px\) \{[\s\S]*body\.legal-route \.legal-toc \{[\s\S]*top:\s*32px/,
  );
  assert.match(
    css,
    /\.legal-layout \{[\s\S]*grid-template-columns:\s*220px minmax\(0, 1fr\)/,
  );
  assert.match(css, /\.legal-clause \{[\s\S]*border-bottom/);
  assert.match(
    css,
    /\.legal-toc a\.is-active \{[\s\S]*border-bottom-color:\s*currentColor/,
  );
  assert.match(
    css,
    /@media \(min-width: 768px\) and \(max-width: 1023px\) \{[\s\S]*body\.legal-route \.legal-layout \{[\s\S]*grid-template-columns:\s*180px minmax\(0, 1fr\)/,
  );
  assert.match(router, /handleLegalTocClick/);
  assert.match(router, /event\.preventDefault\(\)/);
  assert.match(router, /scrollToLegalClause/);
  assert.match(router, /resolveLegalAnchorRoute/);
  assert.match(router, /#\/privacy/);
  assert.match(router, /#\/terms/);
  assert.match(router, /view-privacy/);
  assert.match(router, /view-terms/);
  assert.match(router, /legal-route/);
});

test("global top button below the chatbot cta scrolls the home frame to top", () => {
  const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "public/css/style.css"), "utf8");
  const chatbot = fs.readFileSync(
    path.join(root, "public/js/chatbot.js"),
    "utf8",
  );

  assert.match(html, /id="btn-scroll-top"/);
  assert.match(html, /class="scroll-top-btn"/);
  assert.ok(css.includes(".scroll-top-btn {"));
  assert.ok(css.includes("bottom: 2rem;"));
  assert.ok(css.includes("bottom: 6.75rem;"));
  assert.ok(css.includes("width: 60px;"));
  assert.ok(css.includes("height: 60px;"));
  assert.ok(css.includes("width: 52px;"));
  assert.ok(css.includes("height: 52px;"));
  assert.match(css, /\.scroll-top-btn \{[\s\S]*opacity:\s*0/);
  assert.match(css, /\.scroll-top-btn \{[\s\S]*pointer-events:\s*none/);
  assert.match(css, /\.scroll-top-btn\.is-visible \{[\s\S]*opacity:\s*1/);
  assert.match(chatbot, /function initScrollTopButton()/);
  assert.ok(chatbot.includes("getElementById('home-page-frame')"));
  assert.ok(chatbot.includes("brandingFitBridge?.scrollToHeroSection"));
  assert.match(chatbot, /function syncTopButtonVisibility\(\)/);
  assert.ok(
    chatbot.includes("homeWindow.document.querySelector('.hero-section')"),
  );
  assert.ok(
    chatbot.includes("topBtn.classList.toggle('is-visible', shouldShow)"),
  );
  assert.ok(
    chatbot.includes(
      "homeWindow.addEventListener('scroll', syncTopButtonVisibility",
    ),
  );
});
