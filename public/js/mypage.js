// public/js/mypage.js

let mypageProfileImageDraft = "";

document.addEventListener("DOMContentLoaded", () => {
  initMyPage();
  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#/mypage") {
      loadMyPage();
    }
  });
});

function getScopedBrandStorageKey() {
  const auth = window.brandingFitAuth || {};
  const userId = auth.authenticated && auth.user ? auth.user.id : null;
  return userId
    ? `branding_fit_saved_brands:user:${userId}`
    : "branding_fit_saved_brands:guest";
}

async function waitForAuthState() {
  const auth = window.brandingFitAuth;
  if (
    auth &&
    auth.status === "loading" &&
    typeof auth.checkLoginStatus === "function"
  ) {
    await auth.checkLoginStatus();
  }
}

function initMyPage() {
  setupMyPageTabs();
  setupMyPageProfileEditor();
  setupMyPageBrandDetailModal();
  if (window.location.hash === "#/mypage") {
    loadMyPage();
  }
}

function setupMyPageTabs() {
  document.querySelectorAll("[data-mypage-tab]").forEach((button) => {
    if (button.dataset.bound === "true") return;
    button.dataset.bound = "true";
    button.addEventListener("click", () =>
      activateMyPageTab(button.dataset.mypageTab),
    );
  });
}

function activateMyPageTab(tabName) {
  const isRequests = tabName === "requests";
  document.querySelectorAll("[data-mypage-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.mypageTab === tabName);
  });
  document
    .getElementById("mypage-panel-brands")
    ?.classList.toggle("active", !isRequests);
  document
    .getElementById("mypage-panel-requests")
    ?.classList.toggle("active", isRequests);

  const title = document.getElementById("mypage-section-title");
  const desc = document.getElementById("mypage-section-description");
  const eyebrow = document.getElementById("mypage-section-eyebrow");
  if (eyebrow)
    eyebrow.textContent = isRequests ? "REQUEST ARCHIVE" : "MY ARCHIVE";
  if (title)
    title.textContent = isRequests
      ? "내 의뢰내역 보관함 (My Archive)"
      : "생성된 브랜드 보관함 (My Archive)";
  if (desc) {
    desc.textContent = isRequests
      ? "Branding Fit AI로 생성 브랜드를 더욱 멋지게 만들기 위해 의뢰한 목록입니다."
      : "Branding Fit AI로 생성하고 기획한 브랜드 DNA 및 로고 에셋 목록입니다.";
  }
}

async function loadMyPage() {
  await waitForAuthState();
  setupMyPageTabs();
  renderMyPageProfile();
  await Promise.all([loadMyPageBrands(), loadMyPageRequests()]);
}

function renderMyPageProfile() {
  const auth = window.brandingFitAuth || {};
  const user = auth.user || {};
  const nickname =
    user.nickname ||
    user.displayName ||
    user.username ||
    (user.email ? user.email.split("@")[0] : "회원");
  const provider = formatProviderName(user.provider || "");
  const email = user.email || "-";
  const profileImage = user.profile_image || "";
  const initials = getProfileInitials(nickname);

  const nicknameEl = document.getElementById("mypage-nickname");
  const nicknameInput = document.getElementById("mypage-nickname-input");
  const providerEl = document.getElementById("mypage-provider");
  const emailEl = document.getElementById("mypage-email");
  const avatarEl = document.getElementById("mypage-avatar");

  mypageProfileImageDraft = profileImage;
  if (nicknameEl) nicknameEl.textContent = nickname;
  if (nicknameInput) nicknameInput.value = nickname;
  if (providerEl) providerEl.textContent = provider;
  if (emailEl) emailEl.textContent = email;
  setMyPageProfileEditing(false);
  renderMyPageAvatar(profileImage, initials);
}

function renderMyPageAvatar(profileImage, initials) {
  const avatarEl = document.getElementById("mypage-avatar");
  if (!avatarEl) return;

  avatarEl.textContent = profileImage ? "" : initials;
  avatarEl.style.backgroundImage = profileImage ? `url(${profileImage})` : "";
  avatarEl.classList.toggle("has-image", Boolean(profileImage));
}

function setupMyPageProfileEditor() {
  const form = document.getElementById("mypage-profile-form");
  const editButton = document.getElementById("mypage-profile-edit-toggle");
  const uploadButton = document.getElementById("mypage-avatar-upload-btn");
  const imageInput = document.getElementById("mypage-avatar-input");
  const message = document.getElementById("mypage-profile-message");

  if (editButton && editButton.dataset.bound !== "true") {
    editButton.dataset.bound = "true";
    editButton.addEventListener("click", () => setMyPageProfileEditing(true));
  }

  if (uploadButton && imageInput && uploadButton.dataset.bound !== "true") {
    uploadButton.dataset.bound = "true";
    uploadButton.addEventListener("click", () => imageInput.click());
    imageInput.addEventListener("change", () =>
      handleMyPageProfileImageChange(imageInput, message),
    );
  }

  if (form && form.dataset.bound !== "true") {
    form.dataset.bound = "true";
    form.addEventListener("submit", handleMyPageProfileSubmit);
  }
}

function setMyPageProfileEditing(isEditing) {
  const form = document.getElementById("mypage-profile-form");
  const editButton = document.getElementById("mypage-profile-edit-toggle");
  const input = document.getElementById("mypage-nickname-input");

  if (form) form.hidden = !isEditing;
  if (editButton) {
    editButton.hidden = isEditing;
    editButton.setAttribute("aria-expanded", String(isEditing));
  }

  if (isEditing && input) {
    input.focus();
    input.select();
    showMyPageProfileMessage("");
  }
}

function handleMyPageProfileImageChange(input, messageEl) {
  const file = input.files && input.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showMyPageProfileMessage("이미지 파일만 선택해 주세요.", true);
    input.value = "";
    return;
  }

  if (file.size > 1.5 * 1024 * 1024) {
    showMyPageProfileMessage(
      "프로필 이미지는 1.5MB 이하로 선택해 주세요.",
      true,
    );
    input.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    mypageProfileImageDraft = String(reader.result || "");
    const nickname =
      document.getElementById("mypage-nickname-input")?.value ||
      document.getElementById("mypage-nickname")?.textContent ||
      "회원";
    renderMyPageAvatar(mypageProfileImageDraft, getProfileInitials(nickname));
    showMyPageProfileMessage(
      "이미지가 선택되었습니다. 저장을 눌러 반영해 주세요.",
    );
  };
  reader.onerror = () =>
    showMyPageProfileMessage("이미지를 읽지 못했습니다.", true);
  reader.readAsDataURL(file);
}

async function handleMyPageProfileSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = document.getElementById("mypage-profile-save");
  const nickname = String(form.nickname.value || "").trim();

  if (!nickname) {
    showMyPageProfileMessage("닉네임을 입력해 주세요.", true);
    return;
  }

  if (button) {
    button.disabled = true;
    button.textContent = "저장 중";
  }

  try {
    const response = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname,
        profileImage: mypageProfileImageDraft || "",
      }),
    });
    const data = await readProfileJsonResponse(response);
    if (!response.ok || !data.success)
      throw new Error(data.error || "profile update failed");

    window.brandingFitAuth.user = data.user;
    renderMyPageProfile();
    setMyPageProfileEditing(false);
    showMyPageProfileMessage("프로필이 저장되었습니다.");
  } catch (error) {
    console.error("Profile update failed:", error);
    showMyPageProfileMessage(
      error.message || "프로필 저장에 실패했습니다.",
      true,
    );
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "저장";
    }
  }
}

async function readProfileJsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  await response.text().catch(() => "");
  throw new Error(
    "프로필 저장 API가 HTML을 반환했습니다. 서버를 재시작한 뒤 다시 시도해 주세요.",
  );
}

function showMyPageProfileMessage(message, isError = false) {
  const messageEl = document.getElementById("mypage-profile-message");
  if (!messageEl) return;
  messageEl.textContent = message || "";
  messageEl.classList.toggle("error", Boolean(isError));
}

function formatProviderName(provider) {
  const normalized = String(provider || "").toLowerCase();
  if (normalized === "google") return "Google";
  if (normalized === "github") return "GitHub";
  if (normalized === "mock") return "Mock";
  return provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : "-";
}

function getProfileInitials(name) {
  const clean = String(name || "BF").trim();
  if (!clean) return "BF";
  const ascii = clean.match(/[A-Za-z0-9]/g);
  if (ascii && ascii.length) return ascii.slice(0, 2).join("").toUpperCase();
  return clean.slice(0, 2);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatRequestStatus(status) {
  const map = {
    received: "접수완료",
    reviewing: "검토중",
    progress: "진행중",
    done: "완료",
  };
  return map[status] || status || "접수완료";
}

async function loadMyPageBrands() {
  const grid = document.getElementById("mypage-brand-grid");
  const emptyState = document.getElementById("mypage-empty-state");
  if (!grid || !emptyState) return;

  grid.innerHTML =
    '<div style="grid-column: 1/-1; text-align:center; padding:3rem; color:var(--text-muted);">보관함 데이터를 불러오는 중입니다...</div>';
  emptyState.style.display = "none";

  let apiBrands = [];
  try {
    const res = await fetch("/api/brand/list");
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.brands)) {
        apiBrands = data.brands;
      }
    }
  } catch (err) {
    console.warn("Backend list fetch warning:", err);
  }

  let localBrands = [];
  try {
    const stored = localStorage.getItem(getScopedBrandStorageKey());
    if (stored) {
      localBrands = JSON.parse(stored);
    }
  } catch (e) {
    localBrands = [];
  }

  const combined = [...apiBrands];
  localBrands.forEach((localItem) => {
    if (
      !combined.some((b) => b.id && b.id === localItem.id) &&
      !combined.some((b) => b.brand_name === localItem.brand_name)
    ) {
      combined.push(localItem);
    }
  });

  if (combined.length === 0) {
    grid.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";
  grid.innerHTML = "";

  combined.forEach((brand) => {
    const card = createMyPageCard(brand);
    grid.appendChild(card);
  });
}

async function loadMyPageRequests() {
  const list = document.getElementById("mypage-request-list");
  const emptyState = document.getElementById("mypage-request-empty");
  if (!list || !emptyState) return;

  list.innerHTML =
    '<div style="text-align:center; padding:3rem; color:var(--text-muted);">의뢰내역을 불러오는 중입니다...</div>';
  emptyState.style.display = "none";

  let requests = [];
  try {
    const res = await fetch("/api/request/list");
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        requests = data.requests;
      }
    }
  } catch (err) {
    console.warn("Design request list fetch warning:", err);
  }

  if (requests.length === 0) {
    list.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";
  list.innerHTML = "";
  requests.forEach((request) => list.appendChild(createRequestCard(request)));
}

function createRequestCard(request) {
  const card = document.createElement("article");
  card.className = "mypage-request-card";
  const name = escapeHtml(request.name || "의뢰자");
  const email = escapeHtml(request.email || "-");
  const content = escapeHtml(request.content || "내용 없음");
  const status = escapeHtml(formatRequestStatus(request.status));
  const date = escapeHtml(formatDate(request.created_at));
  const phone = request.phone ? escapeHtml(request.phone) : "미입력";
  const brandName = request.brand_name
    ? escapeHtml(request.brand_name)
    : "미선택";
  const attachment = request.attachment_name
    ? escapeHtml(request.attachment_name)
    : "첨부 없음";

  card.innerHTML = `
        <div class="mypage-request-main">
            <div class="mypage-request-thumb" aria-hidden="true"></div>
            <div>
                <div class="mypage-request-meta-row">
                    <span class="mypage-status-pill">${status}</span>
                    <h3>디자인 의뢰</h3>
                </div>
                <div class="mypage-request-content"><span style="display:block; color:rgba(255,255,255,0.38); font-size:13px; margin-bottom:8px;">의뢰 내용</span>${content}</div>
                <div class="mypage-request-info">
                    <span>의뢰자명 : <strong>${name}</strong></span>
                    <span>브랜드명 : <strong>${brandName}</strong></span>
                    <span>이메일 : <strong>${email}</strong></span>
                    <span>첨부파일 : <strong>${attachment}</strong></span>
                    <span>연락처 : <strong>${phone}</strong></span>
                </div>
            </div>
        </div>
        <div class="mypage-request-footer">
            <span>의뢰일 : ${date}</span>
            <a href="#/request">추가 의뢰하기 ↗</a>
        </div>
    `;
  return card;
}

function createMyPageCard(brand) {
  const card = document.createElement("div");
  card.className = "mockup-card";
  card.style.position = "relative";
  card.style.display = "flex";
  card.style.flexDirection = "column";
  card.style.justify = "space-between";

  const logoSrc = brand.logo_url || "";
  const pColor = brand.primary_color || "#6366F1";
  const sColor = brand.secondary_color || "#818CF8";
  const ptColor = brand.point_color || "#4F46E5";
  const fontTitle = brand.font_title || "Outfit";
  const fontBody = brand.font_body || "Pretendard";
  const initial = (brand.brand_name || "B").substring(0, 2).toUpperCase();

  let logoHtml = `<div style="width:65px; height:65px; border-radius:12px; background:${pColor}; color:white; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:1.4rem; font-family:var(--font-title); box-shadow:0 4px 12px rgba(0,0,0,0.3); flex-shrink:0;">${initial}</div>`;

  if (logoSrc) {
    logoHtml = `<img src="${logoSrc}?t=${Date.now()}" alt="${brand.brand_name}" style="width:65px; height:65px; object-fit:contain; border-radius:12px; background:#0D0D18; border:1px solid rgba(255,255,255,0.1); padding:4px; flex-shrink:0;" />`;
  }

  const createdDate = brand.created_at
    ? new Date(brand.created_at).toLocaleDateString("ko-KR")
    : "방금 전";

  card.innerHTML = `
        <button class="btn-delete-brand" data-id="${brand.id || ""}" data-name="${brand.brand_name}" style="position:absolute; top:1rem; right:1rem; background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3); color:#EF4444; width:28px; height:28px; border-radius:50%; cursor:pointer; font-weight:bold; z-index:2;" title="삭제">&times;</button>
        
        <div>
            <!-- 헤더: 로고 및 타이틀 -->
            <div style="display:flex; gap:1rem; align-items:center; margin-bottom:1rem; padding-right:1.8rem;">
                ${logoHtml}
                <div style="min-width:0;">
                    <div style="display:flex; gap:0.4rem; flex-wrap:wrap; margin-bottom:0.2rem;">
                        <span class="brand-badge" style="font-size:0.75rem; padding:0.15rem 0.5rem;">${brand.industry || "일반"}</span>
                        <span class="brand-badge" style="font-size:0.75rem; padding:0.15rem 0.5rem; background:rgba(99,102,241,0.15); color:var(--primary-02);">🎯 ${brand.target_age || "전 연령층"}</span>
                    </div>
                    <h3 style="font-family:var(--font-title); font-size:1.25rem; color:var(--text-primary); margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${brand.brand_name}</h3>
                </div>
            </div>

            <!-- 슬로건 -->
            <div style="font-size:0.9rem; font-weight:600; color:var(--primary-02); margin-bottom:0.8rem; font-style:italic;">
                "${brand.slogan || "당신을 위한 최적의 브랜딩"}"
            </div>

            <!-- 브랜드 페르소나 전체 내용 (스크롤가능) -->
            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); padding:0.8rem; border-radius:10px; margin-bottom:1rem; max-height:110px; overflow-y:auto;">
                <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:0.3rem;">📖 브랜드 페르소나 & 핵심 가치관</label>
                <p style="font-size:0.82rem; color:var(--text-secondary); line-height:1.5; margin:0;">
                    ${brand.persona || "AI 브랜딩 솔루션을 통해 생성된 브랜드입니다."}
                </p>
            </div>

            <!-- 브랜드 컬러 & 서체 시스템 정보 -->
            <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04); padding:0.7rem; border-radius:10px; margin-bottom:1.2rem; display:flex; flex-direction:column; gap:0.5rem;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:0.75rem; color:var(--text-muted);">컬러 팔레트:</span>
                    <div style="display:flex; gap:0.5rem; align-items:center; font-size:0.75rem; color:var(--text-secondary);">
                        <span style="display:inline-flex; align-items:center; gap:0.2rem;"><i style="width:10px; height:10px; border-radius:50%; background:${pColor}; display:inline-block;"></i> ${pColor.toUpperCase()}</span>
                        <span style="display:inline-flex; align-items:center; gap:0.2rem;"><i style="width:10px; height:10px; border-radius:50%; background:${sColor}; display:inline-block;"></i> ${sColor.toUpperCase()}</span>
                        <span style="display:inline-flex; align-items:center; gap:0.2rem;"><i style="width:10px; height:10px; border-radius:50%; background:${ptColor}; display:inline-block;"></i> ${ptColor.toUpperCase()}</span>
                    </div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:0.75rem; color:var(--text-muted);">지정 서체:</span>
                    <span style="font-size:0.75rem; color:var(--text-primary);">제목: <strong>${fontTitle}</strong> | 본문: <strong>${fontBody}</strong></span>
                </div>
            </div>
        </div>

        <div>
            <!-- 하단 정보 & 액션 버튼 -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.08); padding-top:0.8rem; margin-bottom:0.8rem;">
                <span style="font-size:0.75rem; color:var(--text-muted);">생성일: ${createdDate}</span>
                <button class="btn-view-brand-detail" style="background:none; border:none; color:var(--primary-02); font-size:0.8rem; cursor:pointer; font-weight:600; text-decoration:underline;">전체 상세 보기</button>
            </div>

            <button class="btn-form btn-download-card-pdf" style="width:100%; font-size:0.85rem; padding:0.65rem; background:linear-gradient(135deg, var(--primary-01), var(--primary-03)); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600;">
                📄 가이드북 PDF 발급
            </button>
        </div>
    `;

  // Download PDF event
  const pdfBtn = card.querySelector(".btn-download-card-pdf");
  if (pdfBtn) {
    pdfBtn.addEventListener("click", async () => {
      pdfBtn.disabled = true;
      pdfBtn.textContent = "📄 PDF 생성 중...";
      try {
        let url = "/api/brand/pdf";
        let options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(brand),
        };
        if (brand.id) {
          url = `/api/brand/${brand.id}/pdf`;
          options = { method: "GET" };
        }

        const res = await fetch(url, options);
        if (!res.ok) throw new Error("PDF Server Error");

        const blob = await res.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `Brand_Guidebook_${(brand.brand_name || "Brand").replace(/\s+/g, "_")}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } catch (err) {
        alert("PDF 다운로드에 실패했습니다.");
      } finally {
        pdfBtn.disabled = false;
        pdfBtn.textContent = "📄 가이드북 PDF 발급";
      }
    });
  }

  // Detail Modal Event
  const detailBtn = card.querySelector(".btn-view-brand-detail");
  if (detailBtn) {
    detailBtn.addEventListener("click", () => {
      openBrandDetailModal(brand);
    });
  }

  // Delete Brand event
  const deleteBtn = card.querySelector(".btn-delete-brand");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      if (
        !confirm(`"${brand.brand_name}" 브랜드를 보관함에서 삭제하시겠습니까?`)
      )
        return;

      if (brand.id) {
        try {
          await fetch(`/api/brand/${brand.id}`, { method: "DELETE" });
        } catch (e) {
          console.error("Delete DB error:", e);
        }
      }

      // Remove from local storage if exists
      try {
        let stored = JSON.parse(
          localStorage.getItem(getScopedBrandStorageKey()) || "[]",
        );
        stored = stored.filter((b) => b.brand_name !== brand.brand_name);
        localStorage.setItem(
          getScopedBrandStorageKey(),
          JSON.stringify(stored),
        );
      } catch (e) {}

      loadMyPageBrands();
    });
  }

  return card;
}

function parseBrandJsonField(value, fallback) {
  if (!value) return fallback;
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function normalizeBrandMockups(brand) {
  const mockups = parseBrandJsonField(brand.mockup_urls, brand.mockups || []);
  if (!Array.isArray(mockups)) return [];
  return mockups
    .map((mockup) => {
      if (typeof mockup === "string")
        return { mockup_image_url: mockup, label: "패키지 목업" };
      return mockup || null;
    })
    .filter(Boolean)
    .filter(
      (mockup) => mockup.mockup_image_url || mockup.url || mockup.image_url,
    );
}

function setupMyPageBrandDetailModal() {
  const modal = document.getElementById("brand-detail-modal");
  if (!modal || modal.dataset.bound === "true") return;
  modal.dataset.bound = "true";

  modal.querySelectorAll("[data-brand-detail-close]").forEach((element) => {
    element.addEventListener("click", closeBrandDetailModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("active")) {
      closeBrandDetailModal();
    }
  });

  const topButton = document.getElementById("brand-detail-top");
  if (topButton) {
    topButton.addEventListener("click", () => {
      const scroller = document.getElementById("brand-detail-scroll");
      if (scroller) scroller.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const scroller = document.getElementById("brand-detail-scroll");
  if (scroller) {
    scroller.addEventListener("scroll", updateBrandDetailScrollState, {
      passive: true,
    });
  }

  modal
    .querySelectorAll('.portfolio-detail-sidebar a[href^="#"]')
    .forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        event.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        const scroller = document.getElementById("brand-detail-scroll");
        if (target && scroller) {
          scroller.scrollTo({ top: target.offsetTop, behavior: "smooth" });
        }
      });
    });
}

function openBrandDetailModal(brand) {
  const modal = document.getElementById("brand-detail-modal");
  if (!modal) return;

  const brandName = brand.brand_name || "My Brand";
  const logoSrc = brand.logo_url || "";
  const pCol = brand.primary_color || "#6366F1";
  const sCol = brand.secondary_color || "#818CF8";
  const ptCol = brand.point_color || "#4F46E5";
  const fonts = [brand.font_title || "Outfit", brand.font_body || "Pretendard"];

  const badge = document.getElementById("detail-modal-badge");
  if (badge) {
    badge.innerHTML = logoSrc
      ? '<img src="' +
        logoSrc +
        "?t=" +
        Date.now() +
        '" alt="' +
        escapeHtml(brandName) +
        ' 로고">'
      : "<span>" + escapeHtml(brandName.slice(0, 2).toUpperCase()) + "</span>";
  }

  const category = document.getElementById("detail-modal-category");
  const title = document.getElementById("detail-modal-title");
  const slogan = document.getElementById("detail-modal-slogan");
  const persona = document.getElementById("detail-modal-persona");
  const fontText = document.getElementById("detail-modal-val-fonts");

  if (category) category.textContent = brand.industry || "일반";
  if (title) title.textContent = brandName;
  if (slogan)
    slogan.textContent = `"${brand.slogan || "당신을 위한 최적의 브랜딩"}"`;
  if (persona)
    persona.textContent =
      brand.persona || "AI 브랜딩 솔루션을 통해 기획된 브랜드입니다.";
  if (fontText) fontText.textContent = `지정 서체: ${fonts.join(" / ")}`;

  const logoContainer = document.getElementById("brand-detail-logo");
  if (logoContainer) {
    logoContainer.innerHTML = logoSrc
      ? '<img src="' +
        logoSrc +
        "?t=" +
        Date.now() +
        '" alt="' +
        escapeHtml(brandName) +
        ' 로고">'
      : '<span id="brand-detail-logo-label">' +
        escapeHtml(brandName) +
        "</span>";
    logoContainer.style.background = "#f7f6f1";
  }

  const colorList = document.getElementById("brand-detail-colors");
  if (colorList) {
    colorList.innerHTML = [pCol, sCol, ptCol]
      .map(
        (color) =>
          '<div class="portfolio-color-chip" style="--chip-color:' +
          escapeHtml(color) +
          '">' +
          "<span>" +
          escapeHtml(String(color).toUpperCase()) +
          "</span>" +
          "</div>",
      )
      .join("");
  }

  const mockupList = document.getElementById("brand-detail-mockups-list");
  if (mockupList) {
    const mockups = normalizeBrandMockups(brand);
    mockupList.innerHTML = mockups.length
      ? mockups
          .map((mockup, index) => {
            const image =
              mockup.mockup_image_url || mockup.url || mockup.image_url;
            const label = mockup.label || "패키지 목업 " + (index + 1);
            return (
              '<img class="portfolio-mockup-image" src="' +
              escapeHtml(image) +
              '" alt="' +
              escapeHtml(brandName + " " + label) +
              '">'
            );
          })
          .join("")
      : '<div class="portfolio-blank-visual portfolio-blank-wide"></div><div class="portfolio-blank-visual portfolio-blank-tall"></div><div class="portfolio-blank-visual portfolio-blank-wide muted"></div>';
  }

  const modalPdfBtn = document.getElementById("btn-detail-modal-pdf");
  if (modalPdfBtn) {
    modalPdfBtn.onclick = () => downloadBrandPdfFromModal(brand, modalPdfBtn);
    modalPdfBtn.disabled = false;
    modalPdfBtn.textContent = "가이드북 PDF 발급";
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("portfolio-modal-open");

  const scroller = document.getElementById("brand-detail-scroll");
  if (scroller) scroller.scrollTop = 0;
  updateBrandDetailScrollState();
}

function updateBrandDetailScrollState() {
  const modal = document.getElementById("brand-detail-modal");
  const scroller = document.getElementById("brand-detail-scroll");
  const mockups = document.getElementById("brand-detail-mockups");
  if (!modal || !scroller || !mockups) return;

  const reachedPackage =
    scroller.scrollTop >= Math.max(0, mockups.offsetTop - 96);
  modal.classList.toggle("is-package-visible", reachedPackage);

  const anchors = modal.querySelectorAll(
    '.portfolio-detail-sidebar a[href^="#"]',
  );
  let activeId = "brand-detail-logo";
  anchors.forEach((anchor) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target && scroller.scrollTop >= target.offsetTop - 120) {
      activeId = target.id;
    }
  });
  anchors.forEach((anchor) => {
    anchor.classList.toggle(
      "active",
      anchor.getAttribute("href") === "#" + activeId,
    );
  });
}

function closeBrandDetailModal() {
  const modal = document.getElementById("brand-detail-modal");
  if (!modal) return;
  modal.classList.remove("active", "is-package-visible");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("portfolio-modal-open");
}

async function downloadBrandPdfFromModal(brand, button) {
  button.disabled = true;
  button.textContent = "PDF 생성 중...";
  try {
    let url = "/api/brand/pdf";
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(brand),
    };
    if (brand.id) {
      url = `/api/brand/${brand.id}/pdf`;
      options = { method: "GET" };
    }

    const res = await fetch(url, options);
    if (!res.ok) throw new Error("PDF Server Error");

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `Brand_Guidebook_${(brand.brand_name || "Brand").replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (err) {
    alert("PDF 다운로드에 실패했습니다.");
  } finally {
    button.disabled = false;
    button.textContent = "가이드북 PDF 발급";
  }
}
