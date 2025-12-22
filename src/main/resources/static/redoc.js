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

const styleRoleButtons = (bgVar, textVar) => {
  document.querySelectorAll('div[role="button"]').forEach((btn) => {
    const bgColor = getCSSVariable(bgVar);

    btn.style.background = bgColor;
    btn.style.boxShadow = "none";

    const inner = btn.querySelector("div");
    if (!inner) return;

    inner.style.background = bgColor;
    inner.style.color = getCSSVariable(textVar);
    inner.style.boxShadow = "none";

    const span = inner.querySelector("span");
    if (span) {
      span.style.backgroundColor = bgColor;
      span.style.color = getCSSVariable("--accent-color");
    }
  });
};

const normalizeBackground = ({
  matchPattern,
  bgVar,
  textVar,
  dropdownBgHint,
  textFallbackPattern,
}) => {
  document.querySelectorAll("div").forEach((el) => {
    const styleAttr = el.getAttribute("style") || "";
    const inlineBg = el.style.background || el.style.backgroundColor || "";
    const computed = window.getComputedStyle(el);
    const computedBg = computed.background || computed.backgroundColor || "";

    const hasTargetBg =
      matchPattern.test(styleAttr) ||
      matchPattern.test(inlineBg) ||
      matchPattern.test(computedBg);

    const isDropdown =
      computed.position === "absolute" &&
      parseInt(computed.zIndex || "0") >= 100 &&
      computedBg.includes(dropdownBgHint);

    if (!hasTargetBg && !isDropdown) return;

    const bgColor = getCSSVariable(bgVar);
    const textColor = getCSSVariable(textVar);

    el.style.background = bgColor;
    el.style.backgroundImage = "none";
    el.style.color = textColor;

    el.querySelectorAll("*").forEach((child) => {
      const childComputed = window.getComputedStyle(child);
      const childBg =
        childComputed.background || childComputed.backgroundColor || "";
      const childInlineBg =
        child.style.background || child.style.backgroundColor || "";

      if (matchPattern.test(childBg) || matchPattern.test(childInlineBg)) {
        child.style.background = bgColor;
      }

      if (
        child.tagName === "A" ||
        (child.tagName === "SPAN" && child.textContent.trim())
      ) {
        child.style.color = getCSSVariable("--accent-color");
      } else if (textFallbackPattern.test(childComputed.color)) {
        child.style.color = textColor;
      }
    });
  });
};

const applyDarkStyles = () => {
  styleRoleButtons("--dark-bg", "--dark-text");

  normalizeBackground({
    matchPattern: WHITE_BG_PATTERN,
    bgVar: "--dark-bg",
    textVar: "--dark-text",
    dropdownBgHint: "250",
    textFallbackPattern: /rgb\(38|38,\s*50,\s*56/,
  });
};

const applyLightStyles = () => {
  styleRoleButtons("--light-bg", "--light-text");

  normalizeBackground({
    matchPattern: DARK_BG_PATTERN,
    bgVar: "--light-bg",
    textVar: "--light-text",
    dropdownBgHint: "30",
    textFallbackPattern: /rgb\(212|212,\s*212,\s*212/,
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

  btn.textContent = isDarkTheme() ? "☀️ Light" : "🌙 Dark";
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
