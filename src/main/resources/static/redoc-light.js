const getCSSVariable = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const DARK_BG_PATTERN = /rgb\(30,\s*30,\s*30\)|rgb\(30/i;

const applyLightStyles = () => {
  document.querySelectorAll('div[role="button"]').forEach((btn) => {
    btn.style.backgroundColor = getCSSVariable("--light-bg");
    btn.style.background = getCSSVariable("--light-bg");
    btn.style.boxShadow = "none";

    const inner = btn.querySelector("div");
    if (inner) {
      inner.style.backgroundColor = getCSSVariable("--light-bg");
      inner.style.background = getCSSVariable("--light-bg");
      inner.style.color = getCSSVariable("--light-text");
      inner.style.boxShadow = "none";

      const span = inner.querySelector("span");
      if (span) {
        span.style.backgroundColor = getCSSVariable("--light-bg");
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

    const hasDarkBg =
      DARK_BG_PATTERN.test(styleAttr) ||
      DARK_BG_PATTERN.test(inlineBg) ||
      DARK_BG_PATTERN.test(computedBg);

    const isDropdown =
      computedStyle.position === "absolute" &&
      parseInt(computedStyle.zIndex || "0") >= 100;

    if (hasDarkBg || (isDropdown && computedBg.includes("30"))) {
      el.style.background = getCSSVariable("--light-bg");
      el.style.backgroundColor = getCSSVariable("--light-bg");
      el.style.backgroundImage = "none";
      el.style.color = getCSSVariable("--light-text");

      el.querySelectorAll("*").forEach((child) => {
        const childComputedStyle = window.getComputedStyle(child);
        const childBg =
          childComputedStyle.background ||
          childComputedStyle.backgroundColor ||
          "";
        const childInlineBg =
          child.style.background || child.style.backgroundColor || "";

        if (
          DARK_BG_PATTERN.test(childBg) ||
          DARK_BG_PATTERN.test(childInlineBg)
        ) {
          child.style.background = getCSSVariable("--light-bg");
          child.style.backgroundColor = getCSSVariable("--light-bg");
        }

        if (
          child.tagName === "A" ||
          (child.tagName === "SPAN" && child.textContent.trim())
        ) {
          child.style.color = getCSSVariable("--accent-color");
        } else if (
          childComputedStyle.color.includes("212, 212, 212") ||
          childComputedStyle.color.includes("rgb(212")
        ) {
          child.style.color = getCSSVariable("--light-text");
        }
      });
    }
  });
};

applyLightStyles();

document.addEventListener(
  "click",
  () => {
    setTimeout(applyLightStyles, 0);
    requestAnimationFrame(applyLightStyles);
  },
  true
);

const observer = new MutationObserver(() => {
  requestAnimationFrame(applyLightStyles);
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
      primary: getCSSVariable("--light-text"),
      secondary: getCSSVariable("--light-text-secondary"),
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
    backgroundColor: getCSSVariable("--light-sidebar-bg"),
    textColor: getCSSVariable("--light-sidebar-text"),
    activeTextColor: getCSSVariable("--accent-color"),
  },
  rightPanel: {
    backgroundColor: getCSSVariable("--light-bg"),
  },
  codeBlock: {
    backgroundColor: getCSSVariable("--light-bg"),
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

setTimeout(applyLightStyles, 100);
setTimeout(applyLightStyles, 500);
