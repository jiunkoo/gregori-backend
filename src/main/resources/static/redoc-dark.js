const getCSSVariable = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const WHITE_BG_PATTERN = /rgb\(250,\s*250,\s*250\)|rgb\(250/i;

const applyDarkStyles = () => {
  document.querySelectorAll('div[role="button"]').forEach((btn) => {
    btn.style.backgroundColor = getCSSVariable("--color-dark-gray-900");
    btn.style.background = getCSSVariable("--color-dark-gray-900");
    btn.style.boxShadow = "none";

    const inner = btn.querySelector("div");
    if (inner) {
      inner.style.backgroundColor = getCSSVariable("--color-dark-gray-900");
      inner.style.background = getCSSVariable("--color-dark-gray-900");
      inner.style.color = getCSSVariable("--color-dark-gray-200");
      inner.style.boxShadow = "none";

      const span = inner.querySelector("span");
      if (span) {
        span.style.backgroundColor = getCSSVariable("--color-dark-gray-900");
        span.style.color = getCSSVariable("--color-dark-blue-400");
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
      el.style.background = getCSSVariable("--color-dark-gray-900");
      el.style.backgroundColor = getCSSVariable("--color-dark-gray-900");
      el.style.backgroundImage = "none";
      el.style.color = getCSSVariable("--color-dark-gray-200");

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
          child.style.background = getCSSVariable("--color-dark-gray-900");
          child.style.backgroundColor = getCSSVariable("--color-dark-gray-900");
        }

        if (
          child.tagName === "A" ||
          (child.tagName === "SPAN" && child.textContent.trim())
        ) {
          child.style.color = getCSSVariable("--color-dark-blue-400");
        } else if (
          childComputedStyle.color.includes("38, 50, 56") ||
          childComputedStyle.color.includes("rgb(38")
        ) {
          child.style.color = getCSSVariable("--color-dark-gray-200");
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
    primary: { main: getCSSVariable("--color-dark-blue-400") },
    text: {
      primary: getCSSVariable("--color-dark-gray-200"),
      secondary: getCSSVariable("--color-dark-gray-400"),
    },
    http: {
      get: getCSSVariable("--color-dark-blue-400"),
      post: getCSSVariable("--color-dark-green-600"),
      put: getCSSVariable("--color-dark-yellow-300"),
      delete: getCSSVariable("--color-dark-red-500"),
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
    backgroundColor: getCSSVariable("--color-dark-gray-800"),
    textColor: getCSSVariable("--color-dark-gray-300"),
    activeTextColor: getCSSVariable("--color-dark-blue-400"),
  },
  rightPanel: {
    backgroundColor: getCSSVariable("--color-dark-gray-900"),
  },
  codeBlock: {
    backgroundColor: getCSSVariable("--color-dark-gray-900"),
  },
  schema: {
    typeNameColor: getCSSVariable("--color-dark-blue-400"),
    requireLabelColor: getCSSVariable("--color-dark-red-500"),
    linesColor: getCSSVariable("--color-dark-gray-500"),
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
