const getCSSVariable = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const THEME_STORAGE_KEY = "redoc-theme";
const DEFAULT_THEME = "dark";

let currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME;
let styleObserver = null;
let clickHandler = null;

const WHITE_BG_PATTERN = /rgb\(250,\s*250,\s*250\)|rgb\(250/i;
const DARK_BG_PATTERN = /rgb\(30,\s*30,\s*30\)|rgb\(30/i;

const getThemeCSSVar = (varName) => {
  const themePrefix = currentTheme === "dark" ? "--dark-" : "--light-";
  return getCSSVariable(themePrefix + varName);
};

const applyDarkStyles = () => {
  document.querySelectorAll('div[role="button"]').forEach((btn) => {
    const bgColor = getCSSVariable("--dark-bg");
    btn.style.backgroundColor = bgColor;
    btn.style.background = bgColor;
    btn.style.boxShadow = "none";

    const inner = btn.querySelector("div");
    if (inner) {
      inner.style.backgroundColor = bgColor;
      inner.style.background = bgColor;
      inner.style.color = getCSSVariable("--dark-text");
      inner.style.boxShadow = "none";

      const span = inner.querySelector("span");
      if (span) {
        span.style.backgroundColor = bgColor;
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
      const bgColor = getCSSVariable("--dark-bg");
      el.style.background = bgColor;
      el.style.backgroundColor = bgColor;
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
          child.style.background = bgColor;
          child.style.backgroundColor = bgColor;
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
    const bgColor = getCSSVariable("--light-bg");
    btn.style.backgroundColor = bgColor;
    btn.style.background = bgColor;
    btn.style.boxShadow = "none";

    const inner = btn.querySelector("div");
    if (inner) {
      inner.style.backgroundColor = bgColor;
      inner.style.background = bgColor;
      inner.style.color = getCSSVariable("--light-text");
      inner.style.boxShadow = "none";

      const span = inner.querySelector("span");
      if (span) {
        span.style.backgroundColor = bgColor;
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
      const bgColor = getCSSVariable("--light-bg");
      el.style.background = bgColor;
      el.style.backgroundColor = bgColor;
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
          child.style.background = bgColor;
          child.style.backgroundColor = bgColor;
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
  if (currentTheme === "dark") {
    applyDarkStyles();
  } else {
    applyLightStyles();
  }
};

const getRedocTheme = () => {
  if (currentTheme === "dark") {
    return {
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
    };
  } else {
    return {
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
    };
  }
};

const loadThemeCSS = (theme) => {
  return new Promise((resolve) => {
    const existingLink = document.querySelector('link[href*="redoc-"]');
    if (existingLink) {
      existingLink.remove();
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `/redoc-${theme}.css`;

    link.onload = () => resolve();
    link.onerror = () => resolve(); // Even on error, continue to avoid blocking

    document.head.appendChild(link);

    // Fallback timeout to ensure we don't wait forever
    setTimeout(() => resolve(), 500);
  });
};

const updateThemeToggleButton = () => {
  const toggleButton = document.getElementById("theme-toggle");
  if (toggleButton) {
    toggleButton.textContent = currentTheme === "dark" ? "☀️ Light" : "🌙 Dark";
    toggleButton.setAttribute(
      "aria-label",
      `Switch to ${currentTheme === "dark" ? "light" : "dark"} theme`
    );
  }
};

const switchTheme = async () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, currentTheme);

  await loadThemeCSS(currentTheme);
  updateThemeToggleButton();

  if (window.redocInstance) {
    window.redocInstance.dispose();
  }

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

  const toggleButton = document.getElementById("theme-toggle");
  if (toggleButton) {
    toggleButton.addEventListener("click", switchTheme);
  }

  clickHandler = () => {
    setTimeout(applyStyles, 0);
    requestAnimationFrame(applyStyles);
  };

  document.addEventListener("click", clickHandler, true);

  styleObserver = new MutationObserver(() => {
    requestAnimationFrame(applyStyles);
  });

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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTheme);
} else {
  initTheme();
}
