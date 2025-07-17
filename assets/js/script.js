document.addEventListener("DOMContentLoaded", () => {
  // --- Biến toàn cục & Thiết lập ban đầu ---
  const body = document.body;
  const header = document.querySelector(".header");
  const menuToggleButton = document.querySelector(".menu-toggle-button");
  const overlayMenu = document.getElementById("overlay-menu");
  // KHÔNG CẦN THIẾT: Biến scrollPosition đã được loại bỏ để giải quyết lỗi "nhảy trang".

  /*
   * LƯU Ý QUAN TRỌNG VỀ CSS:
   * Để phương pháp mới này hoạt động, bạn cần thêm quy tắc CSS sau vào file stylesheet của mình:
   *
   * body.no-scroll {
   * overflow: hidden;
   * }
   *
   * Quy tắc này sẽ ngăn trang cuộn khi menu được mở mà không gây ra hiệu ứng "nhảy" lên đầu trang.
   */

  // --- 1. Logic cho Menu Overlay (Phương pháp mới, không bị nhảy trang) ---

  // THAY ĐỔI: Hàm closeMenu được đơn giản hóa. Không còn dùng position:fixed.
  const closeMenu = () => {
    if (!body.classList.contains("no-scroll")) return;

    body.classList.remove("no-scroll"); // Chỉ cần xóa class là đủ

    if (menuToggleButton) menuToggleButton.classList.remove("is-active");
    if (overlayMenu) overlayMenu.classList.remove("is-active");
  };

  // THAY ĐỔI: Hàm openMenu được đơn giản hóa.
  const openMenu = () => {
    if (body.classList.contains("no-scroll")) return;

    // Chỉ cần thêm class. CSS sẽ xử lý việc khóa cuộn.
    body.classList.add("no-scroll");

    if (menuToggleButton) menuToggleButton.classList.add("is-active");
    if (overlayMenu) overlayMenu.classList.add("is-active");
  };

  if (menuToggleButton) {
    menuToggleButton.addEventListener("click", () => {
      // THAY ĐỔI: Logic chuyển đổi được đơn giản hóa.
      if (body.classList.contains("no-scroll")) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  // --- 2. Smooth Scrolling & Close Menu on Link Click ---
  const navLinks = document.querySelectorAll(
    ".overlay-nav-link, .overlay-cta a, .cta-button-main"
  );
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && (href.startsWith("#") || href.includes("index.html#"))) {
        // THAY ĐỔI: Gọi hàm closeMenu đơn giản, không cần tham số.
        closeMenu();

        const hashIndex = href.indexOf("#");
        const hash = href.substring(hashIndex);

        if (
          !window.location.pathname.endsWith("/") &&
          !window.location.pathname.endsWith("index.html") &&
          window.location.pathname !== ""
        ) {
          e.preventDefault();
          window.location.href = "index.html" + hash;
          return;
        }

        const targetElement = document.querySelector(hash);
        if (targetElement) {
          e.preventDefault();

          // Sử dụng một timeout nhỏ để đảm bảo trình duyệt có thời gian
          // xử lý việc gỡ bỏ class 'no-scroll' trước khi cuộn.
          // Điều này giúp hành vi cuộn mượt mà và ổn định hơn.
          setTimeout(() => {
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition =
              targetElement.getBoundingClientRect().top +
              window.pageYOffset -
              headerHeight;
            window.scrollTo({ top: targetPosition, behavior: "smooth" });
          }, 0); // Timeout 0ms là đủ để đưa tác vụ vào hàng đợi tiếp theo.
        }
      }
    });
  });

  // --- 3. Logo Resize on Scroll ---
  const logoDiv = document.querySelector(".logo");
  if (logoDiv) {
    const handleLogoResize = () => {
      logoDiv.classList.toggle("large-logo", window.scrollY === 0);
    };
    window.addEventListener("scroll", handleLogoResize);
    handleLogoResize();
  }

  // --- 4. Animate on Scroll ---
  const animationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.1 }
  );
  const elementsToAnimate = document.querySelectorAll(".animate-on-scroll");
  elementsToAnimate.forEach((el) => animationObserver.observe(el));

  // --- 5. FAQ Accordion ---
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    if (question) {
      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        faqItems.forEach((otherItem) => {
          otherItem.classList.remove("active");
          otherItem.querySelector(".faq-answer").style.maxHeight = null;
        });
        if (!isActive) {
          item.classList.add("active");
          item.querySelector(".faq-answer").style.maxHeight =
            item.querySelector(".faq-answer").scrollHeight + "px";
        }
      });
    }
  });

  // --- 6. Story/Testimonial Section Logic ---
  const storySection = document.getElementById("story");
  if (storySection) {
    const testimonials = [
      {
        quote:
          "「パソコンが苦手だった私が、今では在宅でWebの仕事を受けています」",
        author: "- A.Sさん (32歳) / 元・事務職",
        image: "assets/images/story2.png",
      },
      {
        quote: "「全くの未経験だった私が、憧れのIT業界で働いています！」",
        author: "- M.Kさん (24歳) / 元・アパレル販売",
        image: "assets/images/story1.png",
      },
      {
        quote:
          "「年齢を気にせず挑戦して本当によかった。毎日が充実しています。」",
        author: "- Y.Tさん (38歳) / 元・主婦",
        image: "assets/images/story3.png",
      },
      {
        quote: "「子育てと両立できるスキルが身につき、心に余裕ができました。」",
        author: "- H.Nさん (29歳) / 元・保育士",
        image: "assets/images/story4.png",
      },
      {
        quote: "「副業で始めたWeb制作が、今では本業以上の収入に。」",
        author: "- R.Iさん (27歳) / 元・営業職",
        image: "assets/images/story5.png",
      },
      {
        quote: "「自分の力でサービスを作れるようになり、世界が広がりました。」",
        author: "- S.Oさん (25歳) / 元・大学生",
        image: "assets/images/story6.png",
      },
    ];
    const quoteEl = document.getElementById("testimonial-quote");
    const authorEl = document.getElementById("testimonial-author");
    const prevBtn = document.getElementById("prev-testimonial");
    const nextBtn = document.getElementById("next-testimonial");
    let currentIndex = 0;
    const desktopAvatars = document.querySelectorAll(".avatar");
    const mobileMainImage = document.getElementById("mobile-testimonial-image");
    const mobileThumbnailsContainer = document.querySelector(
      ".story-mobile-thumbnails"
    );
    let mobileThumbnails = [];

    const initStorySlider = () => {
      if (!mobileThumbnailsContainer) return;
      mobileThumbnailsContainer.innerHTML = "";
      testimonials.forEach((testimonial, index) => {
        const thumb = document.createElement("div");
        thumb.className = "story-mobile-thumb";
        thumb.dataset.index = index;
        const img = document.createElement("img");
        img.src = testimonial.image;
        img.alt = `Testimonial from ${testimonial.author}`;
        thumb.appendChild(img);
        mobileThumbnailsContainer.appendChild(thumb);
        thumb.addEventListener("click", () => updateContent(index));
      });
      mobileThumbnails = document.querySelectorAll(".story-mobile-thumb");
    };

    const updateContent = (index, isInitial = false) => {
      if (!quoteEl || !authorEl) return;
      const testimonial = testimonials[index];
      currentIndex = index;
      quoteEl.style.opacity = 0;
      authorEl.style.opacity = 0;
      if (mobileMainImage) mobileMainImage.style.opacity = 0;
      setTimeout(
        () => {
          quoteEl.innerHTML = testimonial.quote;
          authorEl.innerHTML = testimonial.author;
          if (mobileMainImage) mobileMainImage.src = testimonial.image;
          quoteEl.style.opacity = 1;
          authorEl.style.opacity = 1;
          if (mobileMainImage) mobileMainImage.style.opacity = 1;
        },
        isInitial ? 0 : 200
      );
      desktopAvatars.forEach((avatar) => {
        avatar.classList.toggle(
          "is-active",
          parseInt(avatar.dataset.index) === index
        );
      });
      if (mobileThumbnails.length > 0) {
        mobileThumbnails.forEach((thumb, i) => {
          thumb.classList.toggle("is-active", i === index);
        });
      }
    };

    if (prevBtn)
      prevBtn.addEventListener("click", () => {
        const newIndex =
          (currentIndex - 1 + testimonials.length) % testimonials.length;
        updateContent(newIndex);
      });
    if (nextBtn)
      nextBtn.addEventListener("click", () => {
        const newIndex = (currentIndex + 1) % testimonials.length;
        updateContent(newIndex);
      });
    desktopAvatars.forEach((avatar) => {
      avatar.addEventListener("click", () => {
        const index = parseInt(avatar.dataset.index, 10);
        updateContent(index);
      });
    });
    const storyObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          initStorySlider();
          updateContent(0, true);
          storyObserver.unobserve(storySection);
        }
      },
      { threshold: 0.4 }
    );
    storyObserver.observe(storySection);
  }

  // --- 7. Career Path Tabs Logic ---
  const tabsContainer = document.querySelector(".career-path-tabs");
  if (tabsContainer) {
    const tabButtons = tabsContainer.querySelectorAll(".career-tab-button");
    const tabPanels = document.querySelectorAll(".career-path-panel");
    tabsContainer.addEventListener("click", (e) => {
      const clickedTab = e.target.closest(".career-tab-button");
      if (!clickedTab) return;
      e.preventDefault();
      tabButtons.forEach((button) => button.classList.remove("is-active"));
      clickedTab.classList.add("is-active");
      const targetTab = clickedTab.dataset.tab;
      tabPanels.forEach((panel) => panel.classList.remove("is-active"));
      const targetPanel = document.getElementById(targetTab);
      if (targetPanel) {
        targetPanel.classList.add("is-active");
      }
    });
  }

  // --- 8. "The Personal Advisor" Section Logic ---
  const advisorSection = document.querySelector(".advisor-section");
  if (advisorSection) {
    const supportData = [
      {
        title: "キャリア相談",
        description:
          "女性キャリアアドバイザーがあなたの経験や目標を丁寧にヒアリングし、最適なキャリアプランを一緒に設計します。",
        image: "assets/images/career1.png",
      },
      {
        title: "ポートフォリオ作成支援",
        description:
          "あなたのスキルと個性を最大限にアピールできるよう、GitHubやCanvaを使った魅力的な作品集作りを指導します。",
        image: "assets/images/career2.png",
      },
      {
        title: "企業紹介制度",
        description:
          "あなたの希望やスキルに合った提携企業へ推薦。自信を持って面接に臨めるよう、万全のサポートをします。",
        image: "assets/images/career3.png",
      },
      {
        title: "在宅案件紹介",
        description:
          "卒業後すぐに実践経験が積めるよう、ママ・主婦向けのフレキシブルな在宅ワーク案件をご紹介します。",
        image: "assets/images/career4.png",
      },
    ];

    const cardsContainer = advisorSection.querySelector(".advisor-info-cards");
    const prevBtn = document.getElementById("advisor-prev-btn");
    const nextBtn = document.getElementById("advisor-next-btn");
    const progressBar = document.getElementById("advisor-progress-bar");

    let currentIndex = 0;

    function renderCards() {
      if (!cardsContainer) return;
      cardsContainer.innerHTML = "";
      supportData.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "info-card";
        card.id = `support-card-${index}`;
        card.innerHTML = `
          <span class="panel-number">0${index + 1}</span>
          <h4>${item.title}</h4>
          <p>${item.description}</p>
        `;
        cardsContainer.appendChild(card);
      });
    }

    function updateAdvisorView(newIndex) {
      currentIndex = newIndex;

      if (cardsContainer) {
        const allCards = cardsContainer.querySelectorAll(".info-card");
        allCards.forEach((card, index) => {
          card.classList.toggle("is-active", index === currentIndex);
        });
      }

      // --- Đồng bộ hóa Hình ảnh (Kỹ thuật Cross-Fade) ---
      const imageA = document.getElementById("advisor-image-a");
      const imageB = document.getElementById("advisor-image-b");

      if (imageA && imageB) {
        const activeImage = imageA.classList.contains("is-active")
          ? imageA
          : imageB;
        const inactiveImage = imageA.classList.contains("is-active")
          ? imageB
          : imageA;

        // Chỉ thay đổi nếu ảnh mới thực sự khác ảnh cũ
        if (!inactiveImage.src.endsWith(supportData[currentIndex].image)) {
          inactiveImage.src = supportData[currentIndex].image;
        }

        activeImage.classList.remove("is-active");
        inactiveImage.classList.add("is-active");
      }

      // --- Cập nhật Progress Bar ---
      if (progressBar) {
        const progressPercentage =
          ((currentIndex + 1) / supportData.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
      }
    }

    function navigate(direction) {
      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % supportData.length
          : (currentIndex - 1 + supportData.length) % supportData.length;
      updateAdvisorView(newIndex);
    }

    if (nextBtn) nextBtn.addEventListener("click", () => navigate("next"));
    if (prevBtn) prevBtn.addEventListener("click", () => navigate("prev"));

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      const rect = advisorSection.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom >= 0;
      if (isInView) {
        if (e.key === "ArrowRight") navigate("next");
        if (e.key === "ArrowLeft") navigate("prev");
      }
    });

    // Swipe navigation
    let touchStartX = 0;
    if (cardsContainer) {
      cardsContainer.addEventListener(
        "touchstart",
        (e) => {
          touchStartX = e.changedTouches[0].screenX;
        },
        { passive: true }
      );
      cardsContainer.addEventListener(
        "touchend",
        (e) => {
          const touchEndX = e.changedTouches[0].screenX;
          if (touchStartX - touchEndX > 50) navigate("next");
          if (touchEndX - touchStartX > 50) navigate("prev");
        },
        { passive: true }
      );
    }

    // Initialize
    renderCards();
    updateAdvisorView(currentIndex);
  }
});
