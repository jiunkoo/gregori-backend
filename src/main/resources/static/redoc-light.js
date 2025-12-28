const getCSSVariable = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const DARK_BG_PATTERN = /rgb\(30,\s*30,\s*30\)|rgb\(30/i;

const applyLightStyles = () => {
  document.querySelectorAll('div[role="button"]').forEach((btn) => {
    btn.style.backgroundColor = getCSSVariable("--color-light-white");
    btn.style.background = getCSSVariable("--color-light-white");
    btn.style.boxShadow = "none";

    const inner = btn.querySelector("div");
    if (inner) {
      inner.style.backgroundColor = getCSSVariable("--color-light-white");
      inner.style.background = getCSSVariable("--color-light-white");
      inner.style.color = getCSSVariable("--color-light-gray-900");
      inner.style.boxShadow = "none";

      const span = inner.querySelector("span");
      if (span) {
        span.style.backgroundColor = getCSSVariable("--color-light-white");
        span.style.color = getCSSVariable("--color-light-blue-500");
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
      el.style.background = getCSSVariable("--color-light-white");
      el.style.backgroundColor = getCSSVariable("--color-light-white");
      el.style.backgroundImage = "none";
      el.style.color = getCSSVariable("--color-light-gray-900");

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
          child.style.background = getCSSVariable("--color-light-white");
          child.style.backgroundColor = getCSSVariable("--color-light-white");
        }

        if (
          child.tagName === "A" ||
          (child.tagName === "SPAN" && child.textContent.trim())
        ) {
          child.style.color = getCSSVariable("--color-light-blue-500");
        } else if (
          childComputedStyle.color.includes("212, 212, 212") ||
          childComputedStyle.color.includes("rgb(212")
        ) {
          child.style.color = getCSSVariable("--color-light-gray-900");
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
    primary: { main: getCSSVariable("--color-light-blue-500") },
    text: {
      primary: getCSSVariable("--color-light-gray-900"),
      secondary: getCSSVariable("--color-light-gray-600"),
    },
    http: {
      get: getCSSVariable("--color-light-blue-500"),
      post: getCSSVariable("--color-light-green-500"),
      put: getCSSVariable("--color-light-yellow-500"),
      delete: getCSSVariable("--color-light-red-500"),
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
    backgroundColor: getCSSVariable("--color-light-gray-100"),
    textColor: getCSSVariable("--color-light-gray-700"),
    activeTextColor: getCSSVariable("--color-light-blue-500"),
  },
  rightPanel: {
    backgroundColor: getCSSVariable("--color-light-white"),
  },
  codeBlock: {
    backgroundColor: getCSSVariable("--color-light-white"),
  },
  schema: {
    typeNameColor: getCSSVariable("--color-light-blue-500"),
    requireLabelColor: getCSSVariable("--color-light-red-500"),
    linesColor: getCSSVariable("--color-light-gray-700"),
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
