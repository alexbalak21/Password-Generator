// =========================
// Theme handling
// =========================

const html = document.documentElement;

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  const themeToggle = document.getElementById("themeToggle");
  const moon = document.getElementById("moon");
  const sun = document.getElementById("sun");

  html.setAttribute("data-bs-theme", theme);

  const isDark = theme === "dark";

  sun.classList.toggle("d-none", !isDark);
  moon.classList.toggle("d-none", isDark);

  themeToggle.classList.toggle("btn-outline-dark", !isDark);
  themeToggle.classList.toggle("btn-outline-light", isDark);
}

function initThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");

  themeToggle.addEventListener("click", () => {
    const current = html.getAttribute("data-bs-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });
}



// =========================
// Copy button
// =========================

function initCopyButton(copyBtn, output) {
  const tooltip = new bootstrap.Tooltip(copyBtn, { trigger: "manual" });
  const originalHTML = copyBtn.innerHTML;

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(output.value);

    tooltip.show();
    copyBtn.innerText = "Copied!";
    copyBtn.classList.replace("btn-success", "btn-secondary");
    copyBtn.disabled = true;

    setTimeout(() => {
      tooltip.hide();
      copyBtn.innerHTML = originalHTML;
      copyBtn.classList.replace("btn-secondary", "btn-success");
      copyBtn.disabled = false;
    }, 700);
  });
}



// =========================
// Password generator
// =========================

const lowercase = "abcdefghijklmnopqrstuvwxyz";
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers   = "0123456789";
const symbols   = "!#$%&()*+,.;=?@[]^_{}~";

const specSymbolsInput = document.getElementById("spec_symbols_content");

function getChar(str) {
  return str[Math.floor(Math.random() * str.length)];
}

function dedupe(str) {
  return [...new Set(str)].join("");
}

function generatePassword() {
  let pool = "";

  const useLower   = document.getElementById("Lowercase").checked;
  const useUpper   = document.getElementById("Uppercase").checked;
  const useNumbers = document.getElementById("Numbers").checked;
  const useSymbols = document.getElementById("Symbols").checked;
  const useCustom  = document.getElementById("spec_symbols").checked;

  if (useLower)   pool += lowercase;
  if (useUpper)   pool += uppercase;
  if (useNumbers) pool += numbers;
  if (useSymbols) pool += symbols;

  if (useCustom) {
    let custom = specSymbolsInput.value || "";
    custom = custom.replace(/\s+/g, "");
    pool += custom;
  }

  pool = dedupe(pool);

  if (pool.length === 0) {
    console.error("No character types selected.");
    return "";
  }

  const length = Number(document.getElementById("length").value) || 16;
  let password = "";

  for (let i = 0; i < length; i++) {
    password += getChar(pool);
  }

  return password;
}



// =========================
// Length buttons
// =========================

function initLengthButtons() {
  const length = document.getElementById("length");

  document.getElementById("plus").addEventListener("click", () => {
    if (length.value < 64) length.value++;
  });

  document.getElementById("minus").addEventListener("click", () => {
    if (length.value > 1) length.value--;
  });
}



// =========================
// SVG loader
// =========================

async function loadSVG(id, file) {
  const container = document.getElementById(id);
  try {
    const svg = await fetch(file).then(res => res.text());
    container.innerHTML = svg;
  } catch (err) {
    console.error("Failed to load SVG:", file, err);
  }
}



// =========================
// App initialization
// =========================

async function initApp() {
  const output = document.getElementById("output");
  const copyBtn = document.getElementById("copy");
  const generateBtn = document.getElementById("generate");

  await loadSVG("moon", "assets/icons/moon.svg");
  await loadSVG("sun", "assets/icons/sun.svg");
  await loadSVG("copyIcon", "assets/icons/copy.svg");

  applyTheme(getSystemTheme());
  initThemeToggle();

  initCopyButton(copyBtn, output);
  initLengthButtons();

  generateBtn.addEventListener("click", () => {
    output.value = generatePassword();
  });

  output.value = generatePassword();
}

initApp();
