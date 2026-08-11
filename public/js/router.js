window.addEventListener('hashchange', handleRouting);
window.addEventListener('load', handleRouting);
document.addEventListener('click', handleLegalTocClick);
window.addEventListener('scroll', updateLegalTocActive, { passive: true });

// 이미 홈(#/) 상태에서 마우스 휠로 스크롤을 내린 후 로고를 클릭했을 때 강제 최상단 스무스 스크롤 이동 처리
const logo = document.getElementById('nav-logo');
if (logo) {
    logo.addEventListener('click', (e) => {
        console.log('Logo clicked! Current hash:', window.location.hash);
        const currentHash = window.location.hash || '#/';
        if (currentHash === '#/' || currentHash === '#') {
            e.preventDefault();
            console.log('Forcing scroll to top smoothly...');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

function handleRouting() {
    let hash = window.location.hash || '#/';
    let pendingLegalAnchorId = null;
    const legalAnchorRoute = resolveLegalAnchorRoute(hash);
    if (legalAnchorRoute) {
        hash = legalAnchorRoute.route;
        pendingLegalAnchorId = legalAnchorRoute.anchorId;
        window.history.replaceState(null, '', hash);
    }
    
    hideAllViews(); // 모든 메인 뷰 레이어 숨기기
    updateGnbHighlight(hash); // GNB 메뉴 활성화 스타일 업데이트
    updateAppChromeVisibility(hash);
    
    if (hash === '#/' || hash === '#/intro') {
        const homeView = document.getElementById('view-home');
        if (homeView) {
            homeView.classList.add('active');
            
            // display: none -> block 전환 시 ScrollTrigger의 내부 계산 리프레시 필요
            if (typeof ScrollTrigger !== 'undefined') {
                // 레이아웃이 완전히 정렬된 직후 리프레시
                setTimeout(() => {
                    ScrollTrigger.refresh();
                }, 50);
            }
        }
        
        if (hash === '#/intro') {
            const introSection = document.getElementById('section-intro');
            if (introSection) {
                setTimeout(() => {
                    introSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
                    if (typeof ScrollTrigger !== 'undefined') {
                        setTimeout(() => { ScrollTrigger.refresh(); }, 400);
                    }
                }, 100);
            }
        } 
        else if (hash === '#/portfolio') {
            const portfolioSection = document.getElementById('section-portfolio');
            if (portfolioSection) {
                setTimeout(() => {
                    portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    if (typeof ScrollTrigger !== 'undefined') {
                        setTimeout(() => { ScrollTrigger.refresh(); }, 400);
                    }
                }, 100);
            }
        }
        else if (hash === '#/') {
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (typeof ScrollTrigger !== 'undefined') {
                    setTimeout(() => { ScrollTrigger.refresh(); }, 400);
                }
            }, 50);
        }
    } 
    else if (isPortfolioRoute(hash)) {
        const portfolioView = document.getElementById('view-portfolio');
        if (portfolioView) portfolioView.classList.add('active');
        if (typeof window.renderPortfolioPage === 'function') {
            window.renderPortfolioPage(hash);
        }
        if (hash.startsWith('#/portfolio/') && typeof window.openPortfolioDetailFromRoute === 'function') {
            window.openPortfolioDetailFromRoute(hash);
        }
    }
    else if (hash === '#/request') {
        const requestView = document.getElementById('view-request');
        if (requestView) requestView.classList.add('active');
    }
    else if (hash === '#/privacy') {
        const privacyView = document.getElementById('view-privacy');
        if (privacyView) privacyView.classList.add('active');
    }
    else if (hash === '#/terms') {
        const termsView = document.getElementById('view-terms');
        if (termsView) termsView.classList.add('active');
    }
    else if (hash === '#/workspace') {
        const workspaceView = document.getElementById('view-workspace');
        if (workspaceView) workspaceView.classList.add('active');
    } 
    else if (hash === '#/mypage') {
        const mypageView = document.getElementById('view-mypage');
        if (mypageView) mypageView.classList.add('active');
    }

    if (pendingLegalAnchorId) {
        setTimeout(() => scrollToLegalClause(pendingLegalAnchorId), 80);
    } else if (hash === '#/privacy' || hash === '#/terms') {
        setTimeout(updateLegalTocActive, 0);
    }
}

function handleLegalTocClick(event) {
    const link = event.target.closest('.legal-toc a[href^="#"]');
    if (!link) return;

    const legalView = link.closest('.legal-view.active');
    if (!legalView) return;

    const anchorId = link.getAttribute('href').slice(1);
    const target = document.getElementById(anchorId);
    if (!target || !legalView.contains(target)) return;

    event.preventDefault();
    scrollToLegalClause(anchorId);
}

function scrollToLegalClause(anchorId) {
    const target = document.getElementById(anchorId);
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveLegalTocLink(anchorId);
}

function updateLegalTocActive() {
    const legalView = document.querySelector('.legal-view.active');
    if (!legalView) return;

    const links = Array.from(legalView.querySelectorAll('.legal-toc a[href^="#"]'));
    if (!links.length) return;

    let activeId = links[0].getAttribute('href').slice(1);
    links.forEach(link => {
        const anchorId = link.getAttribute('href').slice(1);
        const target = document.getElementById(anchorId);
        if (target && target.getBoundingClientRect().top <= 170) {
            activeId = anchorId;
        }
    });
    setActiveLegalTocLink(activeId);
}

function setActiveLegalTocLink(anchorId) {
    const legalView = document.querySelector('.legal-view.active');
    if (!legalView) return;

    legalView.querySelectorAll('.legal-toc a[href^="#"]').forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${anchorId}`);
    });
}

function resolveLegalAnchorRoute(hash) {
    if (!hash || hash.startsWith('#/')) return null;

    const anchorId = hash.slice(1);
    const target = document.getElementById(anchorId);
    const legalView = target && target.closest('.legal-view');
    if (!legalView) return null;

    return {
        anchorId,
        route: legalView.id === 'view-terms' ? '#/terms' : '#/privacy'
    };
}

function hideAllViews() {
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
        view.classList.remove('active');
    });
}

function updateGnbHighlight(hash) {
    // 모든 GNB 링크의 active 클래스 제거
    const navLinks = document.querySelectorAll('#nav-menu-list a, #nav-logo');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // 해시 경로에 알맞은 메뉴에 active 클래스 매핑
    if (isPortfolioRoute(hash)) {
        const portLink = document.getElementById('nav-portfolio');
        if (portLink) portLink.classList.add('active');
    } else if (hash === '#/intro') {
        const introLink = document.getElementById('nav-intro');
        if (introLink) introLink.classList.add('active');
    } else if (hash === '#/workspace') {
        const startLink = document.getElementById('nav-start');
        if (startLink) startLink.classList.add('active');
    } else if (hash === '#/request') {
        const requestLink = document.getElementById('nav-request');
        if (requestLink) requestLink.classList.add('active');
    } else if (hash === '#/mypage') {
        const mypageLink = document.getElementById('nav-mypage');
        if (mypageLink) mypageLink.classList.add('active');
    } else if (hash === '#/privacy' || hash === '#/terms') {
        const logoLink = document.getElementById('nav-logo');
        if (logoLink) logoLink.classList.add('active');
    } else if (hash === '#/') {
        const logoLink = document.getElementById('nav-logo');
        if (logoLink) logoLink.classList.add('active');
    }
}


function isPortfolioRoute(hash) {
    return hash === '#/portfolio' || hash.startsWith('#/portfolio?') || hash.startsWith('#/portfolio/');
}

function updateAppChromeVisibility(hash) {
    const isHome = hash === '#/' || hash === '#' || hash === '#/intro';
    document.body.classList.toggle('home-route', isHome);
    document.body.classList.toggle('portfolio-route', isPortfolioRoute(hash));
    document.body.classList.toggle('request-route', hash === '#/request');
    document.body.classList.toggle('mypage-route', hash === '#/mypage');
    document.body.classList.toggle('legal-route', hash === '#/privacy' || hash === '#/terms');
}
