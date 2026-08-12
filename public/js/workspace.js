// public/js/workspace.js

document.addEventListener("DOMContentLoaded", () => {
  initWorkspace();
});

function getScopedBrandStorageKey() {
  const auth = window.brandingFitAuth || {};
  const userId = auth.authenticated && auth.user ? auth.user.id : null;
  return userId
    ? `branding_fit_saved_brands:user:${userId}`
    : "branding_fit_saved_brands:guest";
}

function initWorkspace() {
  const form = document.getElementById("brand-dna-form");
  if (!form) return;

  const keywordInput = document.getElementById("input-keyword");
  const tagsContainer = document.getElementById("keyword-tags-container");
  const formView = document.getElementById("workspace-form-view");
  const loadingView = document.getElementById("workspace-loading-view");
  const resultView = document.getElementById("workspace-result-view");
  const logoView = document.getElementById("workspace-logo-view");
  const mockupView = document.getElementById("workspace-mockup-view");
  const guidebookView = document.getElementById("workspace-guidebook-view");
  // Action Buttons
  const restartBtn = document.getElementById("btn-restart-dna");
  const goLogoStepBtn = document.getElementById("btn-go-logo-step");
  const backToDnaBtn = document.getElementById("btn-back-to-dna");
  const generateLogoBtn = document.getElementById("btn-generate-logo");
  const goMockupStepBtn = document.getElementById("btn-go-mockup-step");
  const backToLogoBtn = document.getElementById("btn-back-to-logo");

  let keywordsList = [];
  let currentBrandData = {
    brand_id: null,
    brand_name: "",
    industry: "",
    dna: null,
    logo_url: "",
    logo_prompt: "",
    logo_is_mock: false,
    mockups: [],
  };
  const initialMockupMarkup = {};
  ["mockup-box-card", "mockup-box-bag", "mockup-box-cup"].forEach((id) => {
    const box = document.getElementById(id);
    if (box) initialMockupMarkup[id] = box.innerHTML;
  });

  // Tag chip handling
  if (keywordInput && tagsContainer) {
    keywordInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const val = keywordInput.value.trim();

        if (!val) return;

        if (keywordsList.length >= 3) {
          alert("키워드는 최대 3개까지만 입력할 수 있습니다.");
          keywordInput.value = "";
          return;
        }

        if (keywordsList.includes(val)) {
          alert("이미 추가된 키워드입니다.");
          keywordInput.value = "";
          return;
        }

        keywordsList.push(val);
        keywordInput.value = "";
        renderTags();
      }
    });
  }

  function renderTags() {
    tagsContainer.innerHTML = "";
    keywordsList.forEach((tag, idx) => {
      const chip = document.createElement("span");
      chip.className = "tag-chip";
      chip.innerHTML = `
                ${tag} 
                <span class="remove-tag" data-index="${idx}">&times;</span>
            `;
      tagsContainer.appendChild(chip);
    });

    // Add remove click listener
    const removeBtns = tagsContainer.querySelectorAll(".remove-tag");
    removeBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.target.getAttribute("data-index"));
        keywordsList.splice(idx, 1);
        renderTags();
      });
    });
  }

  function mapHomeIndustryToWorkspace(industry) {
    const value = industry || "";
    const categories = [
      "카페•식당",
      "패션•뷰티",
      "브랜드•상품",
      "방송•엔터•게임",
      "반려동물•캐릭터",
      "플랫폼•어플",
      "서비스",
      "기타",
    ];
    return categories.includes(value) ? value : "기타";
  }

  function applyHomeDraftToWorkspace() {
    let draft = null;
    try {
      draft = JSON.parse(
        localStorage.getItem("branding_fit_home_draft") || "null",
      );
    } catch (e) {
      draft = null;
    }

    if (!draft) return;

    const brandNameInput = document.getElementById("input-brand-name");
    const industryInput = document.getElementById("input-industry");
    if (brandNameInput && draft.brandName) {
      brandNameInput.value = draft.brandName;
    }

    if (industryInput && draft.industry) {
      const mappedIndustry = mapHomeIndustryToWorkspace(draft.industry);
      const hasOption = Array.from(industryInput.options).some(
        (option) => option.value === mappedIndustry,
      );
      industryInput.value = hasOption ? mappedIndustry : "기타";
      industryInput.dataset.customIndustry =
        mappedIndustry === "기타" && draft.industry !== "기타"
          ? draft.industry
          : "";
    }

    if (Array.isArray(draft.keywords)) {
      keywordsList = draft.keywords.slice(0, 3);
      renderTags();
    }

    localStorage.removeItem("branding_fit_home_draft");
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#/workspace") {
      setTimeout(applyHomeDraftToWorkspace, 80);
    }
  });

  const industrySelect = document.getElementById("input-industry");
  if (industrySelect) {
    industrySelect.addEventListener("change", () => {
      industrySelect.dataset.customIndustry = "";
    });
  }

  if (window.location.hash === "#/workspace") {
    setTimeout(applyHomeDraftToWorkspace, 80);
  }

  // Submit handler: Step 1 -> Step 2
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const brandName = document.getElementById("input-brand-name").value.trim();
    const industryInput = document.getElementById("input-industry");
    let industry = industryInput.value;
    if (industry === "기타" && industryInput.dataset.customIndustry) {
      industry = industryInput.dataset.customIndustry;
    }
    const usp = document.getElementById("input-usp").value.trim();
    const targetAge = document.getElementById("input-target-age").value;

    if (!brandName || !industry) {
      alert("브랜드 이름과 업종은 필수 입력 항목입니다.");
      return;
    }

    // Show loading state
    formView.classList.remove("workspace-view-active");
    loadingView.style.display = "flex";
    updateStepsProgress(2);

    try {
      const response = await fetch("/api/brand/generate-dna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand_name: brandName,
          industry: industry,
          keywords: keywordsList,
          usp: usp,
          target_age: targetAge,
        }),
      });

      const data = await response.json();

      if (data.success) {
        currentBrandData = createBrandSession({
          brand_id: data.brand_id,
          brand_name: brandName,
          industry,
          dna: data.dna,
        });
        resetGeneratedAssetViews();

        renderResult(data.dna, brandName, industry);

        loadingView.style.display = "none";
        resultView.classList.add("workspace-view-active");

        // Save to LocalStorage for My Page archive
        saveBrandToLocalStorage(currentBrandData);
      } else {
        alert("브랜드 DNA 생성에 실패했습니다. 다시 시도해 주세요.");
        resetToForm();
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("서버와의 통신에 오류가 발생했습니다.");
      resetToForm();
    }
  });

  // Navigation: Step 2 -> Step 3 (Logo Generation View)
  if (goLogoStepBtn) {
    goLogoStepBtn.addEventListener("click", () => {
      resultView.classList.remove("workspace-view-active");
      logoView.classList.add("workspace-view-active");
      restoreLogoView();
      updateStepsProgress(3);
    });
  }

  // Navigation: Step 3 -> Step 2
  if (backToDnaBtn) {
    backToDnaBtn.addEventListener("click", () => {
      logoView.classList.remove("workspace-view-active");
      resultView.classList.add("workspace-view-active");
      updateStepsProgress(2);
    });
  }

  // Step 3: Generate AI Logo Handler
  if (generateLogoBtn) {
    generateLogoBtn.addEventListener("click", async () => {
      const styleSelect = document.getElementById("logo-style-select");
      const logoStyle = styleSelect ? styleSelect.value : "minimal";
      const logoSpinner = document.getElementById("logo-loading-spinner");
      const logoResultContainer = document.getElementById(
        "logo-result-container",
      );

      logoSpinner.style.display = "flex";
      logoResultContainer.style.display = "none";

      try {
        const response = await fetch("/api/logo/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brand_id: currentBrandData.brand_id,
            brand_name: currentBrandData.brand_name || "My Brand",
            industry: currentBrandData.industry || "Business",
            primary_color: currentBrandData.dna
              ? currentBrandData.dna.primary_color
              : "#6366F1",
            secondary_color: currentBrandData.dna
              ? currentBrandData.dna.secondary_color
              : "#818CF8",
            style: logoStyle,
          }),
        });

        const data = await response.json();
        logoSpinner.style.display = "none";

        if (data.success) {
          currentBrandData.logo_url = data.logo_url;
          currentBrandData.logo_prompt = data.prompt || "";
          currentBrandData.logo_is_mock = true;
          currentBrandData.mockups = [];
          resetMockupPreviewBoxes();
          renderLogoResult(currentBrandData);

          // Save to LocalStorage for My Page archive
          saveBrandToLocalStorage(currentBrandData);
        } else {
          alert(data.error || "로고 생성 중 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("Logo API Error:", error);
        logoSpinner.style.display = "none";
        alert("로고 생성 서버와의 통신에 실패했습니다.");
      }
    });
  }

  // HTML5 Logo Editor Panel Handler
  function initLogoEditor(brandData) {
    const editorPanel = document.getElementById("logo-editor-panel");
    if (!editorPanel) return;

    editorPanel.style.display = "block";

    const textInput = document.getElementById("editor-text-input");
    const fontSizeInput = document.getElementById("editor-font-size");
    const primaryColorInput = document.getElementById("editor-primary-color");
    const bgColorInput = document.getElementById("editor-bg-color");

    if (textInput) textInput.value = brandData.brand_name || "";
    if (primaryColorInput && brandData.dna)
      primaryColorInput.value = brandData.dna.primary_color || "#6366F1";
    if (bgColorInput) bgColorInput.value = "#0D0D18";

    const logoTypography = document.getElementById("logo-brand-typography");
    const logoFrame = document.getElementById("logo-image-frame");

    function updateLivePreview() {
      if (logoTypography && textInput) {
        logoTypography.textContent =
          textInput.value.trim() || brandData.brand_name;
      }
      if (logoTypography && fontSizeInput) {
        logoTypography.style.fontSize = `${fontSizeInput.value || 22}px`;
      }
      if (logoTypography && primaryColorInput) {
        logoTypography.style.color = primaryColorInput.value;
      }
      if (logoFrame && bgColorInput) {
        logoFrame.style.backgroundColor = bgColorInput.value;
      }
    }

    [textInput, fontSizeInput, primaryColorInput, bgColorInput].forEach(
      (input) => {
        if (input) input.oninput = updateLivePreview;
      },
    );

    // Download SVG
    const btnSvg = document.getElementById("btn-download-svg");
    if (btnSvg) {
      btnSvg.onclick = () => {
        const brandName =
          (textInput ? textInput.value : brandData.brand_name) || "Brand";
        const pColor = primaryColorInput ? primaryColorInput.value : "#6366F1";
        const bgColor = bgColorInput ? bgColorInput.value : "#0D0D18";

        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <rect width="100%" height="100%" fill="${bgColor}" rx="24"/>
  <circle cx="150" cy="120" r="55" fill="${pColor}" opacity="0.85"/>
  <text x="150" y="128" font-family="sans-serif" font-size="44" font-weight="bold" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">${brandName.substring(0, 2).toUpperCase()}</text>
  <text x="150" y="235" font-family="sans-serif" font-size="${fontSizeInput ? fontSizeInput.value : 22}" font-weight="bold" fill="${pColor}" text-anchor="middle">${brandName}</text>
</svg>`;

        const blob = new Blob([svgContent], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `logo_${brandName.replace(/\s+/g, "_")}.svg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      };
    }

    // Download PNG (via Canvas)
    const btnPng = document.getElementById("btn-download-png");
    if (btnPng) {
      btnPng.onclick = () => {
        const brandName =
          (textInput ? textInput.value : brandData.brand_name) || "Brand";
        const pColor = primaryColorInput ? primaryColorInput.value : "#6366F1";
        const bgColor = bgColorInput ? bgColorInput.value : "#0D0D18";

        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext("2d");

        // Draw background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 400, 400);

        // Draw logo circle symbol
        ctx.beginPath();
        ctx.arc(200, 160, 75, 0, Math.PI * 2);
        ctx.fillStyle = pColor;
        ctx.fill();

        // Draw initial text inside circle
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 56px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(brandName.substring(0, 2).toUpperCase(), 200, 160);

        // Draw brand typography text
        ctx.fillStyle = pColor;
        ctx.font = `bold ${fontSizeInput ? fontSizeInput.value : 24}px sans-serif`;
        ctx.fillText(brandName, 200, 310);

        const dataUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `logo_${brandName.replace(/\s+/g, "_")}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      };
    }
  }

  // PDF Guidebook Download Handler (Step 4)
  const pdfBtn = document.getElementById("btn-download-pdf-guidebook");
  if (pdfBtn) {
    pdfBtn.addEventListener("click", async () => {
      if (!currentBrandData.brand_name) {
        alert("가이드북을 생성할 브랜드 데이터가 존재하지 않습니다.");
        return;
      }

      pdfBtn.disabled = true;
      pdfBtn.textContent = "📄 가이드북 PDF 생성 중...";

      try {
        let url = "/api/brand/pdf";
        let options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brand_name: currentBrandData.brand_name,
            industry: currentBrandData.industry,
            slogan: currentBrandData.dna ? currentBrandData.dna.slogan : "",
            persona: currentBrandData.dna ? currentBrandData.dna.persona : "",
            primary_color: currentBrandData.dna
              ? currentBrandData.dna.primary_color
              : "#6366F1",
            secondary_color: currentBrandData.dna
              ? currentBrandData.dna.secondary_color
              : "#818CF8",
            point_color: currentBrandData.dna
              ? currentBrandData.dna.point_color
              : "#4F46E5",
            font_title: currentBrandData.dna
              ? currentBrandData.dna.font_title
              : "Outfit",
            font_body: currentBrandData.dna
              ? currentBrandData.dna.font_body
              : "Pretendard",
            logo_url: currentBrandData.logo_url,
            mockups: currentBrandData.mockups || [],
          }),
        };

        if (currentBrandData.brand_id) {
          url = `/api/brand/${currentBrandData.brand_id}/pdf`;
          options = { method: "GET" };
        }

        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`Server status ${res.status}`);

        const blob = await res.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `Brand_Guidebook_${(currentBrandData.brand_name || "Brand").replace(/\s+/g, "_")}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);

        // Advance to Step 5 (완료 & 가이드북 통합 뷰)
        renderGuidebookView();
        mockupView.classList.remove("workspace-view-active");
        if (guidebookView) guidebookView.classList.add("workspace-view-active");
        updateStepsProgress(5);
      } catch (err) {
        console.error("PDF download error:", err);
        alert("가이드북 PDF 다운로드 중 오류가 발생했습니다.");
      } finally {
        pdfBtn.disabled = false;
        pdfBtn.textContent = "📄 브랜드 가이드북 PDF 다운로드 →";
      }
    });
  }

  // Step 5: PDF Re-download button
  const reDownloadPdfBtn = document.getElementById("btn-guidebook-re-download");
  if (reDownloadPdfBtn && pdfBtn) {
    reDownloadPdfBtn.addEventListener("click", () => {
      pdfBtn.click();
    });
  }

  // Step 5: Start New Brand Design button
  const newBrandStartBtn = document.getElementById("btn-new-brand-start");
  if (newBrandStartBtn) {
    newBrandStartBtn.addEventListener("click", () => {
      resetToForm();
    });
  }

  // Navigation: Step 3 -> Step 4 (Hugging Face Mockup Assets View)
  if (goMockupStepBtn) {
    goMockupStepBtn.addEventListener("click", async () => {
      if (!currentBrandData.logo_url) {
        alert("먼저 AI 로고를 생성해 주세요!");
        return;
      }

      logoView.classList.remove("workspace-view-active");
      mockupView.classList.add("workspace-view-active");
      updateStepsProgress(4);
      if (
        Array.isArray(currentBrandData.mockups) &&
        currentBrandData.mockups.length
      ) {
        renderMockupImages(currentBrandData.mockups);
      } else {
        await renderMockupView();
      }
    });
  }

  // Navigation: Step 4 -> Step 3
  if (backToLogoBtn) {
    backToLogoBtn.addEventListener("click", () => {
      mockupView.classList.remove("workspace-view-active");
      logoView.classList.add("workspace-view-active");
      restoreLogoView();
      updateStepsProgress(3);
    });
  }

  // Reset button handler
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      resetToForm();
    });
  }

  function resetToForm() {
    form.reset();
    keywordsList = [];
    tagsContainer.innerHTML = "";
    currentBrandData = createBrandSession();
    resetGeneratedAssetViews();
    resultView.classList.remove("workspace-view-active");
    logoView.classList.remove("workspace-view-active");
    mockupView.classList.remove("workspace-view-active");
    if (guidebookView) guidebookView.classList.remove("workspace-view-active");
    loadingView.style.display = "none";
    formView.classList.add("workspace-view-active");
    updateStepsProgress(1);
  }

  window.resetWorkspaceForm = resetToForm;

  function createBrandSession(overrides = {}) {
    return {
      brand_id: null,
      brand_name: "",
      industry: "",
      dna: null,
      logo_url: "",
      logo_prompt: "",
      logo_is_mock: false,
      mockups: [],
      ...overrides,
    };
  }

  function resetGeneratedAssetViews() {
    resetLogoResultState();
    resetMockupPreviewBoxes();
  }

  function resetLogoResultState() {
    const logoSpinner = document.getElementById("logo-loading-spinner");
    const logoResultContainer = document.getElementById(
      "logo-result-container",
    );
    const editorPanel = document.getElementById("logo-editor-panel");
    const img = document.getElementById("generated-logo-img");
    const logoTypography = document.getElementById("logo-brand-typography");
    const statusTag = document.getElementById("logo-status-tag");

    if (logoSpinner) logoSpinner.style.display = "none";
    if (logoResultContainer) logoResultContainer.style.display = "none";
    if (editorPanel) editorPanel.style.display = "none";
    if (img) img.removeAttribute("src");
    if (logoTypography) {
      logoTypography.textContent = currentBrandData.brand_name || "Brand Name";
      logoTypography.removeAttribute("style");
    }
    if (statusTag) statusTag.textContent = "✅ AI 로고 심볼 생성 완료";
    if (goMockupStepBtn) {
      goMockupStepBtn.disabled = true;
      goMockupStepBtn.style.opacity = "0.5";
    }
  }

  function restoreLogoView() {
    if (currentBrandData.logo_url) {
      renderLogoResult(currentBrandData);
    } else {
      resetLogoResultState();
    }
  }

  function renderLogoResult(brandData) {
    const logoResultContainer = document.getElementById(
      "logo-result-container",
    );
    const img = document.getElementById("generated-logo-img");
    if (img && brandData.logo_url)
      img.src = brandData.logo_url + "?t=" + Date.now();

    const logoTypography = document.getElementById("logo-brand-typography");
    if (logoTypography) {
      logoTypography.textContent = brandData.brand_name || "Brand Name";
      if (brandData.dna) {
        logoTypography.style.fontFamily =
          "'" + brandData.dna.font_title + "', sans-serif";
        logoTypography.style.color = brandData.dna.primary_color;
      }
    }

    const statusTag = document.getElementById("logo-status-tag");
    if (statusTag) {
      statusTag.textContent = brandData.logo_is_mock
        ? "시그니처 SVG 로고 심볼 생성 완료"
        : "AI 로고 생성 완료";
    }

    if (logoResultContainer) logoResultContainer.style.display = "flex";
    initLogoEditor(brandData);
    if (goMockupStepBtn) {
      goMockupStepBtn.disabled = false;
      goMockupStepBtn.style.opacity = "1";
    }
  }

  function resetMockupPreviewBoxes() {
    Object.entries(initialMockupMarkup).forEach(([id, markup]) => {
      const box = document.getElementById(id);
      if (box) box.innerHTML = markup;
    });
  }

  function updateStepsProgress(activeStep) {
    for (let i = 1; i <= 5; i++) {
      const ind = document.getElementById(`step-ind-${i}`);
      if (ind) {
        if (i < activeStep) {
          ind.className = "step-indicator completed";
        } else if (i === activeStep) {
          ind.className = "step-indicator active";
        } else {
          ind.className = "step-indicator";
        }
      }
    }
  }

  function renderResult(dna, brandName, industry) {
    loadGoogleFonts(dna.font_title, dna.font_body);

    document.getElementById("result-brand-title").textContent = brandName;
    document.getElementById("result-brand-badge").textContent = industry;
    document.getElementById("result-slogan").textContent = `"${dna.slogan}"`;
    document.getElementById("result-persona").textContent = dna.persona;

    const primaryCircle = document.getElementById("circle-primary");
    const secondaryCircle = document.getElementById("circle-secondary");
    const pointCircle = document.getElementById("circle-point");

    if (primaryCircle) primaryCircle.style.backgroundColor = dna.primary_color;
    if (secondaryCircle)
      secondaryCircle.style.backgroundColor = dna.secondary_color;
    if (pointCircle) pointCircle.style.backgroundColor = dna.point_color;

    document.getElementById("val-primary").textContent =
      dna.primary_color.toUpperCase();
    document.getElementById("val-secondary").textContent =
      dna.secondary_color.toUpperCase();
    document.getElementById("val-point").textContent =
      dna.point_color.toUpperCase();

    document.getElementById("val-font-title").textContent = dna.font_title;
    document.getElementById("val-font-body").textContent = dna.font_body;

    const previewTitle = document.getElementById("preview-text-title");
    const previewBody = document.getElementById("preview-text-body");

    if (previewTitle) {
      previewTitle.style.fontFamily = `'${dna.font_title}', sans-serif`;
      previewTitle.style.color = dna.primary_color;
      previewTitle.textContent = brandName;
    }

    if (previewBody) {
      previewBody.style.fontFamily = `'${dna.font_body}', sans-serif`;
      previewBody.textContent = `저희 브랜드 ${brandName}은(는) "${dna.slogan}"을 모토로 합니다.`;
    }
  }

  async function renderMockupView() {
    setMockupLoadingState();

    try {
      const response = await fetch("/api/logo/mockups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand_id: currentBrandData.brand_id,
          brand_name: currentBrandData.brand_name || "My Brand",
          industry: currentBrandData.industry || "Business",
          dna: currentBrandData.dna,
          logo_url: currentBrandData.logo_url,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "목업 합성 중 오류가 발생했습니다.");
      }

      currentBrandData.mockups = data.mockups || [];
      renderMockupImages(currentBrandData.mockups);
      saveBrandToLocalStorage(currentBrandData);
    } catch (error) {
      console.error("Mockup API Error:", error);
      alert(error.message || "목업 합성에 실패했습니다.");
      renderMockupErrorState(error.message);
    }
  }

  function setMockupLoadingState() {
    ["mockup-box-card", "mockup-box-bag", "mockup-box-cup"].forEach((id) => {
      const box = document.getElementById(id);
      if (box) {
        box.innerHTML =
          '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:var(--text-secondary);font-weight:700;text-align:center;padding:1rem;">로고 목업 합성 중...</div>';
      }
    });
  }

  function renderMockupErrorState(message) {
    ["mockup-box-card", "mockup-box-bag", "mockup-box-cup"].forEach((id) => {
      const box = document.getElementById(id);
      if (box) {
        box.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:#FCA5A5;font-weight:700;text-align:center;padding:1rem;">${message || "목업 생성 실패"}</div>`;
      }
    });
  }

  function renderMockupImages(mockups) {
    const map = {
      card: "mockup-box-card",
      bag: "mockup-box-bag",
      cup: "mockup-box-cup",
    };
    const logoUrl = currentBrandData.logo_url;
    const rendered = new Set();

    (mockups || []).forEach((mockup) => {
      const box = document.getElementById(map[mockup.type]);
      const mockupImageUrl = mockup.mockup_image_url;
      if (box && mockupImageUrl) {
        box.innerHTML =
          '<img src="' +
          mockupImageUrl +
          "?t=" +
          Date.now() +
          '" alt="' +
          escapeHtml(mockup.label || "로고 적용 실사진 목업") +
          '" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block;" />';
        rendered.add(mockup.type);
      }
    });

    Object.keys(map).forEach((type) => {
      if (!rendered.has(type)) renderInlineLogoMockup(type, logoUrl);
    });
  }

  function renderInlineLogoMockup(type, logoUrl) {
    const box = document.getElementById("mockup-box-" + type);
    if (!box || !logoUrl) return;
    const slogan =
      currentBrandData.dna && currentBrandData.dna.slogan
        ? currentBrandData.dna.slogan
        : "Brand Identity";
    const brandName = currentBrandData.brand_name || "Brand Name";
    const primary =
      currentBrandData.dna && currentBrandData.dna.primary_color
        ? currentBrandData.dna.primary_color
        : "#6366F1";
    const point =
      currentBrandData.dna && currentBrandData.dna.point_color
        ? currentBrandData.dna.point_color
        : "#4F46E5";
    const src = logoUrl + "?t=" + Date.now();

    if (type === "bag") {
      box.innerHTML =
        '<div class="bag-inner-surface"><img class="mockup-applied-logo" src="' +
        src +
        '" alt="' +
        escapeHtml(brandName) +
        ' 로고" /></div>';
      return;
    }

    if (type === "cup") {
      box.innerHTML =
        '<div class="cup-inner-surface"><div class="cup-lid"></div><div class="cup-body" style="background: linear-gradient(180deg, ' +
        point +
        ", " +
        primary +
        ');"><img class="mockup-applied-logo" src="' +
        src +
        '" alt="' +
        escapeHtml(brandName) +
        ' 로고" /></div></div>';
      return;
    }

    box.innerHTML =
      '<div class="card-inner-surface" style="background:' +
      primary +
      ';"><img class="mockup-applied-logo" src="' +
      src +
      '" alt="' +
      escapeHtml(brandName) +
      ' 로고" /><div class="card-brand-text"><span class="card-brand-name">' +
      escapeHtml(brandName) +
      '</span><span class="card-brand-slogan">' +
      escapeHtml(slogan) +
      "</span></div></div>";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function loadGoogleFonts(titleFont, bodyFont) {
    const id = "google-fonts-dna-preview";
    let linkElement = document.getElementById(id);

    if (!linkElement) {
      linkElement = document.createElement("link");
      linkElement.id = id;
      linkElement.rel = "stylesheet";
      document.head.appendChild(linkElement);
    }

    const fontQuery = `family=${titleFont.replace(/ /g, "+")}:wght@700&family=${bodyFont.replace(/ /g, "+")}:wght@400;500&display=swap`;
    linkElement.href = `https://fonts.googleapis.com/css2?${fontQuery}`;
  }

  function saveBrandToLocalStorage(brandData) {
    if (!brandData || !brandData.brand_name) return;
    try {
      let stored = JSON.parse(
        localStorage.getItem(getScopedBrandStorageKey()) || "[]",
      );
      const newItem = {
        id: brandData.brand_id || Date.now(),
        brand_name: brandData.brand_name,
        industry: brandData.industry,
        slogan: brandData.dna ? brandData.dna.slogan : "",
        persona: brandData.dna ? brandData.dna.persona : "",
        primary_color: brandData.dna ? brandData.dna.primary_color : "#6366F1",
        secondary_color: brandData.dna
          ? brandData.dna.secondary_color
          : "#818CF8",
        point_color: brandData.dna ? brandData.dna.point_color : "#4F46E5",
        font_title: brandData.dna ? brandData.dna.font_title : "Outfit",
        font_body: brandData.dna ? brandData.dna.font_body : "Pretendard",
        logo_url: brandData.logo_url || "",
        logo_prompt: brandData.logo_prompt || "",
        logo_is_mock: Boolean(brandData.logo_is_mock),
        mockups: brandData.mockups || [],
        created_at: new Date().toISOString(),
      };

      stored = stored.filter((b) => b.brand_name !== brandData.brand_name);
      stored.unshift(newItem);
      localStorage.setItem(getScopedBrandStorageKey(), JSON.stringify(stored));
    } catch (e) {
      console.error("Failed to save brand to localStorage:", e);
    }
  }

  function renderGuidebookView() {
    const finalLogo = document.getElementById("guidebook-final-logo");
    const finalBadge = document.getElementById("guidebook-final-badge");
    const finalTitle = document.getElementById("guidebook-final-title");
    const finalSlogan = document.getElementById("guidebook-final-slogan");
    const finalPersona = document.getElementById("guidebook-final-persona");

    if (finalLogo)
      finalLogo.src = currentBrandData.logo_url
        ? currentBrandData.logo_url + "?t=" + Date.now()
        : "";
    if (finalBadge)
      finalBadge.textContent = currentBrandData.industry || "일반";
    if (finalTitle)
      finalTitle.textContent = currentBrandData.brand_name || "My Brand";
    if (finalSlogan)
      finalSlogan.textContent = currentBrandData.dna
        ? `"${currentBrandData.dna.slogan}"`
        : "";
    if (finalPersona)
      finalPersona.textContent = currentBrandData.dna
        ? currentBrandData.dna.persona
        : "";

    if (currentBrandData.dna) {
      const pCol = currentBrandData.dna.primary_color || "#6366F1";
      const sCol = currentBrandData.dna.secondary_color || "#818CF8";
      const ptCol = currentBrandData.dna.point_color || "#4F46E5";

      const pBox = document.getElementById("guidebook-color-primary");
      const sBox = document.getElementById("guidebook-color-secondary");
      const ptBox = document.getElementById("guidebook-color-point");

      if (pBox) pBox.style.backgroundColor = pCol;
      if (sBox) sBox.style.backgroundColor = sCol;
      if (ptBox) ptBox.style.backgroundColor = ptCol;

      const valP = document.getElementById("guidebook-val-primary");
      const valS = document.getElementById("guidebook-val-secondary");
      const valPt = document.getElementById("guidebook-val-point");

      if (valP) valP.textContent = pCol.toUpperCase();
      if (valS) valS.textContent = sCol.toUpperCase();
      if (valPt) valPt.textContent = ptCol.toUpperCase();

      const valTitleFont = document.getElementById("guidebook-val-font-title");
      const valBodyFont = document.getElementById("guidebook-val-font-body");

      if (valTitleFont)
        valTitleFont.textContent = currentBrandData.dna.font_title || "Outfit";
      if (valBodyFont)
        valBodyFont.textContent =
          currentBrandData.dna.font_body || "Pretendard";
    }
  }
}

// 디자인 시작 페이지 - 기타 업종 선택 및 메인 페이지 입력값 연동 로직
document.addEventListener("DOMContentLoaded", () => {
  initCategoryCustomSync();
});

function initCategoryCustomSync() {
  const categorySelect = document.getElementById("workspace-category");
  const categoryCustomInput = document.getElementById(
    "workspace-category-custom",
  );

  if (!categorySelect || !categoryCustomInput) return;

  // 1. 사용자가 드롭다운에서 '기타'를 직접 선택하거나 변경할 때 이벤트
  categorySelect.addEventListener("change", () => {
    if (categorySelect.value === "기타" || categorySelect.value === "custom") {
      categoryCustomInput.style.display = "block";
      categoryCustomInput.focus();
    } else {
      categoryCustomInput.style.display = "none";
      categoryCustomInput.value = "";
    }
  });

  // 2. 메인 페이지에서 넘어왔을 때 sessionStorage에 저장된 값 복원 처리
  const savedCategory = sessionStorage.getItem(
    "branding_fit_selected_category",
  );
  const savedCustomCategory = sessionStorage.getItem(
    "branding_fit_custom_category",
  );

  if (savedCategory === "기타" || savedCustomCategory) {
    categorySelect.value = "기타";
    categoryCustomInput.style.display = "block";
    if (savedCustomCategory) {
      categoryCustomInput.value = savedCustomCategory;
    }
  } else if (savedCategory) {
    categorySelect.value = savedCategory;
    categoryCustomInput.style.display = "none";
  }
}

// 싱글 페이지(SPA/해시 변경) 구조 지원: 페이지 이동 시에도 실행되도록 설정
window.addEventListener("hashchange", () => {
  setTimeout(initCategoryCustomSync, 100);
});

// ==========================================
// 업종 '기타' 선택 시 입력창 토글 및 메인 세션 연동
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initIndustryCustomSync();
});

function initIndustryCustomSync() {
  const industrySelect = document.getElementById("input-industry");
  const industryCustomInput = document.getElementById("input-industry-custom");

  if (!industrySelect || !industryCustomInput) return;

  // 1. 선택 상자 변경 이벤트 ('기타' 선택 시 입력창 보이기)
  industrySelect.addEventListener("change", () => {
    if (industrySelect.value === "기타") {
      industryCustomInput.style.display = "block";
      industryCustomInput.focus();
    } else {
      industryCustomInput.style.display = "none";
      industryCustomInput.value = "";
    }
  });

  // 2. 메인 페이지에서 넘어왔을 때 저장된 세션 데이터 복원
  const savedCategory = sessionStorage.getItem(
    "branding_fit_selected_category",
  );
  const savedCustomCategory = sessionStorage.getItem(
    "branding_fit_custom_category",
  );

  if (savedCategory === "기타" || savedCustomCategory) {
    industrySelect.value = "기타";
    industryCustomInput.style.display = "block";
    if (savedCustomCategory) {
      industryCustomInput.value = savedCustomCategory;
    }
  } else if (savedCategory) {
    industrySelect.value = savedCategory;
    industryCustomInput.style.display = "none";
  }
}

// 라우팅/해시 이동 시에도 실행되도록 설정
window.addEventListener("hashchange", () => {
  setTimeout(initIndustryCustomSync, 100);
});
