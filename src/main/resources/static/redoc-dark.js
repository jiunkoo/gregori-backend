const getCSSVariable = (name) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
};

const DARK_BG = getCSSVariable("--dark-bg");
const DARK_TEXT = getCSSVariable("--dark-text");
const ACCENT_COLOR = getCSSVariable("--accent-color");
const BORDER_COLOR = getCSSVariable("--border-color");
const WHITE_BG_PATTERN = /rgb\(250,\s*250,\s*250\)|rgb\(250/i;

const applyDarkStyles = () => {
  document.querySelectorAll('div[role="button"]').forEach((btn) => {
    btn.style.backgroundColor = DARK_BG;
    btn.style.background = DARK_BG;
    btn.style.boxShadow = "none";

    const inner = btn.querySelector("div");
    if (inner) {
      inner.style.backgroundColor = DARK_BG;
      inner.style.background = DARK_BG;
      inner.style.color = DARK_TEXT;
      inner.style.border = `1px solid ${BORDER_COLOR}`;
      inner.style.borderRadius = "6px";
      inner.style.fontFamily = "JetBrains Mono, monospace";
      inner.style.boxShadow = "none";

      const span = inner.querySelector("span");
      if (span) {
        span.style.backgroundColor = DARK_BG;
        span.style.color = ACCENT_COLOR;
      }
    }
  });

  document.querySelectorAll("div").forEach((el) => {
    const styleAttr = el.getAttribute("style") || "";
    const inlineBg = el.style.background || el.style.backgroundColor || "";
    const computedStyle = window.getComputedStyle(el);
    const computedBg =
      computedStyle.background || computedStyle.backgroundColor || "";

    const hasWhiteBg =
      WHITE_BG_PATTERN.test(styleAttr) ||
      WHITE_BG_PATTERN.test(inlineBg) ||
      WHITE_BG_PATTERN.test(computedBg) ||
      computedBg === "rgb(250, 250, 250)" ||
      computedBg === "rgba(250, 250, 250, 1)";

    const isDropdown =
      computedStyle.position === "absolute" &&
      parseInt(computedStyle.zIndex || "0") >= 100;

    if (hasWhiteBg || (isDropdown && computedBg.includes("250"))) {
      el.style.background = DARK_BG;
      el.style.backgroundColor = DARK_BG;
      el.style.backgroundImage = "none";
      el.style.color = DARK_TEXT;

      el.querySelectorAll("*").forEach((child) => {
        const childComputedStyle = window.getComputedStyle(child);
        const childBg =
          childComputedStyle.background ||
          childComputedStyle.backgroundColor ||
          "";
        const childInlineBg =
          child.style.background || child.style.backgroundColor || "";

        if (
          WHITE_BG_PATTERN.test(childBg) ||
          WHITE_BG_PATTERN.test(childInlineBg)
        ) {
          child.style.background = DARK_BG;
          child.style.backgroundColor = DARK_BG;
        }

        if (
          child.tagName === "A" ||
          (child.tagName === "SPAN" && child.textContent.trim())
        ) {
          child.style.color = ACCENT_COLOR;
        } else if (
          childComputedStyle.color.includes("38, 50, 56") ||
          childComputedStyle.color.includes("rgb(38")
        ) {
          child.style.color = DARK_TEXT;
        }
      });
    }
  });
};

applyDarkStyles();

document.addEventListener(
  "click",
  () => {
    setTimeout(applyDarkStyles, 0);
    requestAnimationFrame(applyDarkStyles);
  },
  true
);

const observer = new MutationObserver(() => {
  requestAnimationFrame(applyDarkStyles);
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["style", "aria-hidden"],
});

Redoc.init(
  "/api-docs",
  {
    hideDownloadButton: true,
    expandResponses: "200,201",
    scrollYOffset: 48,
    theme: {
      colors: {
        primary: { main: ACCENT_COLOR },
        text: {
          primary: DARK_TEXT,
          secondary: "#aaaaaa",
        },
        http: {
          get: ACCENT_COLOR,
          post: "#6a9955",
          put: "#dcdcaa",
          delete: "#f48771",
        },
      },
      typography: {
        fontFamily: "Inter, sans-serif",
        code: {
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "13px",
        },
      },
      sidebar: {
        backgroundColor: "#252526",
        textColor: "#cccccc",
        activeTextColor: ACCENT_COLOR,
      },
      rightPanel: {
        backgroundColor: DARK_BG,
      },
      codeBlock: {
        backgroundColor: DARK_BG,
      },
      schema: {
        typeNameColor: ACCENT_COLOR,
        requireLabelColor: "#f48771",
        linesColor: BORDER_COLOR,
      },
    },
  },
  document.getElementById("redoc-container")
);

setTimeout(applyDarkStyles, 100);
setTimeout(applyDarkStyles, 500);
