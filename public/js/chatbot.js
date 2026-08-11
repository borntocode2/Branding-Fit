// public/js/chatbot.js

document.addEventListener("DOMContentLoaded", () => {
  initChatbot();
  initScrollTopButton();
});

// 키워드 기반 기본 응답 함수
function getMockChatbotResponse(message) {
  const msg = (message || "").toLowerCase();

  if (
    msg.includes("로고") ||
    msg.includes("디자인") ||
    msg.includes("심볼") ||
    msg.includes("logo")
  ) {
    return "🎨 *AI 로고 생성 안내*\n\n브랜딩핏의 4단계(로고 생성)에서 Hugging Face FLUX/Stable Diffusion 모델을 통해 브랜드에 최적화된 로고를 생성할 수 있습니다. 생성된 로고는 색상 조정 및 조합 수정이 가능한 실시간 로고 에디터로 보완하실 수 있습니다!";
  }

  if (
    msg.includes("슬로건") ||
    msg.includes("dna") ||
    msg.includes("스토리") ||
    msg.includes("slogan")
  ) {
    return "✍ *브랜드 DNA & 슬로건 안내*\n\n브랜딩핏은 사용자가 입력한 업종, 키워드, 강점(USP) 정보를 정밀 분석하여 브랜드 페르소나와 감각적인 슬로건을 자동 완성합니다. 워크스페이스의 1단계 입력을 마친 뒤 바로 2단계에서 확인하실 수 있습니다.";
  }

  if (
    msg.includes("가이드북") ||
    msg.includes("pdf") ||
    msg.includes("다운로드") ||
    msg.includes("인쇄")
  ) {
    return "📄 *브랜드 가이드북 PDF 다운로드*\n\n브랜드 DNA, 컬러 팔레트, 로고 및 목업 이미지까지 모두 포함된 고품격 브랜드 가이드북을 PDF로 다운로드 받으실 수 있습니다. 생성 완료 화면 혹은 마이페이지의 보관함 카드에서 즉시 출력이 가능합니다!";
  }

  if (
    msg.includes("비용") ||
    msg.includes("가격") ||
    msg.includes("유료") ||
    msg.includes("무료")
  ) {
    return "금액적인 부담 없이 초기 브랜드의 뼈대를 다지실 수 있도록, 브랜딩핏은 기본 에셋 생성 및 브랜드 가이드북 PDF 다운로드를 무료로 제공해 드리고 있습니다. 언제든 부담 없이 로고와 슬로건을 생성해 보세요!";
  }

  if (
    msg.includes("시작") ||
    msg.includes("워크스페이스") ||
    msg.includes("어떻게")
  ) {
    return "🚀 *브랜딩핏 시작하기*\n\n상단 GNB 메뉴 혹은 메인 화면의 **[디자인 시작하기]** 버튼을 클릭하시면 워크스페이스로 즉시 진입하여 브랜딩 정보 입력을 바로 시작하실 수 있습니다. (원활한 에셋 보관을 위해 먼저 로그인을 진행해 주세요!)";
  }

  return "죄송합니다. 저는 **Branding Fit AI 브랜딩 컨설턴트**로서 일반 정보에 대해서는 안내해 드리기 어렵습니다. 😅\n\n대신 **브랜드 슬로건 기획**, **AI 로고 생성/편집**, **가이드북 PDF 발급** 및 **1:1 문의 접수**에 관한 질문을 주시면 상세히 답변해 드릴 수 있습니다!\n\n💡 궁금하신 브랜드 관련 질문이나 **[문의하기]**를 입력해 보세요.";
}

function initChatbot() {
  const toggleBtn = document.getElementById("btn-chatbot-toggle");
  const closeBtn = document.getElementById("btn-chatbot-close");
  const chatWindow = document.getElementById("chatbot-window");
  const msgBody = document.getElementById("chatbot-msg-body");
  const chatInput = document.getElementById("chatbot-input");
  const sendBtn = document.getElementById("btn-chatbot-send");

  if (!toggleBtn || !chatWindow || !msgBody || !chatInput || !sendBtn) return;

  const CHAT_HISTORY_KEY = "branding_fit_chat_history";
  const INQUIRY_STATE_KEY = "branding_fit_inquiry_state";

  const defaultChatHistory = [
    {
      role: "model",
      text: "안녕하세요! **Branding Fit AI 컨설턴트**입니다.\n\n브랜드 슬로건 기획, AI 로고 디자인, 가이드북 PDF 다운로드에 대해 궁금한 점을 편하게 질문해 주세요!\n\n1:1 문의가 필요하신 경우 **[문의하기]**라고 입력해 주시면 빠르게 도움을 드리겠습니다.",
    },
  ];

  // 문의 대기 상태 관리 (false: 일반 대화, true: 문의 정보 한 번에 입력 대기)
  let isInquiryWaiting = loadInquiryState();
  let chatHistory = loadChatHistory();
  renderInitialHistory();

  // Toggle Chat Window
  toggleBtn.addEventListener("click", () => {
    chatWindow.classList.toggle("active");
    if (chatWindow.classList.contains("active")) {
      scrollToBottom();
      chatInput.focus();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      chatWindow.classList.remove("active");
    });
  }

  // Send Message Event
  sendBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // 사용자 말풍선 추가 및 저장
    appendMessageBubble("user", text);
    chatInput.value = "";

    chatHistory.push({ role: "user", text: text });
    persistChatHistory();

    const typingIndicator = appendTypingIndicator();
    scrollToBottom();

    setTimeout(() => {
      if (typingIndicator) typingIndicator.remove();

      // 메시지 처리 및 답변 획득
      const responseText = processInquirySingleStep(text);

      appendMessageBubble("bot", responseText);
      chatHistory.push({ role: "model", text: responseText });
      persistChatHistory();

      scrollToBottom();
    }, 350);
  }

  // 1:1 문의 일괄 입력 처리 로직
  function processInquirySingleStep(userText) {
    const lowerText = userText.toLowerCase();

    // 1. 문의 시작 키워드 입력 감지
    if (
      lowerText.includes("문의") ||
      lowerText.includes("문의하기") ||
      lowerText.includes("질문하기")
    ) {
      isInquiryWaiting = true;
      persistInquiryState();
      return "📩 *Branding Fit 1:1 문의 접수*\n\n아래 양식에 맞춰 **이름, 이메일, 문의사항**을 한 번에 입력해 주시면 담당자가 확인 후 안내드리겠습니다!\n\n---\n**[입력 예시]**\n홍길동 / hong@email.com / 로고 파일 원본 다운로드 방법이 궁금합니다.\n---";
    }

    // 2. 취소 요청 시
    if (
      isInquiryWaiting &&
      (lowerText === "취소" || lowerText === "취소하기")
    ) {
      isInquiryWaiting = false;
      persistInquiryState();
      return "1:1 문의 접수가 취소되었습니다. 대화 중 궁금한 점이 있으시면 언제든 말씀해 주세요!";
    }

    // 3. 문의 양식 한 번에 수집 처리
    if (isInquiryWaiting) {
      // 이메일 추출 정규식
      const emailMatch = userText.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
      );

      if (!emailMatch) {
        return "⚠️ 답변받으실 올바른 **이메일 주소**가 확인되지 않았습니다.\n\n이름, 이메일 주소, 문의사항을 포함하여 다시 입력해 주세요!\n*(예: 홍길동 / name@domain.com / 문의 내용)*";
      }

      const email = emailMatch[0];

      // 이메일 기준으로 전후 내용 파싱 (간단 분리)
      const parts = userText.split(email);
      let name = parts[0].replace(/[\/,\n\-:]/g, "").trim();
      let content = parts[1].replace(/^[\/,\n\-:]+/, "").trim();

      if (!name) name = "고객";
      if (!content) content = userText;

      // 접수 완료 후 상태 초기화
      isInquiryWaiting = false;
      persistInquiryState();

      return `✅ *1:1 문의 접수가 완료되었습니다!*\n\n• **성함:** ${name}\n• **이메일:** ${email}\n• **문의 내용:** ${content}\n\n남겨주신 문의 사항은 담당 디자이너 및 고객지원팀에 전달되었으며, **${email}** 주소로 빠른 시일 내에 답변해 드리겠습니다. 감사합니다! 💌`;
    }

    // 4. 일반 챗봇 대화 응답
    return getMockChatbotResponse(userText);
  }

  function loadInquiryState() {
    try {
      const stored = sessionStorage.getItem(INQUIRY_STATE_KEY);
      return stored ? JSON.parse(stored) : false;
    } catch (e) {}
    return false;
  }

  function persistInquiryState() {
    try {
      sessionStorage.setItem(
        INQUIRY_STATE_KEY,
        JSON.stringify(isInquiryWaiting),
      );
    } catch (e) {}
  }

  function loadChatHistory() {
    try {
      const stored = sessionStorage.getItem(CHAT_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (e) {}
    return defaultChatHistory.slice();
  }

  function persistChatHistory() {
    try {
      sessionStorage.setItem(
        CHAT_HISTORY_KEY,
        JSON.stringify(chatHistory.slice(-20)),
      );
    } catch (e) {}
  }

  function renderInitialHistory() {
    msgBody.innerHTML = "";
    chatHistory.forEach((message) => {
      appendMessageBubble(
        message.role === "user" ? "user" : "bot",
        message.text,
      );
    });
  }

  function appendMessageBubble(sender, rawText) {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${sender}`;

    const formatted = formatMessageText(rawText);
    bubble.innerHTML = formatted;

    msgBody.appendChild(bubble);
  }

  function appendTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "chat-bubble bot";
    indicator.id = "chat-typing-indicator";
    indicator.innerHTML = `
            <div class="typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
    msgBody.appendChild(indicator);
    return indicator;
  }

  function scrollToBottom() {
    msgBody.scrollTop = msgBody.scrollHeight;
  }

  function formatMessageText(text) {
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/^\* (.*?)$/gm, "• $1");
    html = html.replace(/\n/g, "<br>");

    return html;
  }
}

function initScrollTopButton() {
  const topBtn = document.getElementById("btn-scroll-top");
  if (!topBtn) return;

  function syncTopButtonVisibility() {
    const homeFrame = document.getElementById("home-page-frame");
    const homeWindow = homeFrame && homeFrame.contentWindow;

    // 현재 부모 창과 iframe 창의 스크롤 위치 측정
    const windowScrollY =
      window.scrollY || document.documentElement.scrollTop || 0;
    let frameScrollY = 0;

    if (homeWindow) {
      try {
        frameScrollY =
          homeWindow.scrollY ||
          homeWindow.document.documentElement.scrollTop ||
          0;
      } catch (e) {}
    }

    // 둘 중 더 많이 스크롤된 위치를 기준으로 잡음
    const currentScroll = Math.max(windowScrollY, frameScrollY);

    // 📍 핵심 수정: 메인/서브 상관없이 스크롤을 100px만 내리면 버튼이 나타나고, 맨 위로 가면 자연스럽게 사라짐
    const shouldShow = currentScroll > 100;

    topBtn.classList.toggle("is-visible", shouldShow);
  }

  function bindHomeFrameScroll() {
    const homeFrame = document.getElementById("home-page-frame");
    const homeWindow = homeFrame && homeFrame.contentWindow;
    if (!homeWindow || homeFrame.dataset.topScrollBound === "true") return;

    try {
      homeWindow.addEventListener("scroll", syncTopButtonVisibility, {
        passive: true,
      });
      homeFrame.dataset.topScrollBound = "true";
      syncTopButtonVisibility();
    } catch (e) {}
  }

  // 부모 창 스크롤 감지
  window.addEventListener("scroll", syncTopButtonVisibility, { passive: true });
  window.addEventListener("hashchange", () =>
    setTimeout(syncTopButtonVisibility, 80),
  );

  // iframe 로드 시 감지
  const homeFrame = document.getElementById("home-page-frame");
  if (homeFrame) {
    homeFrame.addEventListener("load", bindHomeFrameScroll);
  }
  bindHomeFrameScroll();
  syncTopButtonVisibility();

  // 📍 클릭 이벤트: 메인 및 서브페이지 스크롤 상단 이동 지원
  topBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // 1. 현재 메인 브라우저 창 스크롤 상단 이동
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });

    // 2. iframe 내부 스크롤 상단 이동 (메인페이지일 경우)
    const homeFrame = document.getElementById("home-page-frame");
    const homeWindow = homeFrame && homeFrame.contentWindow;
    if (homeWindow) {
      try {
        if (homeWindow.brandingFitBridge?.scrollToHeroSection) {
          homeWindow.brandingFitBridge.scrollToHeroSection();
        } else {
          homeWindow.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch (e) {}
    }

    topBtn.classList.remove("is-visible");
    setTimeout(syncTopButtonVisibility, 500);
  });
}
