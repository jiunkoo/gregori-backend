const getCSSVariable = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const WHITE_BG_PATTERN = /rgb\(250,\s*250,\s*250\)|rgb\(250/i;

const applyDarkStyles = () => {
  document.querySelectorAll('div[role="button"]').forEach((btn) => {
    btn.style.backgroundColor = getCSSVariable("--dark-bg");
    btn.style.background = getCSSVariable("--dark-bg");
    btn.style.boxShadow = "none";

    const inner = btn.querySelector("div");
    if (inner) {
      inner.style.backgroundColor = getCSSVariable("--dark-bg");
      inner.style.background = getCSSVariable("--dark-bg");
      inner.style.color = getCSSVariable("--dark-text");
      inner.style.boxShadow = "none";

      const span = inner.querySelector("span");
      if (span) {
        span.style.backgroundColor = getCSSVariable("--dark-bg");
        span.style.color = getCSSVariable("--accent-color");
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
      WHITE_BG_PATTERN.test(computedBg);

    const isDropdown =
      computedStyle.position === "absolute" &&
      parseInt(computedStyle.zIndex || "0") >= 100;

    if (hasWhiteBg || (isDropdown && computedBg.includes("250"))) {
      el.style.background = getCSSVariable("--dark-bg");
      el.style.backgroundColor = getCSSVariable("--dark-bg");
      el.style.backgroundImage = "none";
      el.style.color = getCSSVariable("--dark-text");

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
          child.style.background = getCSSVariable("--dark-bg");
          child.style.backgroundColor = getCSSVariable("--dark-bg");
        }

        if (
          child.tagName === "A" ||
          (child.tagName === "SPAN" && child.textContent.trim())
        ) {
          child.style.color = getCSSVariable("--accent-color");
        } else if (
          childComputedStyle.color.includes("38, 50, 56") ||
          childComputedStyle.color.includes("rgb(38")
        ) {
          child.style.color = getCSSVariable("--dark-text");
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

const getRedocTheme = () => ({
  colors: {
    primary: { main: getCSSVariable("--accent-color") },
    text: {
      primary: getCSSVariable("--dark-text"),
      secondary: getCSSVariable("--dark-text-secondary"),
    },
    http: {
      get: getCSSVariable("--accent-color"),
      post: getCSSVariable("--http-post"),
      put: getCSSVariable("--http-put"),
      delete: getCSSVariable("--http-delete"),
    },
  },
  typography: {
    fontFamily: getCSSVariable("--font-family"),
    code: {
      fontFamily: getCSSVariable("--font-family-code"),
      fontSize: getCSSVariable("--font-size-code"),
    },
  },
  sidebar: {
    backgroundColor: getCSSVariable("--dark-sidebar-bg"),
    textColor: getCSSVariable("--dark-sidebar-text"),
    activeTextColor: getCSSVariable("--accent-color"),
  },
  rightPanel: {
    backgroundColor: getCSSVariable("--dark-bg"),
  },
  codeBlock: {
    backgroundColor: getCSSVariable("--dark-bg"),
  },
  schema: {
    typeNameColor: getCSSVariable("--accent-color"),
    requireLabelColor: getCSSVariable("--require-label"),
    linesColor: getCSSVariable("--border-color"),
  },
});

Redoc.init(
  "/api-docs",
  {
    hideDownloadButton: true,
    expandResponses: "200,201",
    scrollYOffset: 48,
    theme: getRedocTheme(),
  },
  document.getElementById("redoc-container")
);

setTimeout(applyDarkStyles, 100);
setTimeout(applyDarkStyles, 500);
