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

const getThemeCSSVar = (name) => {
  if (isDarkTheme()) {
    const darkMap = {
      bg: "--color-dark-gray-900",
      text: "--color-dark-gray-200",
      "text-secondary": "--color-dark-gray-400",
      "sidebar-bg": "--color-dark-gray-800",
      "sidebar-text": "--color-dark-gray-300",
    };
    return getCSSVariable(darkMap[name] || `--color-dark-${name}`);
  } else {
    const lightMap = {
      bg: "--color-light-white",
      text: "--color-light-gray-900",
      "text-secondary": "--color-light-gray-600",
      "sidebar-bg": "--color-light-gray-100",
      "sidebar-text": "--color-light-gray-700",
    };
    return getCSSVariable(lightMap[name] || `--color-light-${name}`);
  }
};

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

const applyStyles = () => {
  isDarkTheme() ? applyDarkStyles() : applyLightStyles();
};

const getRedocTheme = () => ({
  colors: {
    primary: {
      main: getCSSVariable(
        isDarkTheme() ? "--color-dark-blue-400" : "--color-light-blue-500"
      ),
    },
    text: {
      primary: getThemeCSSVar("text"),
      secondary: getThemeCSSVar("text-secondary"),
    },
    http: {
      get: getCSSVariable(
        isDarkTheme() ? "--color-dark-blue-400" : "--color-light-blue-500"
      ),
      post: getCSSVariable(
        isDarkTheme() ? "--color-dark-green-600" : "--color-light-green-500"
      ),
      put: getCSSVariable(
        isDarkTheme() ? "--color-dark-yellow-300" : "--color-light-yellow-500"
      ),
      delete: getCSSVariable(
        isDarkTheme() ? "--color-dark-red-500" : "--color-light-red-500"
      ),
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
    activeTextColor: getCSSVariable(
      isDarkTheme() ? "--color-dark-blue-400" : "--color-light-blue-500"
    ),
  },
  rightPanel: {
    backgroundColor: getThemeCSSVar("bg"),
  },
  codeBlock: {
    backgroundColor: getThemeCSSVar("bg"),
  },
  schema: {
    typeNameColor: getCSSVariable(
      isDarkTheme() ? "--color-dark-blue-400" : "--color-light-blue-500"
    ),
    requireLabelColor: getCSSVariable(
      isDarkTheme() ? "--color-dark-red-500" : "--color-light-red-500"
    ),
    linesColor: getCSSVariable(
      isDarkTheme() ? "--color-dark-gray-500" : "--color-light-gray-700"
    ),
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
