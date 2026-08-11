const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const db = require("../config/database");
const {
  generateHuggingFaceJson,
  getHuggingFaceErrorMessage,
  getHuggingFaceErrorStatus,
} = require("../services/huggingFace");
const {
  buildBrandDnaPrompt,
  buildGuidebookPrompt,
  getBrandDnaSystemInstruction,
  getGuidebookSystemInstruction,
} = require("../services/brandPrompts");

const router = express.Router();

function normalizeDnaResult(dna, brandName, industry) {
  return {
    slogan: dna.slogan || `당신만을 위한 브랜드, ${brandName}`,
    persona:
      dna.persona ||
      `${brandName}은(는) 고객에게 최고의 가치를 제공하는 ${industry} 브랜드입니다.`,
    primary_color: dna.primary_color || "#6366F1",
    secondary_color: dna.secondary_color || "#818CF8",
    point_color: dna.point_color || "#4F46E5",
    font_title: dna.font_title || "Outfit",
    font_body: dna.font_body || "Pretendard",
  };
}

router.post("/generate-dna", async (req, res) => {
  const { brand_name, industry, keywords, usp, target_age } = req.body;

  if (!brand_name || !industry) {
    return res
      .status(400)
      .json({
        success: false,
        error: "브랜드 이름과 업종은 필수 입력 항목입니다.",
      });
  }

  try {
    const dna = await generateHuggingFaceJson({
      systemInstruction: getBrandDnaSystemInstruction(),
      prompt: buildBrandDnaPrompt({
        brand_name,
        industry,
        keywords,
        usp,
        target_age,
      }),
    });

    return saveAndSendDNA(
      req,
      res,
      normalizeDnaResult(dna, brand_name, industry),
      brand_name,
      industry,
      keywords,
      usp,
      target_age,
    );
  } catch (error) {
    console.error(
      "❌ Hugging Face brand DNA generation failed:",
      error.message,
    );
    return res.status(getHuggingFaceErrorStatus(error)).json({
      success: false,
      error: getHuggingFaceErrorMessage(
        error,
        "Hugging Face 브랜드 DNA 생성 중 오류가 발생했습니다.",
      ),
    });
  }
});

function saveAndSendDNA(
  req,
  res,
  dna,
  brand_name,
  industry,
  keywords,
  usp,
  target_age,
) {
  const userId = req.user ? req.user.id : null;

  db.run(
    `INSERT INTO brands (
            user_id, brand_name, industry, keywords, usp, target_age,
            persona, slogan, primary_color, secondary_color, point_color,
            font_title, font_body
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      brand_name,
      industry,
      typeof keywords === "string" ? keywords : JSON.stringify(keywords || []),
      usp || null,
      target_age || null,
      dna.persona,
      dna.slogan,
      dna.primary_color,
      dna.secondary_color,
      dna.point_color,
      dna.font_title,
      dna.font_body,
    ],
    function (err) {
      if (err) {
        console.error("❌ Failed to save brand DNA to database:", err.message);
        return res.status(500).json({
          success: false,
          error: "브랜드 DNA 저장 중 오류가 발생했습니다.",
        });
      }

      return res.json({
        success: true,
        brand_id: this.lastID,
        dna,
        dbSaved: true,
        provider: "huggingface",
      });
    },
  );
}

function getKoreanFontPath(isBold = false) {
  const projectFontName = isBold
    ? "Pretendard-Bold.otf"
    : "Pretendard-Regular.otf";
  const candidates = [
    path.join(__dirname, "../assets/fonts", projectFontName),
    path.join(process.env.HOME || "", "Library/Fonts", projectFontName),
    path.join(
      process.env.HOME || "",
      "Library/Fonts",
      isBold ? "NanumGothicBold.ttf" : "NanumGothic.ttf",
    ),
    isBold ? "C:/Windows/Fonts/malgunbd.ttf" : "C:/Windows/Fonts/malgun.ttf",
    "C:/Windows/Fonts/gothic.ttf",
    "/usr/share/fonts/truetype/nanum/NanumGothic.ttf",
  ];
  return (
    candidates.find((fontPath) => fontPath && fs.existsSync(fontPath)) || null
  );
}

function parseJsonField(value, fallback) {
  if (!value) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

async function ensureGuidebookContent(brandData) {
  const existing = parseJsonField(brandData.guidebook_content, null);
  if (existing) {
    return { ...brandData, guidebook: existing };
  }

  const guidebook = await generateHuggingFaceJson({
    systemInstruction: getGuidebookSystemInstruction(),
    prompt: buildGuidebookPrompt(brandData),
  });

  if (brandData.id) {
    db.run(
      "UPDATE brands SET guidebook_content = ? WHERE id = ?",
      [JSON.stringify(guidebook), brandData.id],
      (err) => {
        if (err)
          console.error("❌ Failed to update guidebook_content:", err.message);
      },
    );
  }

  return {
    ...brandData,
    guidebook_content: JSON.stringify(guidebook),
    guidebook,
  };
}

function setFont(doc, text, isBold = false) {
  const fontPath = getKoreanFontPath(isBold);
  if (fontPath) {
    doc.font(fontPath);
  } else {
    doc.font(isBold ? "Helvetica-Bold" : "Helvetica");
  }
}

function drawTextBlock(doc, title, body, x, y, width) {
  setFont(doc, title, true);
  doc.fontSize(13).fillColor("#0F172A").text(title, x, y, { width });
  setFont(doc, body, false);
  doc
    .fontSize(9.5)
    .fillColor("#334155")
    .text(body || "", x, y + 20, {
      width,
      lineGap: 4,
    });
}

function drawLogoPlaceholder(doc, brandData, primaryColor, topY) {
  const brandName = brandData.brand_name || "Brand";
  const initial = brandName.substring(0, 2).toUpperCase();

  doc.save();
  doc
    .roundedRect(50, topY, 120, 120, 12)
    .fillAndStroke("#0D0D18", primaryColor);
  doc.circle(110, topY + 44, 25).fill(primaryColor);
  setFont(doc, initial, true);
  doc
    .fillColor("#FFFFFF")
    .fontSize(15)
    .text(initial, 50, topY + 36, { width: 120, align: "center" });
  setFont(doc, brandName, true);
  doc
    .fillColor("#FFFFFF")
    .fontSize(10)
    .text(brandName, 58, topY + 88, { width: 104, align: "center" });
  doc.restore();
}

function tryDrawImage(doc, publicPath, x, y, options) {
  if (!publicPath) return false;
  const logoPath = path.join(__dirname, "../../public", publicPath);
  if (!fs.existsSync(logoPath)) return false;
  if (!/\.(png|jpe?g)$/i.test(logoPath)) return false;

  try {
    doc.image(logoPath, x, y, options);
    return true;
  } catch (error) {
    console.error("Failed to embed image in PDF:", error.message);
    return false;
  }
}

function buildBrandPDFStream(brandData, res) {
  try {
    const guidebook =
      brandData.guidebook || parseJsonField(brandData.guidebook_content, {});
    const mockups = parseJsonField(
      brandData.mockup_urls,
      brandData.mockups || [],
    );
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const safeName = (brandData.brand_name || "Brand").replace(
      /[^a-zA-Z0-9가-힣]/g,
      "_",
    );
    const filename = `Brand_Guidebook_${safeName}.pdf`;

    const asciiFilename = `Brand_Guidebook_${Date.now()}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
    );

    doc.pipe(res);

    const primaryColor = brandData.primary_color || "#6366F1";
    const secondaryColor = brandData.secondary_color || "#818CF8";
    const pointColor = brandData.point_color || "#4F46E5";

    doc.rect(0, 0, 595.28, 126).fill(primaryColor);
    doc.fillColor("#FFFFFF");
    setFont(doc, "BRANDING FIT", true);
    doc.fontSize(25).text("BRANDING FIT", 50, 32);
    setFont(doc, "Hugging Face Generated Brand Guidebook", false);
    doc.fontSize(12).text("Hugging Face Generated Brand Guidebook", 50, 70);

    doc.fillColor("#0F172A");
    setFont(doc, brandData.brand_name || "Brand Name", true);
    doc.fontSize(22).text(brandData.brand_name || "Brand Name", 50, 150);

    doc.fillColor(pointColor);
    setFont(doc, brandData.slogan || "", false);
    doc.fontSize(13).text(`"${brandData.slogan || ""}"`, 50, 180);
    doc
      .strokeColor("#E2E8F0")
      .lineWidth(1)
      .moveTo(50, 210)
      .lineTo(545, 210)
      .stroke();

    drawTextBlock(
      doc,
      "1. Brand Overview",
      guidebook.brand_overview || brandData.persona || "",
      50,
      232,
      495,
    );
    drawTextBlock(
      doc,
      "2. Logo Usage",
      guidebook.logo_usage ||
        "생성된 로고를 핵심 브랜드 마크로 일관되게 사용합니다.",
      50,
      322,
      300,
    );

    if (
      !tryDrawImage(doc, brandData.logo_url, 390, 300, {
        width: 120,
        height: 120,
        fit: [120, 120],
      })
    ) {
      drawLogoPlaceholder(doc, brandData, primaryColor, 300);
    }

    const colorY = 430;
    drawTextBlock(
      doc,
      "3. Color System",
      guidebook.color_usage || "",
      50,
      colorY,
      495,
    );
    doc.rect(50, colorY + 82, 78, 42).fill(primaryColor);
    doc.rect(150, colorY + 82, 78, 42).fill(secondaryColor);
    doc.rect(250, colorY + 82, 78, 42).fill(pointColor);
    setFont(doc, primaryColor, false);
    doc
      .fontSize(8)
      .fillColor("#64748B")
      .text(primaryColor, 50, colorY + 130);
    doc.text(secondaryColor, 150, colorY + 130);
    doc.text(pointColor, 250, colorY + 130);

    drawTextBlock(
      doc,
      "4. Typography",
      guidebook.typography_usage ||
        `제목은 ${brandData.font_title || "Outfit"}, 본문은 ${brandData.font_body || "Pretendard"}를 기준으로 사용합니다.`,
      50,
      600,
      495,
    );

    if (mockups.length > 0) {
      doc.addPage();
      setFont(doc, "5. Hugging Face Generated Mockup Strategy", true);
      doc
        .fontSize(17)
        .fillColor("#0F172A")
        .text("5. Hugging Face Generated Mockup Strategy", 50, 50);
      setFont(doc, guidebook.mockup_strategy || "", false);
      doc
        .fontSize(10)
        .fillColor("#334155")
        .text(guidebook.mockup_strategy || "", 50, 78, {
          width: 495,
          lineGap: 4,
        });

      const slots = [
        { x: 50, y: 140 },
        { x: 315, y: 140 },
        { x: 50, y: 385 },
      ];
      mockups.slice(0, 3).forEach((mockup, index) => {
        const slot = slots[index];
        tryDrawImage(doc, mockup.mockup_image_url, slot.x, slot.y, {
          width: 230,
          height: 172,
          fit: [230, 172],
        });
        setFont(doc, mockup.label || "Mockup", true);
        doc
          .fontSize(10)
          .fillColor("#0F172A")
          .text(mockup.label || "Mockup", slot.x, slot.y + 184, { width: 230 });
      });
    }

    setFont(doc, "Generated by Branding Fit Hugging Face AI System", false);
    doc
      .fontSize(8)
      .fillColor("#94A3B8")
      .text(
        `Generated by Branding Fit Hugging Face AI System • ${new Date().toLocaleDateString("ko-KR")}`,
        50,
        770,
        {
          align: "center",
          width: 495,
        },
      );

    doc.end();
  } catch (err) {
    console.error("❌ PDF Generation error:", err);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ error: "가이드북 PDF 생성 중 오류가 발생했습니다." });
    }
  }
}

router.get("/list", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res
      .status(401)
      .json({ success: false, error: "로그인이 필요합니다." });
  }

  const userId = req.user.id;

  db.all(
    "SELECT * FROM brands WHERE user_id = ? ORDER BY id DESC",
    [userId],
    (err, rows) => {
      if (err) {
        console.error("❌ Failed to fetch brand list:", err.message);
        return res
          .status(500)
          .json({ error: "브랜드 목록 조회 중 오류가 발생했습니다." });
      }
      return res.json({
        success: true,
        brands: rows || [],
      });
    },
  );
});

router.delete("/:id", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res
      .status(401)
      .json({ success: false, error: "로그인이 필요합니다." });
  }

  const brandId = req.params.id;
  const userId = req.user.id;

  db.run(
    "DELETE FROM brands WHERE id = ? AND user_id = ?",
    [brandId, userId],
    function (err) {
      if (err) {
        console.error("❌ Failed to delete brand:", err.message);
        return res
          .status(500)
          .json({ error: "브랜드 삭제 중 오류가 발생했습니다." });
      }

      if (this.changes === 0) {
        return res
          .status(404)
          .json({ success: false, error: "삭제할 브랜드를 찾을 수 없습니다." });
      }

      return res.json({
        success: true,
        deleted_id: brandId,
      });
    },
  );
});

router.get("/:id/pdf", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res
      .status(401)
      .json({ success: false, error: "로그인이 필요합니다." });
  }

  const brandId = req.params.id;
  db.get(
    "SELECT * FROM brands WHERE id = ? AND user_id = ?",
    [brandId, req.user.id],
    async (err, row) => {
      if (err || !row) {
        return res
          .status(404)
          .json({ error: "해당 브랜드 데이터를 찾을 수 없습니다." });
      }

      try {
        const brandWithGuidebook = await ensureGuidebookContent(row);
        buildBrandPDFStream(brandWithGuidebook, res);
      } catch (error) {
        return res.status(getHuggingFaceErrorStatus(error)).json({
          success: false,
          error: getHuggingFaceErrorMessage(
            error,
            "Hugging Face 가이드북 생성 중 오류가 발생했습니다.",
          ),
        });
      }
    },
  );
});

router.post("/pdf", async (req, res) => {
  const brandData = req.body;
  if (!brandData || !brandData.brand_name) {
    return res
      .status(400)
      .json({ error: "브랜드 데이터 정보가 유효하지 않습니다." });
  }

  try {
    const brandWithGuidebook = await ensureGuidebookContent(brandData);
    buildBrandPDFStream(brandWithGuidebook, res);
  } catch (error) {
    return res.status(getHuggingFaceErrorStatus(error)).json({
      success: false,
      error: getHuggingFaceErrorMessage(
        error,
        "Hugging Face 가이드북 생성 중 오류가 발생했습니다.",
      ),
    });
  }
});

module.exports = router;
