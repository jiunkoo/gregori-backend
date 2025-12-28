const getCSSVariable = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const THEME_STORAGE_KEY = "redoc-theme";
const DEFAULT_THEME = "dark";

let currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME;
let styleObserver = null;
let clickHandler = null;

const WHITE_BG_PATTERN = /rgb\(250,\s*250,\s*250\)|rgb\(250/i;
const DARK_BG_PATTERN = /rgb\(30,\s*30,\s*30\)|rgb\(30/i;

const isDarkTheme = () => currentTheme === "dark";

const getThemeCSSVar = (name) =>
  getCSSVariable(`${isDarkTheme() ? "--dark-" : "--light-"}${name}`);

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

const applyStyles = () => {
  isDarkTheme() ? applyDarkStyles() : applyLightStyles();
};

const getRedocTheme = () => ({
  colors: {
    primary: { main: getCSSVariable("--accent-color") },
    text: {
      primary: getThemeCSSVar("text"),
      secondary: getThemeCSSVar("text-secondary"),
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
    backgroundColor: getThemeCSSVar("sidebar-bg"),
    textColor: getThemeCSSVar("sidebar-text"),
    activeTextColor: getCSSVariable("--accent-color"),
  },
  rightPanel: {
    backgroundColor: getThemeCSSVar("bg"),
  },
  codeBlock: {
    backgroundColor: getThemeCSSVar("bg"),
  },
  schema: {
    typeNameColor: getCSSVariable("--accent-color"),
    requireLabelColor: getCSSVariable("--require-label"),
    linesColor: getCSSVariable("--border-color"),
  },
});

const loadThemeCSS = (theme) =>
  new Promise((resolve) => {
    document.querySelector('link[href*="redoc-"]')?.remove();

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `/redoc-${theme}.css`;
    link.onload = resolve;
    link.onerror = resolve;

    document.head.appendChild(link);
    setTimeout(resolve, 500);
  });

const updateThemeToggleButton = () => {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  btn.setAttribute("data-theme", currentTheme);
  btn.setAttribute(
    "aria-label",
    `Switch to ${isDarkTheme() ? "light" : "dark"} theme`
  );
};

const switchTheme = async () => {
  currentTheme = isDarkTheme() ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, currentTheme);

  await loadThemeCSS(currentTheme);
  updateThemeToggleButton();

  window.redocInstance?.dispose();

  window.redocInstance = Redoc.init(
    "/api-docs",
    {
      hideDownloadButton: true,
      expandResponses: "200,201",
      scrollYOffset: 48,
      theme: getRedocTheme(),
    },
    document.getElementById("redoc-container")
  );

  setTimeout(applyStyles, 100);
  setTimeout(applyStyles, 500);
};

const initTheme = async () => {
  await loadThemeCSS(currentTheme);
  updateThemeToggleButton();

  document
    .getElementById("theme-toggle")
    ?.addEventListener("click", switchTheme);

  clickHandler = () => requestAnimationFrame(applyStyles);
  document.addEventListener("click", clickHandler, true);

  styleObserver = new MutationObserver(() =>
    requestAnimationFrame(applyStyles)
  );

  styleObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "aria-hidden"],
  });

  window.redocInstance = Redoc.init(
    "/api-docs",
    {
      hideDownloadButton: true,
      expandResponses: "200,201",
      scrollYOffset: 48,
      theme: getRedocTheme(),
    },
    document.getElementById("redoc-container")
  );

  setTimeout(applyStyles, 100);
  setTimeout(applyStyles, 500);
};

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", initTheme)
  : initTheme();
